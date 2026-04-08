-- Migration: Row Level Security policies for billing tables
-- Description: Secure access to billing data

ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.guild_premium ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.donations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF to_regclass('public.subscriptions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
    CREATE POLICY "Users can view their own subscriptions"
      ON public.subscriptions
      FOR SELECT
      USING (discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id'));

    DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;
    CREATE POLICY "Service role can manage all subscriptions"
      ON public.subscriptions
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF to_regclass('public.purchases') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
    CREATE POLICY "Users can view their own purchases"
      ON public.purchases
      FOR SELECT
      USING (discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id'));

    DROP POLICY IF EXISTS "Service role can manage all purchases" ON public.purchases;
    CREATE POLICY "Service role can manage all purchases"
      ON public.purchases
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF to_regclass('public.guild_premium') IS NOT NULL THEN
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

  IF to_regclass('public.donations') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
    CREATE POLICY "Users can view their own donations"
      ON public.donations
      FOR SELECT
      USING (
        discord_user_id IS NULL OR
        discord_user_id = (auth.jwt() -> 'user_metadata' ->> 'provider_id')
      );

    DROP POLICY IF EXISTS "Service role can manage all donations" ON public.donations;
    CREATE POLICY "Service role can manage all donations"
      ON public.donations
      FOR ALL
      USING (auth.role() = 'service_role')
      WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;
