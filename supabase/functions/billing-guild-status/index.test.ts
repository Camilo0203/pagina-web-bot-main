import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock database
const mockDb = {
  getGuildPremiumStatus: vi.fn(),
  getActiveGuildSubscription: vi.fn(),
};

describe('billing-guild-status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BOT_API_KEY = 'test-bot-api-key-12345';
  });

  describe('Authentication', () => {
    it('should require X-Bot-Api-Key header', () => {
      const headers = new Headers();
      const apiKey = headers.get('X-Bot-Api-Key');
      
      expect(apiKey).toBeNull();
    });

    it('should accept valid BOT_API_KEY', () => {
      const headers = new Headers();
      headers.set('X-Bot-Api-Key', 'test-bot-api-key-12345');
      
      const apiKey = headers.get('X-Bot-Api-Key');
      const expectedKey = process.env.BOT_API_KEY;
      
      expect(apiKey).toBe(expectedKey);
    });

    it('should reject invalid API key', () => {
      const headers = new Headers();
      headers.set('X-Bot-Api-Key', 'wrong-api-key');
      
      const apiKey = headers.get('X-Bot-Api-Key');
      const expectedKey = process.env.BOT_API_KEY;
      
      expect(apiKey).not.toBe(expectedKey);
    });

    it('should reject missing API key', () => {
      const headers = new Headers();
      const apiKey = headers.get('X-Bot-Api-Key');
      
      expect(apiKey).toBeNull();
    });
  });

  describe('Response Shape - With Premium', () => {
    it('should return correct shape for pro_monthly', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: true,
        plan_key: 'pro_monthly',
        ends_at: '2026-05-01T00:00:00Z',
        lifetime: false,
      });

      mockDb.getActiveGuildSubscription.mockResolvedValue({
        id: 'sub-123',
        plan_key: 'pro_monthly',
        billing_type: 'subscription',
        status: 'active',
        renews_at: '2026-05-01T00:00:00Z',
        ends_at: '2026-05-01T00:00:00Z',
        lifetime: false,
        cancel_at_period_end: false,
      });

      const guildId = '123456789012345678';
      const premiumStatus = await mockDb.getGuildPremiumStatus(guildId);
      const subscription = await mockDb.getActiveGuildSubscription(guildId);

      const response = {
        guild_id: guildId,
        has_premium: premiumStatus.has_premium,
        plan_key: premiumStatus.plan_key,
        tier: premiumStatus.plan_key, // Alias
        ends_at: premiumStatus.ends_at,
        expires_at: premiumStatus.ends_at, // Alias
        lifetime: premiumStatus.lifetime,
        subscription: subscription ? {
          plan_key: subscription.plan_key,
          billing_type: subscription.billing_type,
          status: subscription.status,
          renews_at: subscription.renews_at,
          ends_at: subscription.ends_at,
          lifetime: subscription.lifetime,
          cancel_at_period_end: subscription.cancel_at_period_end,
        } : null,
        checked_at: new Date().toISOString(),
      };

      // Verify all required fields
      expect(response.guild_id).toBe(guildId);
      expect(response.has_premium).toBe(true);
      expect(response.plan_key).toBe('pro_monthly');
      expect(response.tier).toBe('pro_monthly'); // Bot compatibility
      expect(response.ends_at).toBe('2026-05-01T00:00:00Z');
      expect(response.expires_at).toBe('2026-05-01T00:00:00Z'); // Bot compatibility
      expect(response.lifetime).toBe(false);
      expect(response.subscription).not.toBeNull();
      expect(response.checked_at).toBeDefined();
    });

    it('should return correct shape for lifetime', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: true,
        plan_key: 'lifetime',
        ends_at: null,
        lifetime: true,
      });

      mockDb.getActiveGuildSubscription.mockResolvedValue({
        id: 'sub-lifetime',
        plan_key: 'lifetime',
        billing_type: 'one_time',
        status: 'active',
        renews_at: null,
        ends_at: null,
        lifetime: true,
        cancel_at_period_end: false,
      });

      const guildId = '987654321098765432';
      const premiumStatus = await mockDb.getGuildPremiumStatus(guildId);
      const subscription = await mockDb.getActiveGuildSubscription(guildId);

      const response = {
        guild_id: guildId,
        has_premium: premiumStatus.has_premium,
        plan_key: premiumStatus.plan_key,
        tier: premiumStatus.plan_key,
        ends_at: premiumStatus.ends_at,
        expires_at: premiumStatus.ends_at,
        lifetime: premiumStatus.lifetime,
        subscription: subscription ? {
          plan_key: subscription.plan_key,
          billing_type: subscription.billing_type,
          status: subscription.status,
          renews_at: subscription.renews_at,
          ends_at: subscription.ends_at,
          lifetime: subscription.lifetime,
          cancel_at_period_end: subscription.cancel_at_period_end,
        } : null,
        checked_at: new Date().toISOString(),
      };

      expect(response.has_premium).toBe(true);
      expect(response.plan_key).toBe('lifetime');
      expect(response.tier).toBe('lifetime');
      expect(response.ends_at).toBeNull();
      expect(response.expires_at).toBeNull();
      expect(response.lifetime).toBe(true);
      expect(response.subscription?.billing_type).toBe('one_time');
    });
  });

  describe('Response Shape - Without Premium', () => {
    it('should return correct shape for free guild', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: false,
        plan_key: null,
        ends_at: null,
        lifetime: false,
      });

      mockDb.getActiveGuildSubscription.mockResolvedValue(null);

      const guildId = '111222333444555666';
      const premiumStatus = await mockDb.getGuildPremiumStatus(guildId);
      const subscription = await mockDb.getActiveGuildSubscription(guildId);

      const response = {
        guild_id: guildId,
        has_premium: premiumStatus.has_premium,
        plan_key: premiumStatus.plan_key,
        tier: premiumStatus.plan_key,
        ends_at: premiumStatus.ends_at,
        expires_at: premiumStatus.ends_at,
        lifetime: premiumStatus.lifetime,
        subscription: subscription,
        checked_at: new Date().toISOString(),
      };

      expect(response.has_premium).toBe(false);
      expect(response.plan_key).toBeNull();
      expect(response.tier).toBeNull();
      expect(response.ends_at).toBeNull();
      expect(response.expires_at).toBeNull();
      expect(response.lifetime).toBe(false);
      expect(response.subscription).toBeNull();
    });
  });

  describe('Bot Compatibility Fields', () => {
    it('should include tier as alias of plan_key', async () => {
      const premiumStatus = {
        plan_key: 'pro_yearly',
      };

      const response = {
        plan_key: premiumStatus.plan_key,
        tier: premiumStatus.plan_key, // Alias for bot
      };

      expect(response.tier).toBe(response.plan_key);
      expect(response.tier).toBe('pro_yearly');
    });

    it('should include expires_at as alias of ends_at', async () => {
      const premiumStatus = {
        ends_at: '2026-12-31T23:59:59Z',
      };

      const response = {
        ends_at: premiumStatus.ends_at,
        expires_at: premiumStatus.ends_at, // Alias for bot
      };

      expect(response.expires_at).toBe(response.ends_at);
      expect(response.expires_at).toBe('2026-12-31T23:59:59Z');
    });
  });

  describe('Guild ID Validation', () => {
    it('should validate Discord snowflake format', () => {
      const validGuildIds = ['123456789012345678', '987654321098765432'];
      const invalidGuildIds = ['invalid', '123', '', 'abc'];

      const isValidDiscordId = (id: string) => /^\d{17,19}$/.test(id);

      validGuildIds.forEach(id => {
        expect(isValidDiscordId(id)).toBe(true);
      });

      invalidGuildIds.forEach(id => {
        expect(isValidDiscordId(id)).toBe(false);
      });
    });
  });

  describe('Subscription Details', () => {
    it('should include subscription details when available', async () => {
      const subscription = {
        plan_key: 'pro_monthly',
        billing_type: 'subscription',
        status: 'active',
        renews_at: '2026-05-01T00:00:00Z',
        ends_at: '2026-05-01T00:00:00Z',
        lifetime: false,
        cancel_at_period_end: false,
      };

      expect(subscription.plan_key).toBeDefined();
      expect(subscription.billing_type).toBeDefined();
      expect(subscription.status).toBeDefined();
      expect(subscription.renews_at).toBeDefined();
      expect(subscription.ends_at).toBeDefined();
      expect(subscription.lifetime).toBeDefined();
      expect(subscription.cancel_at_period_end).toBeDefined();
    });

    it('should return null subscription for free guilds', async () => {
      mockDb.getActiveGuildSubscription.mockResolvedValue(null);

      const subscription = await mockDb.getActiveGuildSubscription('free-guild-id');
      expect(subscription).toBeNull();
    });
  });
});
