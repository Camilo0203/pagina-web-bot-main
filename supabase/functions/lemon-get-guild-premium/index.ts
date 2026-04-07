import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders, jsonResponse, requireEnv, createAdminClient } from '../_shared/billing.ts';

const BOT_API_KEY = Deno.env.get('BOT_API_KEY') || '';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const apiKey = request.headers.get('X-Bot-Api-Key');
    if (!apiKey || apiKey !== BOT_API_KEY) {
      return jsonResponse({ error: 'Unauthorized. Invalid or missing API key.' }, 401);
    }

    const url = new URL(request.url);
    const guildId = url.pathname.split('/').pop();

    if (!guildId) {
      return jsonResponse({ error: 'Missing guild_id in path.' }, 400);
    }

    const adminClient = createAdminClient();

    const { data: premium, error } = await adminClient
      .from('guild_premium')
      .select('guild_id, tier, is_active, expires_at, discord_user_id')
      .eq('guild_id', guildId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!premium) {
      return jsonResponse({
        guild_id: guildId,
        has_premium: false,
        tier: null,
        expires_at: null,
        owner_user_id: null,
      });
    }

    const now = new Date();
    const expiresAt = premium.expires_at ? new Date(premium.expires_at) : null;
    const isExpired = expiresAt && expiresAt < now;
    const isActive = premium.is_active && !isExpired;

    if (isExpired && premium.is_active) {
      await adminClient
        .from('guild_premium')
        .update({ is_active: false })
        .eq('guild_id', guildId);
    }

    return jsonResponse({
      guild_id: guildId,
      has_premium: isActive,
      tier: isActive ? premium.tier : null,
      expires_at: premium.expires_at,
      owner_user_id: premium.discord_user_id,
    });

  } catch (error) {
    console.error('Error fetching guild premium status:', error);
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch premium status.',
      },
      500,
    );
  }
});
