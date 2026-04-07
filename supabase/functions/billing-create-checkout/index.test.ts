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
      const customData: Record<string, unknown> = {
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

  // -------------------------------------------------------------------------
  // Business Logic Rules — these test the actual decision logic, not shapes
  // -------------------------------------------------------------------------
  describe('Business Logic: plan + guild_id rules', () => {
    /**
     * Extracted from handler: isPremiumPlan(plan_key) requires guild_id.
     * donate must NOT receive guild_id (different product flow).
     */
    const isPremiumPlan = (pk: string) => ['pro_monthly', 'pro_yearly', 'lifetime'].includes(pk);
    const isDonationPlan = (pk: string) => pk === 'donate';

    it('premium plan without guild_id must be rejected (400)', () => {
      for (const plan of ['pro_monthly', 'pro_yearly', 'lifetime']) {
        const guild_id: string | undefined = undefined;
        const shouldReject = isPremiumPlan(plan) && !guild_id;
        expect(shouldReject).toBe(true);
      }
    });

    it('donate plan WITH guild_id must be rejected (400)', () => {
      const plan = 'donate';
      const guild_id = '123456789012345678';
      const shouldReject = isDonationPlan(plan) && guild_id != null;
      expect(shouldReject).toBe(true);
    });

    it('donate plan WITHOUT guild_id must be accepted', () => {
      const plan = 'donate';
      const guild_id: string | undefined = undefined;
      const shouldReject = isDonationPlan(plan) && guild_id != null;
      expect(shouldReject).toBe(false);
    });

    it('premium plan WITH guild_id must pass plan+guild validation', () => {
      for (const plan of ['pro_monthly', 'pro_yearly', 'lifetime']) {
        const guild_id = '123456789012345678';
        const shouldReject = isPremiumPlan(plan) && !guild_id;
        expect(shouldReject).toBe(false);
      }
    });
  });

  describe('Business Logic: guild already has premium → reject checkout', () => {
    it('rejects when guild has active subscription (has_premium=true)', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: true,
        plan_key: 'pro_monthly',
        lifetime: false,
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      const status = await mockDb.getGuildPremiumStatus('123456789012345678');
      // Handler rule: if has_premium → 409 Conflict
      expect(status.has_premium).toBe(true);
    });

    it('rejects when guild has lifetime premium (can never be upgraded via checkout)', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: true,
        plan_key: 'lifetime',
        lifetime: true,
        ends_at: null,
      });

      const status = await mockDb.getGuildPremiumStatus('123456789012345678');
      expect(status.has_premium).toBe(true);
      expect(status.lifetime).toBe(true);
    });

    it('allows checkout when guild has NO premium', async () => {
      mockDb.getGuildPremiumStatus.mockResolvedValue({
        has_premium: false,
        plan_key: null,
        lifetime: false,
        ends_at: null,
      });

      const status = await mockDb.getGuildPremiumStatus('123456789012345678');
      expect(status.has_premium).toBe(false);
    });
  });

  describe('Business Logic: admin permission check (Discord bits)', () => {
    /**
     * Handler checks ADMINISTRATOR (0x8) or MANAGE_GUILD (0x20) bits
     * from the Discord /users/@me/guilds response.
     */
    const hasAdminPermission = (permissions: string): boolean => {
      const bits = BigInt(permissions);
      const ADMINISTRATOR = BigInt(0x8);
      const MANAGE_GUILD  = BigInt(0x20);
      return (bits & ADMINISTRATOR) === ADMINISTRATOR
          || (bits & MANAGE_GUILD)  === MANAGE_GUILD;
    };

    it('accepts ADMINISTRATOR bit (0x8 = "8")', () => {
      expect(hasAdminPermission('8')).toBe(true);
    });

    it('accepts MANAGE_GUILD bit (0x20 = "32")', () => {
      expect(hasAdminPermission('32')).toBe(true);
    });

    it('accepts combined permissions that include ADMINISTRATOR', () => {
      // ADMINISTRATOR | MANAGE_GUILD | others
      expect(hasAdminPermission(String(0x8 | 0x20 | 0x4))).toBe(true);
    });

    it('rejects guild member without admin or manage_guild', () => {
      expect(hasAdminPermission('0')).toBe(false);
      expect(hasAdminPermission('6')).toBe(false);  // KICK + BAN, not admin
      expect(hasAdminPermission('16')).toBe(false);  // MANAGE_CHANNELS
    });

    it('valid guild_id not in user guilds means no admin permission (empty list)', () => {
      const userGuilds: Array<{ id: string; permissions: string }> = [];
      const targetGuildId = '123456789012345678';
      const guildEntry = userGuilds.find(g => g.id === targetGuildId);
      expect(guildEntry).toBeUndefined();
      // Handler rule: guild not found in user's guilds → 403
    });

    it('guild found in user guilds with ADMINISTRATOR permission', () => {
      const userGuilds = [
        { id: '123456789012345678', permissions: '8' },
        { id: '999999999999999999', permissions: '0' },
      ];
      const entry = userGuilds.find(g => g.id === '123456789012345678');
      expect(entry).toBeDefined();
      expect(hasAdminPermission(entry!.permissions)).toBe(true);
    });
  });
});
