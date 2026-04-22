-- ============================================
-- BILLING SYSTEM V2 - Compatibility and schema harmonization
-- ============================================
-- Created: 2026-04-06
-- Purpose: add v2 fields without breaking the already-running webhook code

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS TABLE
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- ============================================
-- 2. GUILD SUBSCRIPTIONS TABLE
-- Source of truth for premium status
-- ============================================
ALTER TABLE IF EXISTS public.guild_subscriptions
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS kind TEXT,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.normalize_guild_subscription_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.provider IS NULL THEN
    NEW.provider = 'lemon_squeezy';
  END IF;

  IF NEW.cancel_at_period_end IS NULL THEN
    NEW.cancel_at_period_end = false;
  END IF;

  IF NEW.premium_enabled IS NULL THEN
    NEW.premium_enabled = true;
  END IF;

  IF NEW.lifetime IS NULL THEN
    NEW.lifetime = false;
  END IF;

  IF NEW.started_at IS NULL THEN
    NEW.started_at = COALESCE(NEW.created_at, NOW());
  END IF;

  IF NEW.kind IS NULL AND NEW.plan_key IS NOT NULL THEN
    NEW.kind = CASE
      WHEN NEW.lifetime = true OR NEW.plan_key = 'lifetime' THEN 'premium_lifetime'
      ELSE 'premium_subscription'
    END;
  END IF;

  IF NEW.status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
    NEW.cancelled_at = COALESCE(NEW.ends_at, NEW.updated_at, NOW());
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS normalize_guild_subscription_fields ON public.guild_subscriptions;
CREATE TRIGGER normalize_guild_subscription_fields
  BEFORE INSERT OR UPDATE ON public.guild_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_guild_subscription_fields();

UPDATE public.guild_subscriptions
SET
  provider = COALESCE(provider, 'lemon_squeezy'),
  started_at = COALESCE(started_at, created_at, NOW()),
  kind = COALESCE(
    kind,
    CASE
      WHEN lifetime = true OR plan_key = 'lifetime' THEN 'premium_lifetime'
      WHEN plan_key IS NOT NULL THEN 'premium_subscription'
      ELSE NULL
    END
  ),
  cancelled_at = CASE
    WHEN status = 'cancelled' THEN COALESCE(cancelled_at, ends_at, updated_at, NOW())
    ELSE cancelled_at
  END;

CREATE INDEX IF NOT EXISTS idx_guild_subs_provider_order ON public.guild_subscriptions(provider_order_id) WHERE provider_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guild_subs_renews_at ON public.guild_subscriptions(renews_at) WHERE renews_at IS NOT NULL;

-- ============================================
-- 3. PURCHASES TABLE
-- Audit log of all transactions
-- ============================================
ALTER TABLE IF EXISTS public.purchases
  ADD COLUMN IF NOT EXISTS billing_type TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.normalize_purchase_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.provider IS NULL THEN
    NEW.provider = 'lemon_squeezy';
  END IF;

  IF NEW.currency IS NULL THEN
    NEW.currency = 'USD';
  END IF;

  IF NEW.created_at IS NULL THEN
    NEW.created_at = NOW();
  END IF;

  IF NEW.kind = 'subscription_payment' OR NEW.kind = 'premium_subscription' THEN
    NEW.kind = 'subscription';
  ELSIF NEW.kind = 'premium_lifetime' THEN
    NEW.kind = 'lifetime';
  ELSIF NEW.kind IS NULL AND NEW.plan_key IS NOT NULL THEN
    NEW.kind = CASE
      WHEN NEW.plan_key = 'donate' THEN 'donation'
      WHEN NEW.plan_key = 'lifetime' THEN 'lifetime'
      ELSE 'subscription'
    END;
  END IF;

  IF NEW.plan_key = 'donate' OR NEW.kind = 'donation' THEN
    NEW.guild_id = NULL;
  END IF;

  IF NEW.billing_type IS NULL THEN
    NEW.billing_type = CASE
      WHEN NEW.kind IN ('lifetime', 'donation') OR NEW.plan_key IN ('lifetime', 'donate') THEN 'one_time'
      ELSE 'subscription'
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS normalize_purchase_fields ON public.purchases;
CREATE TRIGGER normalize_purchase_fields
  BEFORE INSERT OR UPDATE ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_purchase_fields();

UPDATE public.purchases
SET
  provider = COALESCE(provider, 'lemon_squeezy'),
  currency = COALESCE(currency, 'USD'),
  created_at = COALESCE(created_at, NOW()),
  kind = CASE
    WHEN kind IN ('subscription_payment', 'premium_subscription') THEN 'subscription'
    WHEN kind = 'premium_lifetime' THEN 'lifetime'
    WHEN kind IS NULL AND plan_key = 'donate' THEN 'donation'
    WHEN kind IS NULL AND plan_key = 'lifetime' THEN 'lifetime'
    WHEN kind IS NULL AND plan_key IS NOT NULL THEN 'subscription'
    ELSE kind
  END;

UPDATE public.purchases
SET billing_type = CASE
  WHEN plan_key IN ('lifetime', 'donate') OR kind IN ('lifetime', 'donation') THEN 'one_time'
  ELSE 'subscription'
END
WHERE billing_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

-- ============================================
-- 4. DONATIONS TABLE
-- Separate tracking for donations
-- ============================================
ALTER TABLE IF EXISTS public.donations
  ADD COLUMN IF NOT EXISTS donor_name TEXT,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

UPDATE public.donations
SET
  provider = COALESCE(provider, 'lemon_squeezy'),
  currency = COALESCE(currency, 'USD'),
  created_at = COALESCE(created_at, NOW());

CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);

-- ============================================
-- 5. WEBHOOK EVENTS TABLE
-- Idempotency and audit trail
-- ============================================
DO $$
BEGIN
  IF to_regclass('public.webhook_events') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_indexes
       WHERE schemaname = 'public'
         AND indexname = 'idx_webhook_events_event_hash_unique'
     )
     AND NOT EXISTS (
       SELECT event_hash
       FROM public.webhook_events
       GROUP BY event_hash
       HAVING COUNT(*) > 1
     ) THEN
    EXECUTE '
      CREATE UNIQUE INDEX idx_webhook_events_event_hash_unique
      ON public.webhook_events(event_hash)
    ';
  END IF;
END $$;

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

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

CREATE OR REPLACE FUNCTION public.get_active_guild_subscription(p_guild_id TEXT)
RETURNS TABLE (
  id UUID,
  plan_key TEXT,
  billing_type TEXT,
  kind TEXT,
  status TEXT,
  premium_enabled BOOLEAN,
  lifetime BOOLEAN,
  renews_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gs.id,
    gs.plan_key,
    gs.billing_type,
    gs.kind,
    gs.status,
    gs.premium_enabled,
    gs.lifetime,
    gs.renews_at,
    gs.ends_at,
    gs.cancel_at_period_end
  FROM public.guild_subscriptions gs
  WHERE gs.guild_id = p_guild_id
    AND gs.premium_enabled = true
    AND (
      gs.status IN ('active', 'past_due') OR
      (gs.status = 'cancelled' AND gs.ends_at IS NOT NULL AND gs.ends_at > NOW())
    )
    AND (gs.ends_at IS NULL OR gs.ends_at > NOW())
  ORDER BY gs.lifetime DESC, gs.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.deactivate_expired_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  UPDATE public.guild_subscriptions
  SET
    premium_enabled = false,
    status = 'expired',
    updated_at = NOW()
  WHERE premium_enabled = true
    AND lifetime = false
    AND status IN ('active', 'cancelled', 'past_due')
    AND ends_at IS NOT NULL
    AND ends_at < NOW();

  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. VIEWS
-- ============================================

DROP VIEW IF EXISTS public.active_guild_subscriptions;
CREATE OR REPLACE VIEW public.active_guild_subscriptions
  WITH (security_invoker = true)
AS
SELECT
  gs.id,
  gs.guild_id,
  gs.discord_user_id,
  u.username,
  gs.plan_key,
  gs.billing_type,
  gs.kind,
  gs.status,
  gs.premium_enabled,
  gs.lifetime,
  gs.renews_at,
  gs.ends_at,
  gs.cancelled_at,
  gs.cancel_at_period_end,
  gs.started_at,
  gs.created_at,
  gs.updated_at
FROM public.guild_subscriptions gs
LEFT JOIN public.users u ON gs.discord_user_id = u.discord_user_id
WHERE gs.premium_enabled = true
  AND (
    gs.status IN ('active', 'past_due') OR
    (gs.status = 'cancelled' AND gs.ends_at IS NOT NULL AND gs.ends_at > NOW())
  )
  AND (gs.ends_at IS NULL OR gs.ends_at > NOW());

DROP VIEW IF EXISTS public.revenue_summary;
CREATE OR REPLACE VIEW public.revenue_summary
  WITH (security_invoker = true)
AS
SELECT
  plan_key,
  kind,
  COALESCE(
    billing_type,
    CASE
      WHEN plan_key IN ('lifetime', 'donate') OR kind IN ('lifetime', 'donation') THEN 'one_time'
      ELSE 'subscription'
    END
  ) AS billing_type,
  COUNT(*) AS transaction_count,
  SUM(amount) AS total_revenue_cents,
  SUM(amount) / 100.0 AS total_revenue_usd,
  AVG(amount) / 100.0 AS avg_revenue_usd,
  MIN(created_at) AS first_purchase,
  MAX(created_at) AS last_purchase
FROM public.purchases
WHERE status = 'completed'
GROUP BY
  plan_key,
  kind,
  COALESCE(
    billing_type,
    CASE
      WHEN plan_key IN ('lifetime', 'donate') OR kind IN ('lifetime', 'donation') THEN 'one_time'
      ELSE 'subscription'
    END
  )
ORDER BY total_revenue_cents DESC;

DROP VIEW IF EXISTS public.donation_summary;
CREATE OR REPLACE VIEW public.donation_summary
  WITH (security_invoker = true)
AS
SELECT
  COUNT(*) AS total_donations,
  COUNT(DISTINCT discord_user_id) AS unique_donors,
  SUM(amount) AS total_amount_cents,
  SUM(amount) / 100.0 AS total_amount_usd,
  AVG(amount) / 100.0 AS avg_donation_usd,
  MIN(created_at) AS first_donation,
  MAX(created_at) AS last_donation
FROM public.donations
WHERE status = 'completed';

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guild_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own
  ON public.users
  FOR SELECT
  USING (discord_user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Service role can manage users" ON public.users;
DROP POLICY IF EXISTS users_service_role ON public.users;
CREATE POLICY users_service_role
  ON public.users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own subscriptions" ON public.guild_subscriptions;
DROP POLICY IF EXISTS guild_subs_select_own ON public.guild_subscriptions;
CREATE POLICY guild_subs_select_own
  ON public.guild_subscriptions
  FOR SELECT
  USING (discord_user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.guild_subscriptions;
DROP POLICY IF EXISTS guild_subs_service_role ON public.guild_subscriptions;
CREATE POLICY guild_subs_service_role
  ON public.guild_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own purchases" ON public.purchases;
DROP POLICY IF EXISTS purchases_select_own ON public.purchases;
CREATE POLICY purchases_select_own
  ON public.purchases
  FOR SELECT
  USING (discord_user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Service role can manage purchases" ON public.purchases;
DROP POLICY IF EXISTS purchases_service_role ON public.purchases;
CREATE POLICY purchases_service_role
  ON public.purchases
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own donations" ON public.donations;
DROP POLICY IF EXISTS donations_select_own ON public.donations;
CREATE POLICY donations_select_own
  ON public.donations
  FOR SELECT
  USING (
    discord_user_id IS NULL OR
    discord_user_id = auth.uid()::text
  );

DROP POLICY IF EXISTS "Service role can manage donations" ON public.donations;
DROP POLICY IF EXISTS donations_service_role ON public.donations;
CREATE POLICY donations_service_role
  ON public.donations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage webhooks" ON public.webhook_events;
DROP POLICY IF EXISTS webhook_events_service_role ON public.webhook_events;
CREATE POLICY webhook_events_service_role
  ON public.webhook_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 9. TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_guild_subscriptions_updated_at ON public.guild_subscriptions;
CREATE TRIGGER update_guild_subscriptions_updated_at
  BEFORE UPDATE ON public.guild_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
