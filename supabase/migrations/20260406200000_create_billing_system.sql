-- Migration: Complete Billing System for Lemon Squeezy Integration
-- Author: TON618 Bot Team
-- Date: 2026-04-06
-- Fixed: statements made idempotent and compatible with Supabase/Postgres.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: users
-- Stores Discord user information
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  discord_user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  discriminator TEXT,
  avatar TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS discord_user_id TEXT,
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS discriminator TEXT,
  ADD COLUMN IF NOT EXISTS avatar TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF to_regclass('public.users') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conrelid = 'public.users'::regclass
         AND contype IN ('p', 'u')
         AND pg_get_constraintdef(oid) LIKE '%(discord_user_id)%'
     )
     AND NOT EXISTS (
       SELECT discord_user_id
       FROM public.users
       WHERE discord_user_id IS NOT NULL
       GROUP BY discord_user_id
       HAVING COUNT(*) > 1
     ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_discord_user_id_key UNIQUE (discord_user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email) WHERE email IS NOT NULL;

-- ============================================
-- TABLE: guild_subscriptions
-- Source of truth for guild premium status
-- ============================================
CREATE TABLE IF NOT EXISTS public.guild_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  discord_user_id TEXT NOT NULL REFERENCES public.users(discord_user_id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy' CHECK (provider IN ('lemon_squeezy', 'stripe', 'paypal')),
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  plan_key TEXT NOT NULL CHECK (plan_key IN ('pro_monthly', 'pro_yearly', 'lifetime')),
  billing_type TEXT NOT NULL CHECK (billing_type IN ('subscription', 'one_time')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'paused', 'incomplete')),
  premium_enabled BOOLEAN NOT NULL DEFAULT true,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  renews_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  lifetime BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guild_subscriptions_lifetime_no_dates CHECK (
    (lifetime = true AND renews_at IS NULL AND ends_at IS NULL) OR
    (lifetime = false)
  ),
  CONSTRAINT guild_subscriptions_subscription_has_provider_id CHECK (
    (billing_type = 'subscription' AND provider_subscription_id IS NOT NULL) OR
    (billing_type = 'one_time')
  )
);

ALTER TABLE IF EXISTS public.guild_subscriptions
  ADD COLUMN IF NOT EXISTS guild_id TEXT,
  ADD COLUMN IF NOT EXISTS discord_user_id TEXT,
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'lemon_squeezy',
  ADD COLUMN IF NOT EXISTS provider_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_key TEXT,
  ADD COLUMN IF NOT EXISTS billing_type TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS premium_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS renews_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lifetime BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_guild_subscription
  ON public.guild_subscriptions(guild_id)
  WHERE status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS idx_guild_subscriptions_unique_provider_sub_dedup
  ON public.guild_subscriptions(provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_guild ON public.guild_subscriptions(guild_id);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_user ON public.guild_subscriptions(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_provider_sub ON public.guild_subscriptions(provider_subscription_id) WHERE provider_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_status ON public.guild_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_guild_subscriptions_premium ON public.guild_subscriptions(premium_enabled, ends_at) WHERE premium_enabled = true;

-- ============================================
-- TABLE: purchases
-- All purchase records (subscriptions, lifetime, donations)
-- ============================================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  provider_order_id TEXT NOT NULL,
  provider_product_id TEXT,
  provider_variant_id TEXT,
  discord_user_id TEXT REFERENCES public.users(discord_user_id) ON DELETE SET NULL,
  guild_id TEXT,
  plan_key TEXT NOT NULL CHECK (plan_key IN ('pro_monthly', 'pro_yearly', 'lifetime', 'donate')),
  kind TEXT NOT NULL CHECK (kind IN ('subscription', 'subscription_payment', 'lifetime', 'donation', 'premium_subscription', 'premium_lifetime')),
  amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'failed', 'pending', 'partially_refunded')),
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_provider_order UNIQUE (provider, provider_order_id),
  CONSTRAINT purchases_donation_no_guild CHECK (
    (kind = 'donation' AND guild_id IS NULL) OR
    (kind != 'donation')
  )
);

ALTER TABLE IF EXISTS public.purchases
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'lemon_squeezy',
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_product_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_variant_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_key TEXT,
  ADD COLUMN IF NOT EXISTS kind TEXT,
  ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS raw_payload JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'purchases'
      AND column_name = 'lemon_squeezy_order_id'
  ) THEN
    UPDATE public.purchases
    SET
      provider = COALESCE(provider, 'lemon_squeezy'),
      provider_order_id = COALESCE(provider_order_id, lemon_squeezy_order_id),
      plan_key = COALESCE(plan_key, plan_type),
      kind = COALESCE(
        kind,
        CASE
          WHEN plan_type = 'lifetime' THEN 'lifetime'
          ELSE 'subscription'
        END
      ),
      created_at = COALESCE(created_at, purchased_at)
    WHERE provider_order_id IS NULL
       OR plan_key IS NULL
       OR kind IS NULL
       OR created_at IS NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_guild ON public.purchases(guild_id) WHERE guild_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_provider_order ON public.purchases(provider, provider_order_id);
CREATE INDEX IF NOT EXISTS idx_purchases_kind ON public.purchases(kind);
CREATE INDEX IF NOT EXISTS idx_purchases_created ON public.purchases(created_at DESC);

-- ============================================
-- TABLE: donations
-- Dedicated table for donations (denormalized for analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  provider_order_id TEXT NOT NULL,
  discord_user_id TEXT REFERENCES public.users(discord_user_id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded')),
  message TEXT,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_donation_order UNIQUE (provider, provider_order_id)
);

ALTER TABLE IF EXISTS public.donations
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'lemon_squeezy',
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS amount INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS raw_payload JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'donations'
      AND column_name = 'lemon_squeezy_order_id'
  ) THEN
    UPDATE public.donations
    SET
      provider = COALESCE(provider, 'lemon_squeezy'),
      provider_order_id = COALESCE(provider_order_id, lemon_squeezy_order_id),
      amount = COALESCE(amount, amount_cents),
      created_at = COALESCE(created_at, donated_at)
    WHERE provider_order_id IS NULL
       OR amount IS NULL
       OR created_at IS NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_donations_user ON public.donations(discord_user_id) WHERE discord_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_donations_created ON public.donations(created_at DESC);

-- ============================================
-- TABLE: webhook_events
-- Idempotency and audit trail for webhooks
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'lemon_squeezy',
  event_name TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_hash TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_provider_event UNIQUE (provider, event_id)
);

ALTER TABLE IF EXISTS public.webhook_events
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'lemon_squeezy',
  ADD COLUMN IF NOT EXISTS event_name TEXT,
  ADD COLUMN IF NOT EXISTS event_id TEXT,
  ADD COLUMN IF NOT EXISTS event_hash TEXT,
  ADD COLUMN IF NOT EXISTS processed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS raw_payload JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed, created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_name ON public.webhook_events(event_name);
CREATE INDEX IF NOT EXISTS idx_webhook_events_hash ON public.webhook_events(event_hash);

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_event_hash(payload JSONB)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(payload::text, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.guild_has_premium(p_guild_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.guild_subscriptions
    WHERE guild_id = p_guild_id
      AND premium_enabled = true
      AND (
        status IN ('active', 'past_due') OR
        (status = 'cancelled' AND ends_at IS NOT NULL AND ends_at > NOW())
      )
      AND (ends_at IS NULL OR ends_at > NOW())
  );
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.deactivate_expired_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.guild_subscriptions
  SET
    status = 'expired',
    premium_enabled = false,
    updated_at = NOW()
  WHERE premium_enabled = true
    AND lifetime = false
    AND ends_at IS NOT NULL
    AND ends_at < NOW()
    AND status IN ('active', 'cancelled', 'past_due');

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_guild_subscriptions_updated_at ON public.guild_subscriptions;
CREATE TRIGGER update_guild_subscriptions_updated_at
  BEFORE UPDATE ON public.guild_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW public.active_guild_subscriptions AS
SELECT
  gs.*,
  u.username,
  u.avatar,
  u.email
FROM public.guild_subscriptions gs
LEFT JOIN public.users u ON gs.discord_user_id = u.discord_user_id
WHERE gs.premium_enabled = true
  AND (
    gs.status IN ('active', 'past_due') OR
    (gs.status = 'cancelled' AND gs.ends_at IS NOT NULL AND gs.ends_at > NOW())
  )
  AND (gs.ends_at IS NULL OR gs.ends_at > NOW());

CREATE OR REPLACE VIEW public.revenue_summary AS
SELECT
  DATE_TRUNC('day', created_at) AS date,
  kind,
  currency,
  COUNT(*) AS transaction_count,
  SUM(amount) AS total_amount,
  AVG(amount) AS avg_amount
FROM public.purchases
WHERE status = 'completed'
GROUP BY DATE_TRUNC('day', created_at), kind, currency
ORDER BY date DESC;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  USING (discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id'));

DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
CREATE POLICY "Service role can manage users"
  ON public.users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.guild_subscriptions;
CREATE POLICY "Users can read own subscriptions"
  ON public.guild_subscriptions
  FOR SELECT
  USING (discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id'));

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.guild_subscriptions;
CREATE POLICY "Service role can manage subscriptions"
  ON public.guild_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own purchases" ON public.purchases;
CREATE POLICY "Users can read own purchases"
  ON public.purchases
  FOR SELECT
  USING (discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id'));

DROP POLICY IF EXISTS "Service role can manage purchases" ON public.purchases;
CREATE POLICY "Service role can manage purchases"
  ON public.purchases
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own donations" ON public.donations;
CREATE POLICY "Users can read own donations"
  ON public.donations
  FOR SELECT
  USING (
    discord_user_id IS NULL OR
    discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id')
  );

DROP POLICY IF EXISTS "Service role can manage donations" ON public.donations;
CREATE POLICY "Service role can manage donations"
  ON public.donations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage webhooks" ON public.webhook_events;
CREATE POLICY "Service role can manage webhooks"
  ON public.webhook_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.users IS 'Discord users who have interacted with the billing system';
COMMENT ON TABLE public.guild_subscriptions IS 'Source of truth for guild premium status';
COMMENT ON TABLE public.purchases IS 'All purchase records including subscriptions, lifetime, and donations';
COMMENT ON TABLE public.donations IS 'Dedicated donation records for analytics';
COMMENT ON TABLE public.webhook_events IS 'Webhook event log for idempotency and audit trail';

COMMENT ON COLUMN public.guild_subscriptions.premium_enabled IS 'Whether premium features are currently active for this guild';
COMMENT ON COLUMN public.guild_subscriptions.cancel_at_period_end IS 'If true, subscription will not renew at period end';
COMMENT ON COLUMN public.guild_subscriptions.lifetime IS 'If true, this is a lifetime purchase with no expiration';
COMMENT ON COLUMN public.webhook_events.event_hash IS 'SHA-256 hash of payload for duplicate detection';
