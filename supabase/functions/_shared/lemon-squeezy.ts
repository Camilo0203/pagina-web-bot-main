import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

export interface LemonSqueezyConfig {
  apiKey: string;
  storeId: string;
  webhookSecret: string;
}

export interface CheckoutData {
  productId: string;
  variantId: string;
  customData: {
    discord_user_id: string;
    guild_id?: string;
    plan_type: string;
    source: string;
  };
  checkoutOptions?: {
    embed?: boolean;
    media?: boolean;
    logo?: boolean;
    desc?: boolean;
    discount?: boolean;
    dark?: boolean;
    subscriptionPreview?: boolean;
  };
  checkoutData?: {
    email?: string;
    name?: string;
    billing_address?: {
      country: string;
    };
  };
  expiresAt?: string;
  preview?: boolean;
  testMode?: boolean;
}

export async function createCheckout(
  config: LemonSqueezyConfig,
  data: CheckoutData
): Promise<{ url: string; id: string }> {
  const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          store_id: config.storeId,
          variant_id: data.variantId,
          custom_data: data.customData,
          checkout_options: data.checkoutOptions,
          checkout_data: data.checkoutData,
          expires_at: data.expiresAt,
          preview: data.preview,
          test_mode: data.testMode,
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: config.storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: data.variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Lemon Squeezy API error: ${error}`);
  }

  const result = await response.json();
  return {
    url: result.data.attributes.url,
    id: result.data.id,
  };
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureBytes = hexToBytes(signature);
  const dataBytes = encoder.encode(payload);

  return await crypto.subtle.verify('HMAC', key, signatureBytes, dataBytes);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function getSupabaseClient(req: Request) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    }
  );
}

export interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data: {
      discord_user_id: string;
      guild_id?: string;
      plan_type: string;
      source: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: any;
  };
}

export const PLAN_TIERS = {
  monthly: 'pro_monthly',
  yearly: 'pro_yearly',
  lifetime: 'lifetime',
} as const;

export function getPlanTier(planType: string): string {
  return PLAN_TIERS[planType as keyof typeof PLAN_TIERS] || planType;
}

export function calculateExpiresAt(planType: string, startDate: Date): Date | null {
  if (planType === 'lifetime') return null;
  
  const expiresAt = new Date(startDate);
  if (planType === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else if (planType === 'yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }
  
  return expiresAt;
}
