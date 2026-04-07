// Create Lemon Squeezy Checkout Session
// Validates user permissions and creates checkout with custom data

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders, jsonResponse, errorResponse, handleError, requireEnv, getRequestBody, validateRequiredFields, isValidDiscordId } from '../_shared/utils.ts';
import { LemonSqueezyClient } from '../_shared/lemon.ts';
import { createSupabaseClient, BillingDatabase } from '../_shared/database.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Get authenticated user from Supabase Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse('Missing authorization header', 401);
    }

    const supabaseUrl = requireEnv('SUPABASE_URL');
    const supabaseAnonKey = requireEnv('SUPABASE_ANON_KEY');
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    // Get Discord user ID from user metadata
    const discordUserId = user.user_metadata?.provider_id;
    if (!discordUserId) {
      return errorResponse('Discord user ID not found in session', 400);
    }

    // Parse request body
    const body = await getRequestBody<{
      guild_id?: string;
      plan_key: string;
    }>(req);

    validateRequiredFields(body, ['plan_key']);

    const { guild_id, plan_key } = body;

    // Validate plan_key
    const validPlans = ['pro_monthly', 'pro_yearly', 'lifetime', 'donate'];
    if (!validPlans.includes(plan_key)) {
      return errorResponse(`Invalid plan_key. Must be one of: ${validPlans.join(', ')}`, 400);
    }

    // Premium plans require guild_id
    const premiumPlans = ['pro_monthly', 'pro_yearly', 'lifetime'];
    if (premiumPlans.includes(plan_key)) {
      if (!guild_id) {
        return errorResponse('guild_id is required for premium plans', 400);
      }

      if (!isValidDiscordId(guild_id)) {
        return errorResponse('Invalid guild_id format', 400);
      }

      // Check if guild already has active premium
      const adminSupabase = createSupabaseClient();
      const db = new BillingDatabase(adminSupabase);
      
      const existingSubscription = await db.getActiveGuildSubscription(guild_id);
      if (existingSubscription) {
        return errorResponse('This guild already has an active premium subscription', 409);
      }
    }

    // Donations don't require guild_id
    if (plan_key === 'donate' && guild_id) {
      return errorResponse('guild_id should not be provided for donations', 400);
    }

    // Get Lemon Squeezy configuration
    const lemonApiKey = requireEnv('LEMON_SQUEEZY_API_KEY');
    const storeId = requireEnv('LEMON_SQUEEZY_STORE_ID');
    
    // Get variant ID for plan
    const variantMap: Record<string, string> = {
      pro_monthly: requireEnv('LEMON_SQUEEZY_VARIANT_PRO_MONTHLY'),
      pro_yearly: requireEnv('LEMON_SQUEEZY_VARIANT_PRO_YEARLY'),
      lifetime: requireEnv('LEMON_SQUEEZY_VARIANT_LIFETIME'),
      donate: requireEnv('LEMON_SQUEEZY_VARIANT_DONATE'),
    };

    const variantId = variantMap[plan_key];
    if (!variantId) {
      return errorResponse('Variant ID not configured for this plan', 500);
    }

    // Create Lemon Squeezy client
    const lemonClient = new LemonSqueezyClient(lemonApiKey);

    // Prepare custom data
    const customData: Record<string, string> = {
      discord_user_id: discordUserId,
      plan_key: plan_key,
    };

    if (guild_id) {
      customData.guild_id = guild_id;
    }

    // Create checkout session
    const testMode = requireEnv('LEMON_SQUEEZY_TEST_MODE') === 'true';
    
    const checkout = await lemonClient.createCheckout({
      storeId,
      variantId,
      customData,
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
        desc: true,
        discount: true,
        dark: false,
      },
      checkoutData: {
        email: user.email || undefined,
      },
      testMode,
    });

    console.log('Checkout created:', {
      checkout_id: checkout.data.id,
      plan_key,
      guild_id: guild_id || null,
      discord_user_id: discordUserId,
    });

    return jsonResponse({
      checkout_url: checkout.data.attributes.url,
      checkout_id: checkout.data.id,
      plan_key,
      guild_id: guild_id || null,
    });

  } catch (error) {
    return handleError(error);
  }
});
