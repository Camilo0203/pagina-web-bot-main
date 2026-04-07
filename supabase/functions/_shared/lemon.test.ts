import { describe, it, expect } from 'vitest';
import {
  verifyLemonSqueezySignature,
  generateEventHash,
  parseLemonSqueezyEvent,
  extractCustomData,
  getBillingType,
  isPremiumPlan,
  isLifetimePlan,
  isDonationPlan,
  calculateRenewalDate,
  mapSubscriptionStatus,
  validateVariantForPlan,
  getPlanDisplayName,
} from './lemon.ts';

// ---------------------------------------------------------------------------
// verifyLemonSqueezySignature
// ---------------------------------------------------------------------------
describe('verifyLemonSqueezySignature', () => {
  async function makeSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    return Array.from(new Uint8Array(sigBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  it('returns true for a valid HMAC-SHA256 signature', async () => {
    const payload = JSON.stringify({ meta: { event_name: 'order_created' } });
    const secret = 'test-webhook-secret';
    const signature = await makeSignature(payload, secret);

    const result = await verifyLemonSqueezySignature(payload, signature, secret);
    expect(result).toBe(true);
  });

  it('returns false for an invalid signature (tampered payload)', async () => {
    const payload = JSON.stringify({ meta: { event_name: 'order_created' } });
    const secret = 'test-webhook-secret';
    const signatureForOtherPayload = await makeSignature('other-payload', secret);

    const result = await verifyLemonSqueezySignature(payload, signatureForOtherPayload, secret);
    expect(result).toBe(false);
  });

  it('returns false for a wrong secret', async () => {
    const payload = JSON.stringify({ meta: { event_name: 'order_created' } });
    const sig = await makeSignature(payload, 'correct-secret');

    const result = await verifyLemonSqueezySignature(payload, sig, 'wrong-secret');
    expect(result).toBe(false);
  });

  it('returns false for a completely invalid (non-hex) signature string', async () => {
    const result = await verifyLemonSqueezySignature('payload', 'not-hex-at-all!!', 'secret');
    expect(result).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// generateEventHash
// ---------------------------------------------------------------------------
describe('generateEventHash', () => {
  it('produces a consistent SHA-256 hex string for the same payload', async () => {
    const payload = JSON.stringify({ meta: { event_name: 'order_created' }, data: { id: 'ord-1' } });
    const hash1 = await generateEventHash(payload);
    const hash2 = await generateEventHash(payload);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/); // 32 bytes = 64 hex chars
  });

  it('produces different hashes for different payloads', async () => {
    const hash1 = await generateEventHash('payload-a');
    const hash2 = await generateEventHash('payload-b');
    expect(hash1).not.toBe(hash2);
  });

  it('produces the idempotency key used for deduplication', async () => {
    // Same event arriving twice should generate the same hash → detected as duplicate
    const payload = '{"meta":{"event_name":"order_created"},"data":{"id":"ord-idempotency"}}';
    const firstHash  = await generateEventHash(payload);
    const secondHash = await generateEventHash(payload);
    expect(firstHash).toBe(secondHash);
  });
});

// ---------------------------------------------------------------------------
// parseLemonSqueezyEvent
// ---------------------------------------------------------------------------
describe('parseLemonSqueezyEvent', () => {
  it('parses valid JSON webhook payload', () => {
    const payload = JSON.stringify({
      meta: { event_name: 'order_created', custom_data: { plan_key: 'pro_monthly' } },
      data: { id: 'ord-123', type: 'orders', attributes: { status: 'paid' } },
    });
    const event = parseLemonSqueezyEvent(payload);
    expect(event.meta.event_name).toBe('order_created');
    expect(event.data.id).toBe('ord-123');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseLemonSqueezyEvent('not-json')).toThrow('Invalid webhook payload JSON');
  });
});

// ---------------------------------------------------------------------------
// extractCustomData
// ---------------------------------------------------------------------------
describe('extractCustomData', () => {
  it('extracts discord_user_id, guild_id, and plan_key', () => {
    const event = {
      meta: {
        event_name: 'order_created',
        custom_data: {
          discord_user_id: '123456789012345678',
          guild_id: '987654321098765432',
          plan_key: 'pro_monthly',
        },
      },
      data: { id: 'ord-1', type: 'orders', attributes: {} },
    };

    const custom = extractCustomData(event);
    expect(custom.discord_user_id).toBe('123456789012345678');
    expect(custom.guild_id).toBe('987654321098765432');
    expect(custom.plan_key).toBe('pro_monthly');
  });

  it('returns undefined fields when custom_data is absent', () => {
    const event = {
      meta: { event_name: 'subscription_created' },
      data: { id: 'sub-1', type: 'subscriptions', attributes: {} },
    };

    const custom = extractCustomData(event as any);
    expect(custom.discord_user_id).toBeUndefined();
    expect(custom.guild_id).toBeUndefined();
    expect(custom.plan_key).toBeUndefined();
  });

  it('donate event has no guild_id in custom_data', () => {
    const event = {
      meta: {
        event_name: 'order_created',
        custom_data: { discord_user_id: '123456789012345678', plan_key: 'donate' },
      },
      data: { id: 'ord-donate', type: 'orders', attributes: {} },
    };
    const custom = extractCustomData(event);
    expect(custom.guild_id).toBeUndefined();
    expect(custom.plan_key).toBe('donate');
  });
});

// ---------------------------------------------------------------------------
// getBillingType
// ---------------------------------------------------------------------------
describe('getBillingType', () => {
  it('returns "subscription" for pro_monthly', () => {
    expect(getBillingType('pro_monthly')).toBe('subscription');
  });

  it('returns "subscription" for pro_yearly', () => {
    expect(getBillingType('pro_yearly')).toBe('subscription');
  });

  it('returns "one_time" for lifetime', () => {
    expect(getBillingType('lifetime')).toBe('one_time');
  });

  it('returns "one_time" for donate', () => {
    expect(getBillingType('donate')).toBe('one_time');
  });
});

// ---------------------------------------------------------------------------
// isPremiumPlan / isLifetimePlan / isDonationPlan
// ---------------------------------------------------------------------------
describe('isPremiumPlan', () => {
  it('returns true for pro_monthly, pro_yearly, lifetime', () => {
    expect(isPremiumPlan('pro_monthly')).toBe(true);
    expect(isPremiumPlan('pro_yearly')).toBe(true);
    expect(isPremiumPlan('lifetime')).toBe(true);
  });

  it('returns false for donate', () => {
    expect(isPremiumPlan('donate')).toBe(false);
  });

  it('returns false for unknown plan', () => {
    expect(isPremiumPlan('enterprise')).toBe(false);
  });
});

describe('isLifetimePlan', () => {
  it('returns true only for "lifetime"', () => {
    expect(isLifetimePlan('lifetime')).toBe(true);
    expect(isLifetimePlan('pro_monthly')).toBe(false);
    expect(isLifetimePlan('donate')).toBe(false);
  });
});

describe('isDonationPlan', () => {
  it('returns true only for "donate"', () => {
    expect(isDonationPlan('donate')).toBe(true);
    expect(isDonationPlan('lifetime')).toBe(false);
    expect(isDonationPlan('pro_yearly')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// calculateRenewalDate
// ---------------------------------------------------------------------------
describe('calculateRenewalDate', () => {
  it('adds 1 month for pro_monthly', () => {
    const start = new Date('2026-01-15T12:00:00Z'); // noon UTC to avoid timezone shifts
    const renewal = calculateRenewalDate('pro_monthly', start);
    expect(renewal).not.toBeNull();
    expect(renewal!.getUTCMonth()).toBe(1); // February (0-indexed)
    expect(renewal!.getUTCFullYear()).toBe(2026);
  });

  it('adds 1 year for pro_yearly', () => {
    const start = new Date('2026-03-15T12:00:00Z'); // noon UTC to avoid timezone shifts
    const renewal = calculateRenewalDate('pro_yearly', start);
    expect(renewal).not.toBeNull();
    expect(renewal!.getUTCFullYear()).toBe(2027);
    expect(renewal!.getUTCMonth()).toBe(2); // March (0-indexed)
  });

  it('returns null for lifetime (no renewal)', () => {
    const result = calculateRenewalDate('lifetime', new Date());
    expect(result).toBeNull();
  });

  it('returns null for donate (no renewal)', () => {
    const result = calculateRenewalDate('donate', new Date());
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// mapSubscriptionStatus
// ---------------------------------------------------------------------------
describe('mapSubscriptionStatus', () => {
  it('maps known Lemon Squeezy statuses correctly', () => {
    expect(mapSubscriptionStatus('active')).toBe('active');
    expect(mapSubscriptionStatus('cancelled')).toBe('cancelled');
    expect(mapSubscriptionStatus('expired')).toBe('expired');
    expect(mapSubscriptionStatus('past_due')).toBe('past_due');
    expect(mapSubscriptionStatus('paused')).toBe('paused');
  });

  it('maps on_trial to active', () => {
    expect(mapSubscriptionStatus('on_trial')).toBe('active');
  });

  it('maps unpaid to past_due', () => {
    expect(mapSubscriptionStatus('unpaid')).toBe('past_due');
  });

  it('maps unknown status to "incomplete"', () => {
    expect(mapSubscriptionStatus('some_unknown_status')).toBe('incomplete');
  });
});

// ---------------------------------------------------------------------------
// validateVariantForPlan
// ---------------------------------------------------------------------------
describe('validateVariantForPlan', () => {
  const variantConfig = {
    pro_monthly: 'variant-001',
    pro_yearly:  'variant-002',
    lifetime:    'variant-003',
    donate:      'variant-004',
  };

  it('returns true when variantId matches planKey', () => {
    expect(validateVariantForPlan('variant-001', 'pro_monthly', variantConfig)).toBe(true);
    expect(validateVariantForPlan('variant-003', 'lifetime',    variantConfig)).toBe(true);
  });

  it('returns false when variantId does not match planKey', () => {
    expect(validateVariantForPlan('variant-002', 'pro_monthly', variantConfig)).toBe(false);
  });

  it('returns false for unknown plan key', () => {
    expect(validateVariantForPlan('variant-001', 'enterprise', variantConfig)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getPlanDisplayName
// ---------------------------------------------------------------------------
describe('getPlanDisplayName', () => {
  it('returns human-readable names for all known plans', () => {
    expect(getPlanDisplayName('pro_monthly')).toBe('Pro Monthly');
    expect(getPlanDisplayName('pro_yearly')).toBe('Pro Yearly');
    expect(getPlanDisplayName('lifetime')).toBe('Lifetime');
    expect(getPlanDisplayName('donate')).toBe('Donation');
  });

  it('falls back to the raw key for unknown plans', () => {
    expect(getPlanDisplayName('enterprise')).toBe('enterprise');
  });
});
