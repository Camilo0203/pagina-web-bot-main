import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import {
  corsHeaders,
  createAdminClient,
  createStripePortalSession,
  getAuthenticatedUser,
  getSubscriptionLookupByGuildId,
  jsonResponse,
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
    } | null;

    const guildId = typeof body?.guildId === 'string' ? body.guildId.trim() : '';
    if (!guildId) {
      return jsonResponse({ error: 'Missing guildId.' }, 400);
    }

    const adminClient = createAdminClient();
    await requireFreshGuildAccess(adminClient, user.id, guildId, { requireBotInstalled: true });

    const subscription = await getSubscriptionLookupByGuildId(adminClient, guildId);
    if (!subscription?.stripe_customer_id) {
      return jsonResponse({ error: 'No billing subscription found for this guild.' }, 404);
    }

    const portalSession = await createStripePortalSession(subscription.stripe_customer_id);
    return jsonResponse({ url: portalSession.url });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Unexpected billing portal error.',
      },
      500,
    );
  }
});

