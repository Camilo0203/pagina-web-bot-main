import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import {
  corsHeaders,
  createAdminClient,
  createStripeCheckoutSession,
  ensureNoActiveGuildSubscription,
  getAuthenticatedUser,
  getOrCreateStripeCustomer,
  jsonResponse,
  parseBillingInterval,
  requireBillingBetaAccess,
  requireFreshGuildAccess,
} from '../_shared/billing.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const user = await getAuthenticatedUser(request);
    const body = await request.json().catch(() => null) as {
      guildId?: unknown;
      billingInterval?: unknown;
    } | null;

    const guildId = typeof body?.guildId === 'string' ? body.guildId.trim() : '';
    if (!guildId) {
      return jsonResponse({ error: 'Missing guildId.' }, 400);
    }

    const billingInterval = parseBillingInterval(body?.billingInterval);
    const adminClient = createAdminClient();

    await requireBillingBetaAccess(adminClient, user.id);
    await requireFreshGuildAccess(adminClient, user.id, guildId, { requireBotInstalled: true });
    await ensureNoActiveGuildSubscription(adminClient, guildId);

    const customer = await getOrCreateStripeCustomer(adminClient, user);
    const session = await createStripeCheckoutSession({
      customerId: customer.stripe_customer_id,
      guildId,
      ownerUserId: user.id,
      billingInterval,
    });

    if (!session.url) {
      throw new Error('Stripe checkout session did not return a URL.');
    }

    return jsonResponse({
      url: session.url,
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Unexpected billing error.',
      },
      500,
    );
  }
});
