import { createClient } from 'npm:@supabase/supabase-js@2';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const BILLING_ACCESS_FRESHNESS_HOURS = 24;
const STRIPE_API_BASE_URL = 'https://api.stripe.com/v1';

export type BillingInterval = 'month' | 'year';
export type StripeSubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused';

interface AuthenticatedUser {
  id: string;
  email: string | null;
}

interface UserGuildAccessRow {
  guild_id: string;
  bot_installed: boolean | null;
  last_synced_at: string | null;
}

interface BillingCustomerRow {
  user_id: string;
  stripe_customer_id: string;
  email: string | null;
}

interface SubscriptionLookupRow {
  guild_id: string;
  owner_user_id: string | null;
  stripe_customer_id: string;
  stripe_subscription_id: string;
}

interface StripeCustomer {
  id: string;
  email?: string | null;
}

interface StripeCheckoutSession {
  id: string;
  url?: string | null;
  expires_at?: number | null;
  mode?: string | null;
  customer?: string | null;
  subscription?: string | null;
  metadata?: Record<string, string>;
}

interface StripeSubscription {
  id: string;
  customer: string | null;
  status: StripeSubscriptionStatus;
  metadata?: Record<string, string>;
  items?: {
    data?: Array<{
      price?: {
        id?: string | null;
        recurring?: {
          interval?: string | null;
        } | null;
      } | null;
    }>;
  } | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
}

interface StripeInvoice {
  id: string;
  customer?: string | null;
  subscription?: string | null;
}

export function jsonResponse(payload: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

export function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getSiteOrigin(): string {
  const rawValue = (
    Deno.env.get('SITE_URL')
    || Deno.env.get('VITE_SITE_URL')
    || Deno.env.get('STRIPE_PORTAL_RETURN_URL')
    || ''
  ).replace(/\/+$/, '');

  if (!rawValue) {
    return '';
  }

  try {
    return new URL(rawValue).origin;
  } catch {
    return rawValue;
  }
}

export function getDashboardReturnUrl(guildId: string, searchParams: Record<string, string | null>) {
  const origin = getSiteOrigin();
  if (!origin) {
    throw new Error('Missing SITE_URL or VITE_SITE_URL for billing redirects.');
  }

  const url = new URL('/dashboard', `${origin}/`);
  url.searchParams.set('guild', guildId);
  url.searchParams.set('section', 'billing');

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function createAdminClient() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

export function createAuthClient(authHeader: string) {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_ANON_KEY'), {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new Response(JSON.stringify({ error: 'Missing Authorization header.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authClient = createAuthClient(authHeader);
  const {
    data: { user },
    error,
  } = await authClient.auth.getUser();

  if (error || !user) {
    throw new Response(JSON.stringify({ error: 'Invalid Supabase session.' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return {
    id: user.id,
    email: user.email ?? null,
  };
}

export function parseBillingInterval(value: unknown): BillingInterval {
  if (value === 'month' || value === 'year') {
    return value;
  }

  throw new Response(JSON.stringify({ error: 'Invalid billing interval.' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function isBillingBetaModeEnabled(): boolean {
  const value = (Deno.env.get('BILLING_BETA_MODE') || '').trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes' || value === 'on';
}

export async function requireFreshGuildAccess(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string,
  guildId: string,
  options: { requireBotInstalled?: boolean } = {},
): Promise<UserGuildAccessRow> {
  const cutoff = new Date(Date.now() - BILLING_ACCESS_FRESHNESS_HOURS * 60 * 60 * 1000).toISOString();
  const query = adminClient
    .from('user_guild_access')
    .select('guild_id, bot_installed, last_synced_at')
    .eq('user_id', userId)
    .eq('guild_id', guildId)
    .eq('can_manage', true)
    .gte('last_synced_at', cutoff)
    .maybeSingle<UserGuildAccessRow>();

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  if (!data) {
    throw new Response(JSON.stringify({ error: 'Guild access is missing or stale. Please re-sync Discord access.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (options.requireBotInstalled && !data.bot_installed) {
    throw new Response(JSON.stringify({ error: 'Billing requires a server where the bot is already installed.' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return data;
}

export async function requireBillingBetaAccess(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string,
) {
  if (!isBillingBetaModeEnabled()) {
    return;
  }

  const { data, error } = await adminClient
    .from('billing_beta_allowlist')
    .select('user_id, expires_at')
    .eq('user_id', userId)
    .maybeSingle<{ user_id: string; expires_at: string | null }>();

  if (error) {
    throw error;
  }

  const expiresAt = data?.expires_at ? new Date(data.expires_at) : null;
  const active = Boolean(
    data
      && (!expiresAt || !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() > Date.now()),
  );

  if (!active) {
    throw new Response(JSON.stringify({ error: 'Billing beta is currently allowlist-only.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export async function getOrCreateStripeCustomer(
  adminClient: ReturnType<typeof createAdminClient>,
  user: AuthenticatedUser,
): Promise<BillingCustomerRow> {
  const { data: existing, error: existingError } = await adminClient
    .from('billing_customers')
    .select('user_id, stripe_customer_id, email')
    .eq('user_id', user.id)
    .maybeSingle<BillingCustomerRow>();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return existing;
  }

  const customer = await createStripeCustomer({
    email: user.email,
    metadata: {
      user_id: user.id,
    },
  });

  const row = {
    user_id: user.id,
    stripe_customer_id: customer.id,
    email: customer.email ?? user.email,
  };

  const { error: upsertError } = await adminClient
    .from('billing_customers')
    .upsert(row, { onConflict: 'user_id' });

  if (upsertError) {
    throw upsertError;
  }

  return row;
}

export async function ensureNoActiveGuildSubscription(
  adminClient: ReturnType<typeof createAdminClient>,
  guildId: string,
) {
  const { data, error } = await adminClient
    .from('guild_effective_entitlements')
    .select('effective_plan, subscription_status')
    .eq('guild_id', guildId)
    .maybeSingle<{ effective_plan: string; subscription_status: string | null }>();

  if (error) {
    throw error;
  }

  if (
    data?.effective_plan
    && data.effective_plan !== 'free'
    && data.subscription_status
    && ['trialing', 'active', 'past_due'].includes(data.subscription_status)
  ) {
    throw new Response(JSON.stringify({ error: 'This guild already has an active Pro subscription. Use the billing portal to manage it.' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export async function getStripeSubscriptionById(subscriptionId: string): Promise<StripeSubscription> {
  return stripeRequest<StripeSubscription>(`/subscriptions/${subscriptionId}`, {
    method: 'GET',
  });
}

export async function createStripeCheckoutSession(options: {
  customerId: string;
  guildId: string;
  ownerUserId: string;
  billingInterval: BillingInterval;
}) {
  const successUrl = getDashboardReturnUrl(options.guildId, {
    checkout: 'success',
  });
  const cancelUrl = getDashboardReturnUrl(options.guildId, {
    checkout: 'cancelled',
  });
  const priceId = options.billingInterval === 'month'
    ? requireEnv('STRIPE_PRICE_PRO_MONTHLY')
    : requireEnv('STRIPE_PRICE_PRO_YEARLY');

  return stripeRequest<StripeCheckoutSession>('/checkout/sessions', {
    method: 'POST',
    form: [
      ['mode', 'subscription'],
      ['success_url', successUrl],
      ['cancel_url', cancelUrl],
      ['customer', options.customerId],
      ['allow_promotion_codes', 'false'],
      ['line_items[0][price]', priceId],
      ['line_items[0][quantity]', '1'],
      ['metadata[guild_id]', options.guildId],
      ['metadata[owner_user_id]', options.ownerUserId],
      ['metadata[plan]', 'pro'],
      ['metadata[billing_interval]', options.billingInterval],
      ['subscription_data[metadata][guild_id]', options.guildId],
      ['subscription_data[metadata][owner_user_id]', options.ownerUserId],
      ['subscription_data[metadata][plan]', 'pro'],
      ['subscription_data[metadata][billing_interval]', options.billingInterval],
      ['subscription_data[description]', `TON618 Pro (${options.billingInterval}) for guild ${options.guildId}`],
    ],
  });
}

export async function createStripePortalSession(customerId: string): Promise<{ url: string }> {
  const returnUrl = requireEnv('STRIPE_PORTAL_RETURN_URL');
  return stripeRequest<{ url: string }>('/billing_portal/sessions', {
    method: 'POST',
    form: [
      ['customer', customerId],
      ['return_url', returnUrl],
    ],
  });
}

export async function createStripeCustomer(options: {
  email: string | null;
  metadata: Record<string, string>;
}): Promise<StripeCustomer> {
  const form: Array<[string, string]> = [];

  if (options.email) {
    form.push(['email', options.email]);
  }

  for (const [key, value] of Object.entries(options.metadata)) {
    form.push([`metadata[${key}]`, value]);
  }

  return stripeRequest<StripeCustomer>('/customers', {
    method: 'POST',
    form,
  });
}

export async function upsertBillingCustomerFromStripe(
  adminClient: ReturnType<typeof createAdminClient>,
  userId: string | null,
  customerId: string | null,
  email: string | null,
) {
  if (!userId || !customerId) {
    return;
  }

  const { error } = await adminClient
    .from('billing_customers')
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        email,
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    throw error;
  }
}

export async function upsertGuildSubscriptionFromStripe(
  adminClient: ReturnType<typeof createAdminClient>,
  subscription: StripeSubscription,
  fallback: {
    guildId?: string | null;
    ownerUserId?: string | null;
  } = {},
) {
  const metadata = subscription.metadata ?? {};
  let guildId = metadata.guild_id ?? fallback.guildId ?? null;
  let ownerUserId = metadata.owner_user_id ?? fallback.ownerUserId ?? null;

  if ((!guildId || !ownerUserId) && subscription.id) {
    const { data: existing, error: existingError } = await adminClient
      .from('guild_billing_subscriptions')
      .select('guild_id, owner_user_id, stripe_customer_id, stripe_subscription_id')
      .eq('stripe_subscription_id', subscription.id)
      .maybeSingle<SubscriptionLookupRow>();

    if (existingError) {
      throw existingError;
    }

    guildId = guildId ?? existing?.guild_id ?? null;
    ownerUserId = ownerUserId ?? existing?.owner_user_id ?? null;
  }

  if (!guildId) {
    throw new Error(`Stripe subscription ${subscription.id} is missing guild metadata.`);
  }

  const firstItem = subscription.items?.data?.[0]?.price ?? null;
  const billingInterval = firstItem?.recurring?.interval === 'year' ? 'year' : 'month';
  const periodStart = toIsoTimestamp(subscription.current_period_start);
  const periodEnd = toIsoTimestamp(subscription.current_period_end);
  const eventAt = periodEnd ?? new Date().toISOString();

  const { error } = await adminClient
    .from('guild_billing_subscriptions')
    .upsert(
      {
        guild_id: guildId,
        owner_user_id: ownerUserId,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        price_id: firstItem?.id ?? null,
        plan: 'pro',
        status: subscription.status,
        billing_interval: billingInterval,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
        last_event_at: eventAt,
      },
      { onConflict: 'guild_id' },
    );

  if (error) {
    throw error;
  }
}

export async function getSubscriptionLookupByGuildId(
  adminClient: ReturnType<typeof createAdminClient>,
  guildId: string,
) {
  const { data, error } = await adminClient
    .from('guild_billing_subscriptions')
    .select('guild_id, owner_user_id, stripe_customer_id, stripe_subscription_id')
    .eq('guild_id', guildId)
    .maybeSingle<SubscriptionLookupRow>();

  if (error) {
    throw error;
  }

  return data;
}

export async function readStripeWebhookEvent(request: Request) {
  const signatureHeader = request.headers.get('stripe-signature');
  if (!signatureHeader) {
    throw new Response(JSON.stringify({ error: 'Missing Stripe signature.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rawBody = await request.text();
  const secret = requireEnv('STRIPE_WEBHOOK_SECRET');
  const isValid = await verifyStripeSignature(rawBody, signatureHeader, secret);

  if (!isValid) {
    throw new Response(JSON.stringify({ error: 'Invalid Stripe signature.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const event = JSON.parse(rawBody) as {
    id: string;
    type: string;
    data: {
      object: Record<string, unknown>;
    };
  };

  return {
    event,
    rawBody,
  };
}

export async function computeSha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((chunk) => chunk.toString(16).padStart(2, '0'))
    .join('');
}

export async function markWebhookEventStatus(
  adminClient: ReturnType<typeof createAdminClient>,
  stripeEventId: string,
  status: 'processing' | 'processed' | 'ignored' | 'failed',
  options: {
    errorMessage?: string | null;
    processedAt?: string | null;
  } = {},
) {
  const { error } = await adminClient
    .from('billing_webhook_events')
    .update({
      status,
      error_message: options.errorMessage ?? null,
      processed_at: options.processedAt ?? (status === 'processing' ? null : new Date().toISOString()),
    })
    .eq('stripe_event_id', stripeEventId);

  if (error) {
    throw error;
  }
}

export async function registerWebhookEvent(
  adminClient: ReturnType<typeof createAdminClient>,
  stripeEventId: string,
  eventType: string,
  payloadHash: string,
) {
  const { data: existing, error: existingError } = await adminClient
    .from('billing_webhook_events')
    .select('stripe_event_id, status')
    .eq('stripe_event_id', stripeEventId)
    .maybeSingle<{ stripe_event_id: string; status: string }>();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return { duplicate: true, status: existing.status };
  }

  const { error } = await adminClient
    .from('billing_webhook_events')
    .insert({
      stripe_event_id: stripeEventId,
      event_type: eventType,
      payload_hash: payloadHash,
      status: 'processing',
    });

  if (error) {
    throw error;
  }

  return { duplicate: false, status: 'processing' };
}

export function toIsoTimestamp(value: number | null | undefined): string | null {
  if (!value || !Number.isFinite(value)) {
    return null;
  }

  return new Date(value * 1000).toISOString();
}

export function getStripeMetadata(object: Record<string, unknown>) {
  return typeof object.metadata === 'object' && object.metadata
    ? object.metadata as Record<string, string>
    : {};
}

export function asStripeCheckoutSession(object: Record<string, unknown>) {
  return object as unknown as StripeCheckoutSession;
}

export function asStripeSubscription(object: Record<string, unknown>) {
  return object as unknown as StripeSubscription;
}

export function asStripeInvoice(object: Record<string, unknown>) {
  return object as unknown as StripeInvoice;
}

async function stripeRequest<T>(path: string, options: {
  method: 'GET' | 'POST';
  form?: Array<[string, string]>;
}) {
  const secretKey = requireEnv('STRIPE_SECRET_KEY');
  const url = new URL(`${STRIPE_API_BASE_URL}${path}`);
  const headers = new Headers({
    Authorization: `Bearer ${secretKey}`,
  });

  let body: URLSearchParams | undefined;
  if (options.method === 'POST') {
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
    body = new URLSearchParams();
    for (const [key, value] of options.form ?? []) {
      body.append(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    method: options.method,
    headers,
    body,
  });

  const payload = await response.json().catch(async () => ({ error: { message: await response.text() } }));
  if (!response.ok) {
    const message = typeof payload?.error?.message === 'string'
      ? payload.error.message
      : `Stripe request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload as T;
}

async function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const fragments = signatureHeader.split(',').map((entry) => entry.trim());
  const timestamp = fragments.find((entry) => entry.startsWith('t='))?.slice(2) ?? '';
  const signatures = fragments
    .filter((entry) => entry.startsWith('v1='))
    .map((entry) => entry.slice(3))
    .filter(Boolean);

  if (!timestamp || !signatures.length) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((chunk) => chunk.toString(16).padStart(2, '0'))
    .join('');

  return signatures.some((signature) => timingSafeEqual(expectedSignature, signature));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}
