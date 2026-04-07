-- Migration: Create billing tables for Lemon Squeezy integration
-- Description: Subscriptions, purchases, guild premium status, and donations

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: subscriptions (Monthly/Yearly recurring)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lemon_squeezy_id TEXT UNIQUE NOT NULL,
  discord_user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'paused', 'past_due')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: purchases (Lifetime one-time purchases)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lemon_squeezy_order_id TEXT UNIQUE NOT NULL,
  discord_user_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type = 'lifetime'),
  status TEXT NOT NULL CHECK (status IN ('completed', 'refunded')),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table: guild_premium (Source of truth for premium status)
CREATE TABLE guild_premium (
  guild_id TEXT PRIMARY KEY,
  discord_user_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('pro_monthly', 'pro_yearly', 'lifetime')),
  is_active BOOLEAN DEFAULT true,
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_one_source CHECK (
    (subscription_id IS NOT NULL AND purchase_id IS NULL) OR
    (subscription_id IS NULL AND purchase_id IS NOT NULL)
  )
);

-- Table: donations (Separate from premium)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lemon_squeezy_order_id TEXT UNIQUE NOT NULL,
  discord_user_id TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT DEFAULT 'USD',
  message TEXT,
  donated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_guild ON subscriptions(guild_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(discord_user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_lemon_id ON subscriptions(lemon_squeezy_id);

CREATE INDEX idx_purchases_guild ON purchases(guild_id);
CREATE INDEX idx_purchases_user ON purchases(discord_user_id);
CREATE INDEX idx_purchases_order_id ON purchases(lemon_squeezy_order_id);

CREATE INDEX idx_guild_premium_active ON guild_premium(is_active, expires_at);
CREATE INDEX idx_guild_premium_user ON guild_premium(discord_user_id);

CREATE INDEX idx_donations_user ON donations(discord_user_id);
CREATE INDEX idx_donations_order_id ON donations(lemon_squeezy_order_id);

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guild_premium_updated_at
  BEFORE UPDATE ON guild_premium
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE subscriptions IS 'Recurring subscriptions (monthly/yearly) from Lemon Squeezy';
COMMENT ON TABLE purchases IS 'One-time purchases (lifetime) from Lemon Squeezy';
COMMENT ON TABLE guild_premium IS 'Source of truth for guild premium status';
COMMENT ON TABLE donations IS 'Donations separate from premium features';

COMMENT ON COLUMN guild_premium.expires_at IS 'NULL for lifetime purchases, future date for subscriptions';
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'If true, subscription will not renew';
