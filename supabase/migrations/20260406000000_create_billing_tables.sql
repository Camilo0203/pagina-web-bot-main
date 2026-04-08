-- Migration: Create billing tables for Lemon Squeezy integration
-- Description: Subscriptions, purchases, guild premium status, and donations

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: subscriptions (Monthly/Yearly recurring)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lemon_squeezy_id TEXT UNIQUE NOT NULL,
  discord_user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'paused', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Table: purchases (Lifetime one-time purchases)
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lemon_squeezy_order_id TEXT UNIQUE NOT NULL,
  discord_user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type = 'lifetime'),
  status TEXT NOT NULL CHECK (status IN ('completed', 'refunded')),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Table: guild_premium (Source of truth for premium status)
CREATE TABLE IF NOT EXISTS public.guild_premium (
  guild_id TEXT PRIMARY KEY,
  discord_user_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('pro_monthly', 'pro_yearly', 'lifetime')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT guild_premium_one_source_check CHECK (
    (subscription_id IS NOT NULL AND purchase_id IS NULL) OR
    (subscription_id IS NULL AND purchase_id IS NOT NULL)
  )
);

-- Table: donations (Separate from premium)
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lemon_squeezy_order_id TEXT UNIQUE NOT NULL,
  discord_user_id TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  message TEXT,
  donated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_guild ON public.subscriptions(guild_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_lemon_id ON public.subscriptions(lemon_squeezy_id);

CREATE INDEX IF NOT EXISTS idx_purchases_guild ON public.purchases(guild_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_order_id ON public.purchases(lemon_squeezy_order_id);

CREATE INDEX IF NOT EXISTS idx_guild_premium_active ON public.guild_premium(is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_guild_premium_user ON public.guild_premium(discord_user_id);

CREATE INDEX IF NOT EXISTS idx_donations_user ON public.donations(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_donations_order_id ON public.donations(lemon_squeezy_order_id);

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_guild_premium_updated_at ON public.guild_premium;
CREATE TRIGGER update_guild_premium_updated_at
  BEFORE UPDATE ON public.guild_premium
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE public.subscriptions IS 'Recurring subscriptions (monthly/yearly) from Lemon Squeezy';
COMMENT ON TABLE public.purchases IS 'One-time purchases (lifetime) from Lemon Squeezy';
COMMENT ON TABLE public.guild_premium IS 'Source of truth for guild premium status';
COMMENT ON TABLE public.donations IS 'Donations separate from premium features';

COMMENT ON COLUMN public.guild_premium.expires_at IS 'NULL for lifetime purchases, future date for subscriptions';
COMMENT ON COLUMN public.subscriptions.cancel_at_period_end IS 'If true, subscription will not renew';
