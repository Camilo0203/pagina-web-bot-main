-- Migration: Row Level Security policies for billing tables
-- Description: Secure access to billing data

-- Enable RLS on all billing tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_premium ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (discord_user_id = auth.jwt() ->> 'user_metadata'->>'provider_id');

CREATE POLICY "Service role can manage all subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Purchases policies
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (discord_user_id = auth.jwt() ->> 'user_metadata'->>'provider_id');

CREATE POLICY "Service role can manage all purchases"
  ON purchases FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Guild premium policies (read-only for users, managed by service)
CREATE POLICY "Anyone can view guild premium status"
  ON guild_premium FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage guild premium"
  ON guild_premium FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Donations policies
CREATE POLICY "Users can view their own donations"
  ON donations FOR SELECT
  USING (discord_user_id = auth.jwt() ->> 'user_metadata'->>'provider_id' OR discord_user_id IS NULL);

CREATE POLICY "Service role can manage all donations"
  ON donations FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
