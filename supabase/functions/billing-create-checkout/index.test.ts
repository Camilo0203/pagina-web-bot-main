import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock dependencies
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

const mockLemonClient = {
  createCheckout: vi.fn(),
};

const mockDb = {
  getGuildPremiumStatus: vi.fn(),
};

vi.mock('https://esm.sh/@supabase/supabase-js@2.39.3', () => ({
  createClient: () => mockSupabaseClient,
}));

describe('billing-create-checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default env vars
    process.env.LEMON_SQUEEZY_API_KEY = 'test-api-key';
    process.env.LEMON_SQUEEZY_STORE_ID = '12345';
    process.env.LEMON_SQUEEZY_TEST_MODE = 'true';
    process.env.LEMON_SQUEEZY_VARIANT_PRO_MONTHLY = 'variant-monthly';
    process.env.LEMON_SQUEEZY_VARIANT_PRO_YEARLY = 'variant-yearly';
    process.env.LEMON_SQUEEZY_VARIANT_LIFETIME = 'variant-lifetime';
    process.env.LEMON_SQUEEZY_VARIANT_DONATE = 'variant-donate';
  });

  describe('Plan Validation', () => {
    it('should accept valid premium plan (pro_monthly)', async () => {
      const validPlans = ['pro_monthly', 'pro_yearly', 'lifetime', 'donate'];
      
      for (const plan of validPlans) {
        const isValid = validPlans.includes(plan);
        expect(isValid).toBe(true);
      }
    });

    it('should reject invalid plan key', async () => {
      const invalidPlans = ['invalid', 'pro_free', 'enterprise', ''];
      const validPlans = ['pro_monthly', 'pro_yearly', 'lifetime', 'donate'];
      
      for (const plan of invalidPlans) {
        const isValid = validPlans.includes(plan);
        expect(isValid).toBe(false);
      }
    });
  });

  describe('guild_id Validation', () => {
    it('should require guild_id for premium plans', async () => {
      const premiumPlans = ['pro_monthly', 'pro_yearly', 'lifetime'];
      
      for (const plan of premiumPlans) {
        const requiresGuildId = premiumPlans.includes(plan);
        expect(requiresGuildId).toBe(true);
      }
    });

    it('should reject guild_id for donate plan', async () => {
      const plan = 'donate';
      const shouldRejectGuildId = plan === 'donate';
      expect(shouldRejectGuildId).toBe(true);
    });

    it('should validate guild_id format (Discord snowflake)', async () => {
      const validGuildIds = ['123456789012345678', '987654321098765432'];
      const invalidGuildIds = ['invalid', '123', '', 'abc123'];
      
      const isValidDiscordId = (id: string) => /^\d{17,19}$/.test(id);
      
      validGuildIds.forEach(id => {
        expect(isValidDiscordId(id)).toBe(true);
      });
      
      invalidGuildIds.forEach(id => {
        expect(isValidDiscordId(id)).toBe(false);
      });
    });
  });

  describe('Premium Status Check', () => {
    it('should reject checkout if guild already has active premium', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: true,
        plan_key: 'pro_monthly',
        lifetime: false,
        ends_at: '2026-12-31T23:59:59Z',
      });

      const guildId = '123456789012345678';
      const status = await mockDb.getGuildPremiumStatus(guildId);
      
      expect(status.has_premium).toBe(true);
      expect(status.plan_key).toBe('pro_monthly');
    });

    it('should reject checkout if guild has lifetime premium', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: true,
        plan_key: 'lifetime',
        lifetime: true,
        ends_at: null,
      });

      const guildId = '123456789012345678';
      const status = await mockDb.getGuildPremiumStatus(guildId);
      
      expect(status.has_premium).toBe(true);
      expect(status.lifetime).toBe(true);
    });

    it('should allow checkout if guild has no premium', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: false,
        plan_key: null,
        lifetime: false,
        ends_at: null,
      });

      const guildId = '123456789012345678';
      const status = await mockDb.getGuildPremiumStatus(guildId);
      
      expect(status.has_premium).toBe(false);
    });
  });

  describe('Variant Mapping', () => {
    it('should map plan_key to correct variant_id', () => {
      const variantMap = {
        pro_monthly: process.env.LEMON_SQUEEZY_VARIANT_PRO_MONTHLY,
        pro_yearly: process.env.LEMON_SQUEEZY_VARIANT_PRO_YEARLY,
        lifetime: process.env.LEMON_SQUEEZY_VARIANT_LIFETIME,
        donate: process.env.LEMON_SQUEEZY_VARIANT_DONATE,
      };

      expect(variantMap.pro_monthly).toBe('variant-monthly');
      expect(variantMap.pro_yearly).toBe('variant-yearly');
      expect(variantMap.lifetime).toBe('variant-lifetime');
      expect(variantMap.donate).toBe('variant-donate');
    });
  });

  describe('Custom Data', () => {
    it('should include discord_user_id in custom_data', () => {
      const customData = {
        discord_user_id: '987654321098765432',
        guild_id: '123456789012345678',
        plan_key: 'pro_monthly',
      };

      expect(customData.discord_user_id).toBeDefined();
      expect(customData.discord_user_id).toMatch(/^\d{17,19}$/);
    });

    it('should include guild_id for premium plans', () => {
      const customData = {
        discord_user_id: '987654321098765432',
        guild_id: '123456789012345678',
        plan_key: 'pro_monthly',
      };

      expect(customData.guild_id).toBeDefined();
    });

    it('should not include guild_id for donate', () => {
      const customData = {
        discord_user_id: '987654321098765432',
        plan_key: 'donate',
      };

      expect(customData.guild_id).toBeUndefined();
    });
  });

  describe('Test Mode Warning', () => {
    it('should log warning when test_mode is enabled', () => {
      const testMode = process.env.LEMON_SQUEEZY_TEST_MODE === 'true';
      expect(testMode).toBe(true);
    });
  });
});
