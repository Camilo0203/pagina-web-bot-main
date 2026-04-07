// Lemon Squeezy Webhook Handler
// Handles all payment events with idempotency and proper business logic

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders, jsonResponse, errorResponse, handleError, requireEnv } from '../_shared/utils.ts';
import { 
  verifyLemonSqueezySignature, 
  generateEventHash,
  parseLemonSqueezyEvent,
  extractCustomData,
  isPremiumPlan,
  isLifetimePlan,
  isDonationPlan,
  getBillingType,
  mapSubscriptionStatus,
  calculateRenewalDate,
} from '../_shared/lemon.ts';
import { createSupabaseClient, BillingDatabase } from '../_shared/database.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Get webhook secret
    const webhookSecret = requireEnv('LEMON_SQUEEZY_WEBHOOK_SECRET');
    
    // Get signature
    const signature = req.headers.get('x-signature');
    if (!signature) {
      return errorResponse('Missing webhook signature', 401);
    }

    // Read raw body
    const rawBody = await req.text();
    
    // Verify signature
    const isValid = await verifyLemonSqueezySignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return errorResponse('Invalid signature', 401);
    }

    // Parse event
    const event = parseLemonSqueezyEvent(rawBody);
    const eventName = event.meta.event_name;
    
    console.log(`Processing webhook: ${eventName}`, { event_id: event.data.id });

    // Generate event hash for idempotency
    const eventHash = await generateEventHash(rawBody);
    
    // Initialize database
    const supabase = createSupabaseClient();
    const db = new BillingDatabase(supabase);

    // Check if event already processed (idempotency)
    const exists = await db.checkWebhookEventExists(eventHash);
    if (exists) {
      console.log('Event already processed (duplicate)', { event_hash: eventHash });
      return jsonResponse({ message: 'Event already processed' }, 200);
    }

    // Create webhook event record
    const webhookEvent = await db.createWebhookEvent({
      provider: 'lemon_squeezy',
      event_name: eventName,
      event_id: event.data.id,
      event_hash: eventHash,
      processed: false,
      raw_payload: event as unknown as Record<string, unknown>,
    });

    try {
      // Route to appropriate handler
      switch (eventName) {
        case 'subscription_created':
          await handleSubscriptionCreated(db, event);
          break;
        
        case 'subscription_updated':
          await handleSubscriptionUpdated(db, event);
          break;
        
        case 'subscription_cancelled':
          await handleSubscriptionCancelled(db, event);
          break;
        
        case 'subscription_resumed':
          await handleSubscriptionResumed(db, event);
          break;
        
        case 'subscription_expired':
          await handleSubscriptionExpired(db, event);
          break;
        
        case 'subscription_paused':
          await handleSubscriptionPaused(db, event);
          break;
        
        case 'subscription_unpaused':
          await handleSubscriptionUnpaused(db, event);
          break;
        
        case 'subscription_payment_success':
          await handleSubscriptionPaymentSuccess(db, event);
          break;
        
        case 'subscription_payment_failed':
          await handleSubscriptionPaymentFailed(db, event);
          break;
        
        case 'subscription_payment_recovered':
          await handleSubscriptionPaymentRecovered(db, event);
          break;
        
        case 'order_created':
          await handleOrderCreated(db, event);
          break;
        
        case 'order_refunded':
          await handleOrderRefunded(db, event);
          break;
        
        default:
          console.log(`Unhandled event type: ${eventName}`);
      }

      // Mark as processed
      await db.markWebhookProcessed(webhookEvent.id, true);
      
      return jsonResponse({ 
        message: 'Webhook processed successfully',
        event_name: eventName,
      }, 200);

    } catch (error) {
      console.error('Error processing webhook:', error);
      console.error('Webhook event details:', {
        event_name: eventName,
        event_id: event.data.id,
        custom_data: event.meta.custom_data,
      });
      
      // Mark as failed
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await db.markWebhookProcessed(webhookEvent.id, false, errorMessage);
      
      throw error;
    }

  } catch (error) {
    return handleError(error);
  }
});

// ============================================
// EVENT HANDLERS
// ============================================

async function handleSubscriptionCreated(db: BillingDatabase, event: any) {
  const customData = extractCustomData(event);
  const attrs = event.data.attributes;
  
  // Validate required custom data with specific error messages
  const missingFields: string[] = [];
  if (!customData.discord_user_id) missingFields.push('discord_user_id');
  if (!customData.guild_id) missingFields.push('guild_id');
  if (!customData.plan_key) missingFields.push('plan_key');
  
  if (missingFields.length > 0) {
    const errorMsg = `Missing required custom data in subscription_created: ${missingFields.join(', ')}`;
    console.error(errorMsg, { event_id: event.data.id, custom_data: customData });
    throw new Error(errorMsg);
  }

  // Ensure user exists
  await db.upsertUser({
    discord_user_id: customData.discord_user_id,
    username: 'Unknown', // Will be updated on next login
  });

  // Create guild subscription
  const renewsAt = attrs.renews_at ? new Date(attrs.renews_at) : null;
  
  await db.createGuildSubscription({
    guild_id: customData.guild_id,
    discord_user_id: customData.discord_user_id,
    provider: 'lemon_squeezy',
    provider_customer_id: String(attrs.customer_id),
    provider_subscription_id: event.data.id,
    plan_key: customData.plan_key,
    billing_type: 'subscription',
    status: mapSubscriptionStatus(attrs.status),
    premium_enabled: true,
    cancel_at_period_end: false,
    renews_at: renewsAt?.toISOString() || null,
    ends_at: null,
    lifetime: false,
  });

  // Create purchase record
  await db.createPurchase({
    provider: 'lemon_squeezy',
    provider_order_id: String(attrs.order_id),
    provider_product_id: String(attrs.product_id),
    provider_variant_id: String(attrs.variant_id),
    discord_user_id: customData.discord_user_id,
    guild_id: customData.guild_id,
    plan_key: customData.plan_key,
    kind: 'subscription',
    amount: Math.round((attrs.subtotal || 0) * 100),
    currency: attrs.currency || 'USD',
    status: 'completed',
    raw_payload: attrs,
  });

  console.log(`Subscription created for guild ${customData.guild_id}: ${customData.plan_key}`);
}

async function handleSubscriptionUpdated(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  const renewsAt = attrs.renews_at ? new Date(attrs.renews_at) : null;
  const endsAt = attrs.ends_at ? new Date(attrs.ends_at) : null;

  await db.updateGuildSubscription(subscription.id, {
    status: mapSubscriptionStatus(attrs.status),
    renews_at: renewsAt?.toISOString() || null,
    ends_at: endsAt?.toISOString() || null,
    cancel_at_period_end: attrs.cancelled || false,
  });

  console.log(`Subscription updated: ${event.data.id} - status: ${attrs.status}`);
}

async function handleSubscriptionCancelled(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  // Don't disable premium immediately - let it run until period end
  const endsAt = attrs.ends_at || attrs.renews_at;
  
  if (!endsAt) {
    console.warn(`⚠️  Subscription cancelled without ends_at/renews_at: ${event.data.id}. Using current date as fallback.`);
  }
  
  await db.cancelGuildSubscription(
    subscription.id,
    endsAt ? new Date(endsAt).toISOString() : new Date().toISOString()
  );

  console.log(`Subscription cancelled: ${event.data.id} - ends at: ${endsAt || 'immediate'}`);
}

async function handleSubscriptionResumed(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  const renewsAt = attrs.renews_at ? new Date(attrs.renews_at) : null;
  
  await db.resumeGuildSubscription(
    subscription.id,
    renewsAt?.toISOString() || new Date().toISOString()
  );

  console.log(`Subscription resumed: ${event.data.id}`);
}

async function handleSubscriptionExpired(db: BillingDatabase, event: any) {
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  // Disable premium immediately
  await db.deactivateGuildSubscription(subscription.id);

  console.log(`Subscription expired: ${event.data.id}`);
}

async function handleSubscriptionPaused(db: BillingDatabase, event: any) {
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  await db.updateGuildSubscription(subscription.id, {
    status: 'paused',
    premium_enabled: false,
  });

  console.log(`Subscription paused: ${event.data.id}`);
}

async function handleSubscriptionUnpaused(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  await db.updateGuildSubscription(subscription.id, {
    status: 'active',
    premium_enabled: true,
  });

  console.log(`Subscription unpaused: ${event.data.id}`);
}

async function handleSubscriptionPaymentSuccess(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  const renewsAt = attrs.renews_at ? new Date(attrs.renews_at) : null;

  await db.updateGuildSubscription(subscription.id, {
    status: 'active',
    premium_enabled: true,
    renews_at: renewsAt?.toISOString() || null,
  });

  console.log(`Subscription payment success: ${event.data.id}`);
}

async function handleSubscriptionPaymentFailed(db: BillingDatabase, event: any) {
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  // Mark as past_due but don't disable premium yet
  await db.updateGuildSubscription(subscription.id, {
    status: 'past_due',
  });

  console.log(`Subscription payment failed: ${event.data.id}`);
}

async function handleSubscriptionPaymentRecovered(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  const subscription = await db.getGuildSubscriptionByProvider(event.data.id);
  
  if (!subscription) {
    console.warn(`Subscription not found: ${event.data.id}`);
    return;
  }

  const renewsAt = attrs.renews_at ? new Date(attrs.renews_at) : null;

  // Reactivate subscription after payment recovery
  await db.updateGuildSubscription(subscription.id, {
    status: 'active',
    premium_enabled: true,
    renews_at: renewsAt?.toISOString() || null,
  });

  console.log(`Subscription payment recovered: ${event.data.id}`);
}

async function handleOrderCreated(db: BillingDatabase, event: any) {
  const customData = extractCustomData(event);
  const attrs = event.data.attributes;
  
  if (!customData.discord_user_id || !customData.plan_key) {
    throw new Error('Missing required custom data in order_created');
  }

  // Ensure user exists
  await db.upsertUser({
    discord_user_id: customData.discord_user_id,
    username: 'Unknown',
  });

  const planKey = customData.plan_key;

  // Handle lifetime purchase
  if (isLifetimePlan(planKey)) {
    if (!customData.guild_id) {
      throw new Error('Missing guild_id for lifetime purchase');
    }

    // Create guild subscription (lifetime)
    await db.createGuildSubscription({
      guild_id: customData.guild_id,
      discord_user_id: customData.discord_user_id,
      provider: 'lemon_squeezy',
      provider_customer_id: String(attrs.customer_id),
      provider_subscription_id: null,
      plan_key: planKey,
      billing_type: 'one_time',
      status: 'active',
      premium_enabled: true,
      cancel_at_period_end: false,
      renews_at: null,
      ends_at: null,
      lifetime: true,
    });

    // Create purchase record
    await db.createPurchase({
      provider: 'lemon_squeezy',
      provider_order_id: event.data.id,
      provider_product_id: String(attrs.first_order_item?.product_id || ''),
      provider_variant_id: String(attrs.first_order_item?.variant_id || ''),
      discord_user_id: customData.discord_user_id,
      guild_id: customData.guild_id,
      plan_key: planKey,
      kind: 'lifetime',
      amount: attrs.total,
      currency: attrs.currency,
      status: 'completed',
      raw_payload: attrs,
    });

    console.log(`Lifetime purchase created for guild ${customData.guild_id}`);
  }
  // Handle donation
  else if (isDonationPlan(planKey)) {
    // Create donation record
    await db.createDonation({
      provider: 'lemon_squeezy',
      provider_order_id: event.data.id,
      discord_user_id: customData.discord_user_id,
      amount: attrs.total,
      currency: attrs.currency,
      status: 'completed',
      message: null,
      raw_payload: attrs,
    });

    // Also create purchase record for analytics
    await db.createPurchase({
      provider: 'lemon_squeezy',
      provider_order_id: event.data.id,
      provider_product_id: String(attrs.first_order_item?.product_id || ''),
      provider_variant_id: String(attrs.first_order_item?.variant_id || ''),
      discord_user_id: customData.discord_user_id,
      guild_id: null,
      plan_key: planKey,
      kind: 'donation',
      amount: attrs.total,
      currency: attrs.currency,
      status: 'completed',
      raw_payload: attrs,
    });

    console.log(`Donation received from ${customData.discord_user_id}: ${attrs.total} ${attrs.currency}`);
  }
}

async function handleOrderRefunded(db: BillingDatabase, event: any) {
  const attrs = event.data.attributes;
  
  // Find purchase by order ID
  const purchase = await db.getPurchaseByProviderOrder('lemon_squeezy', event.data.id);
  
  if (!purchase) {
    console.warn(`Purchase not found for refunded order: ${event.data.id}`);
    return;
  }

  // Update purchase status
  await db.updatePurchaseStatus(purchase.id, 'refunded');

  // If it was a premium purchase (lifetime or subscription), deactivate premium
  if ((purchase.kind === 'lifetime' || purchase.kind === 'subscription') && purchase.guild_id) {
    const subscription = await db.getActiveGuildSubscription(purchase.guild_id);
    if (subscription) {
      await db.deactivateGuildSubscription(subscription.id);
      console.log(`Premium deactivated for guild ${purchase.guild_id} due to refund`);
    }
  }

  // If it was a donation, update donation status
  if (purchase.kind === 'donation') {
    const donation = await db.getDonationByProviderOrder('lemon_squeezy', event.data.id);
    if (donation) {
      await db.updateDonationStatus(donation.id, 'refunded');
    }
  }

  console.log(`Order refunded: ${event.data.id} - kind: ${purchase.kind}`);
}
