-- Migration: Billing Schema Fixup
-- Final compatibility pass for billing migrations.
-- Ensures pgcrypto-based UUID defaults, backfills legacy columns, restores
-- idempotent indexes/constraints, and leaves RLS in a consistent final state.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- UUID defaults: align all billing tables with gen_random_uuid()
-- ============================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.subscriptions ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'purchases' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.purchases ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'donations' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.donations ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'guild_subscriptions' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.guild_subscriptions ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'webhook_events' AND column_name = 'id'
  ) THEN
    ALTER TABLE public.webhook_events ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END $$;

-- ============================================================
-- FIX: public.users compatibility for billing
-- Remote projects may already have a shared public.users table.
-- Billing uses discord_user_id as its integration key.
-- ============================================================
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

-- ============================================================
-- FIX: purchases table
-- Legacy schema (20260406000000) used lemon_squeezy_order_id/plan_type/purchased_at.
-- Current code expects provider/provider_order_id/plan_key/kind/billing_type.
-- ============================================================
ALTER TABLE IF EXISTS public.purchases
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'lemon_squeezy',
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_product_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_variant_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_key TEXT,
  ADD COLUMN IF NOT EXISTS kind TEXT,
  ADD COLUMN IF NOT EXISTS billing_type TEXT,
  ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS raw_payload JSONB,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
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
  END,
  billing_type = COALESCE(
    billing_type,
    CASE
      WHEN plan_key IN ('lifetime', 'donate') OR kind IN ('lifetime', 'donation', 'premium_lifetime') THEN 'one_time'
      ELSE 'subscription'
    END
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'unique_provider_order'
      AND conrelid = 'public.purchases'::regclass
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.purchases WHERE provider_order_id IS NULL
  )
  AND NOT EXISTS (
    SELECT provider, provider_order_id
    FROM public.purchases
    GROUP BY provider, provider_order_id
    HAVING COUNT(*) > 1
  ) THEN
    ALTER TABLE public.purchases
      ADD CONSTRAINT unique_provider_order UNIQUE (provider, provider_order_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_purchases_provider_order ON public.purchases(provider, provider_order_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

-- ============================================================
-- FIX: donations table
-- Legacy schema used lemon_squeezy_order_id/amount_cents/donated_at.
-- ============================================================
ALTER TABLE IF EXISTS public.donations
  ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'lemon_squeezy',
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS amount INTEGER,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS raw_payload JSONB,
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS donor_name TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
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

UPDATE public.donations
SET
  provider = COALESCE(provider, 'lemon_squeezy'),
  currency = COALESCE(currency, 'USD'),
  created_at = COALESCE(created_at, NOW());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'unique_donation_order'
      AND conrelid = 'public.donations'::regclass
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.donations WHERE provider_order_id IS NULL
  )
  AND NOT EXISTS (
    SELECT provider, provider_order_id
    FROM public.donations
    GROUP BY provider, provider_order_id
    HAVING COUNT(*) > 1
  ) THEN
    ALTER TABLE public.donations
      ADD CONSTRAINT unique_donation_order UNIQUE (provider, provider_order_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);

-- ============================================================
-- FIX: guild_subscriptions
-- Add v2 columns that may have been skipped by CREATE TABLE IF NOT EXISTS.
-- ============================================================
ALTER TABLE IF EXISTS public.guild_subscriptions
  ADD COLUMN IF NOT EXISTS kind TEXT,
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT;

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

CREATE UNIQUE INDEX IF NOT EXISTS idx_guild_subscriptions_unique_provider_sub_dedup
  ON public.guild_subscriptions(provider_subscription_id)
  WHERE provider_subscription_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_guild_subscription
  ON public.guild_subscriptions(guild_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_guild_subs_provider_order ON public.guild_subscriptions(provider_order_id) WHERE provider_order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guild_subs_renews_at ON public.guild_subscriptions(renews_at) WHERE renews_at IS NOT NULL;

-- ============================================================
-- FIX: webhook_events idempotency
-- ============================================================
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

-- ============================================================
-- ADD: increment_webhook_retry RPC
-- Referenced in database.ts BillingDatabase.incrementWebhookRetry()
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_webhook_retry(webhook_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.webhook_events
  SET
    retry_count = COALESCE(retry_count, 0) + 1,
    error_message = 'Retry scheduled at ' || NOW()::text
  WHERE id = webhook_id;
END;
$$;

-- ============================================================
-- ADD: cleanup_processed_webhook_events
-- Removes processed events older than retention_days.
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_processed_webhook_events(
  retention_days INTEGER DEFAULT 90
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.webhook_events
  WHERE processed = true
    AND created_at < NOW() - (retention_days || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ============================================================
-- FINAL RLS PASS
-- Recreate policies so old auth.jwt()/auth.uid() mistakes do not survive.
-- ============================================================
DO $$
BEGIN
  IF to_regclass('public.subscriptions') IS NOT NULL THEN
    ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
    CREATE POLICY "Users can view their own subscriptions"
      ON public.subscriptions
      FOR SELECT
      USING (discord_user_id = auth.uid()::text);

    DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
    CREATE POLICY "Service role can manage all subscriptions"
      ON public.subscriptions
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF to_regclass('public.guild_premium') IS NOT NULL THEN
    ALTER TABLE public.guild_premium ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can view guild premium status" ON public.guild_premium;
    CREATE POLICY "Anyone can view guild premium status"
      ON public.guild_premium
      FOR SELECT
      USING (true);

    DROP POLICY IF EXISTS "Service role can manage guild premium" ON public.guild_premium;
    CREATE POLICY "Service role can manage guild premium"
      ON public.guild_premium
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF to_regclass('public.users') IS NOT NULL THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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
  END IF;

  IF to_regclass('public.guild_subscriptions') IS NOT NULL THEN
    ALTER TABLE public.guild_subscriptions ENABLE ROW LEVEL SECURITY;

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
  END IF;

  IF to_regclass('public.purchases') IS NOT NULL THEN
    ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

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
  END IF;

  IF to_regclass('public.donations') IS NOT NULL THEN
    ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

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
  END IF;

  IF to_regclass('public.webhook_events') IS NOT NULL THEN
    ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Service role can manage webhooks" ON public.webhook_events;
    DROP POLICY IF EXISTS webhook_events_service_role ON public.webhook_events;
    CREATE POLICY webhook_events_service_role
      ON public.webhook_events
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;
