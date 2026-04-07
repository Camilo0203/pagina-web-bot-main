import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createCheckout, LemonSqueezyConfig } from '../_shared/lemon-squeezy.ts';
import { corsHeaders, getAuthenticatedUser, jsonResponse, requireEnv, createAdminClient } from '../_shared/billing.ts';

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
      guild_id?: string;
      plan_type?: string;
      amount_cents?: number;
      message?: string;
    } | null;

    const planType = body?.plan_type;
    if (!planType || !['monthly', 'yearly', 'lifetime', 'donation'].includes(planType)) {
      return jsonResponse({ error: 'Invalid plan_type. Must be: monthly, yearly, lifetime, or donation.' }, 400);
    }

    const config: LemonSqueezyConfig = {
      apiKey: requireEnv('LEMON_SQUEEZY_API_KEY'),
      storeId: requireEnv('LEMON_SQUEEZY_STORE_ID'),
      webhookSecret: requireEnv('LEMON_SQUEEZY_WEBHOOK_SECRET'),
    };

    let variantId: string;
    let customData: any;

    if (planType === 'donation') {
      variantId = requireEnv('LEMON_SQUEEZY_VARIANT_DONATION');
      customData = {
        discord_user_id: user.id,
        plan_type: 'donation',
        source: 'ton618-web',
        message: body?.message || '',
      };
    } else {
      const guildId = body?.guild_id?.trim();
      if (!guildId) {
        return jsonResponse({ error: 'guild_id is required for premium plans.' }, 400);
      }

      const adminClient = createAdminClient();
      
      const { data: guildAccess } = await adminClient
        .from('user_guild_access')
        .select('guild_id, can_manage')
        .eq('user_id', user.id)
        .eq('guild_id', guildId)
        .eq('can_manage', true)
        .maybeSingle();

      if (!guildAccess) {
        return jsonResponse({ error: 'You do not have permission to manage this guild.' }, 403);
      }

      const { data: existingPremium } = await adminClient
        .from('guild_premium')
        .select('guild_id, is_active')
        .eq('guild_id', guildId)
        .eq('is_active', true)
        .maybeSingle();

      if (existingPremium) {
        return jsonResponse({ error: 'This guild already has an active premium subscription.' }, 409);
      }

      if (planType === 'monthly') {
        variantId = requireEnv('LEMON_SQUEEZY_VARIANT_MONTHLY');
      } else if (planType === 'yearly') {
        variantId = requireEnv('LEMON_SQUEEZY_VARIANT_YEARLY');
      } else if (planType === 'lifetime') {
        variantId = requireEnv('LEMON_SQUEEZY_VARIANT_LIFETIME');
      } else {
        return jsonResponse({ error: 'Invalid plan_type.' }, 400);
      }

      customData = {
        discord_user_id: user.id,
        guild_id: guildId,
        plan_type: planType,
        source: 'ton618-web',
      };
    }

    const checkout = await createCheckout(config, {
      productId: requireEnv('LEMON_SQUEEZY_PRODUCT_ID'),
      variantId,
      customData,
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
        desc: true,
        discount: true,
        dark: false,
        subscriptionPreview: planType === 'monthly' || planType === 'yearly',
      },
      testMode: Deno.env.get('LEMON_SQUEEZY_TEST_MODE') === 'true',
    });

    return jsonResponse({
      url: checkout.url,
      checkout_id: checkout.id,
    });

  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error('Lemon Squeezy checkout error:', error);
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Failed to create checkout session.',
      },
      500,
    );
  }
});
