import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import {
  asStripeCheckoutSession,
  asStripeInvoice,
  asStripeSubscription,
  computeSha256Hex,
  corsHeaders,
  createAdminClient,
  getStripeMetadata,
  getStripeSubscriptionById,
  jsonResponse,
  markWebhookEventStatus,
  readStripeWebhookEvent,
  registerWebhookEvent,
  upsertBillingCustomerFromStripe,
  upsertGuildSubscriptionFromStripe,
} from '../_shared/billing.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  let stripeEventId: string | null = null;

  try {
    const adminClient = createAdminClient();
    const { event, rawBody } = await readStripeWebhookEvent(request);
    stripeEventId = event.id;
    const payloadHash = await computeSha256Hex(rawBody);
    const registration = await registerWebhookEvent(adminClient, event.id, event.type, payloadHash);

    if (registration.duplicate) {
      return jsonResponse({ received: true, duplicate: true, status: registration.status });
    }

    const object = event.data?.object ?? {};

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = asStripeCheckoutSession(object);
        if (session.mode !== 'subscription' || !session.subscription) {
          await markWebhookEventStatus(adminClient, event.id, 'ignored');
          return jsonResponse({ received: true, ignored: true });
        }

        const metadata = getStripeMetadata(object);
        await upsertBillingCustomerFromStripe(
          adminClient,
          metadata.owner_user_id ?? null,
          session.customer ?? null,
          null,
        );

        const subscription = await getStripeSubscriptionById(session.subscription);
        await upsertGuildSubscriptionFromStripe(adminClient, subscription, {
          guildId: metadata.guild_id ?? null,
          ownerUserId: metadata.owner_user_id ?? null,
        });
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = asStripeSubscription(object);
        const metadata = getStripeMetadata(object);
        await upsertBillingCustomerFromStripe(
          adminClient,
          metadata.owner_user_id ?? null,
          subscription.customer ?? null,
          null,
        );
        await upsertGuildSubscriptionFromStripe(adminClient, subscription, {
          guildId: metadata.guild_id ?? null,
          ownerUserId: metadata.owner_user_id ?? null,
        });
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = asStripeInvoice(object);
        if (!invoice.subscription) {
          await markWebhookEventStatus(adminClient, event.id, 'ignored');
          return jsonResponse({ received: true, ignored: true });
        }

        const subscription = await getStripeSubscriptionById(invoice.subscription);
        const metadata = getStripeMetadata(subscription as unknown as Record<string, unknown>);
        await upsertBillingCustomerFromStripe(
          adminClient,
          metadata.owner_user_id ?? null,
          typeof invoice.customer === 'string' ? invoice.customer : subscription.customer ?? null,
          null,
        );
        await upsertGuildSubscriptionFromStripe(adminClient, subscription, {
          guildId: metadata.guild_id ?? null,
          ownerUserId: metadata.owner_user_id ?? null,
        });
        break;
      }
      default:
        await markWebhookEventStatus(adminClient, event.id, 'ignored');
        return jsonResponse({ received: true, ignored: true });
    }

    await markWebhookEventStatus(adminClient, event.id, 'processed');
    return jsonResponse({ received: true });
  } catch (error) {
    if (stripeEventId) {
      const adminClient = createAdminClient();
      await markWebhookEventStatus(
        adminClient,
        stripeEventId,
        'failed',
        {
          errorMessage: error instanceof Error ? error.message : 'Unexpected webhook error.',
        },
      ).catch(() => undefined);
    }

    if (error instanceof Response) {
      return error;
    }

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Unexpected Stripe webhook error.',
      },
      500,
    );
  }
});
