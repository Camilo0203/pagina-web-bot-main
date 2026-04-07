import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { corsHeaders, getAuthenticatedUser, jsonResponse, createAdminClient } from '../_shared/billing.ts';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  try {
    const user = await getAuthenticatedUser(request);
    const adminClient = createAdminClient();

    const { data: guilds, error } = await adminClient
      .from('user_guild_access')
      .select('guild_id, guild_name, guild_icon, can_manage, bot_installed')
      .eq('user_id', user.id)
      .eq('can_manage', true)
      .order('guild_name', { ascending: true });

    if (error) {
      throw error;
    }

    const guildIds = guilds?.map(g => g.guild_id) || [];
    
    const { data: premiumData } = await adminClient
      .from('guild_premium')
      .select('guild_id, tier, is_active, expires_at')
      .in('guild_id', guildIds.length > 0 ? guildIds : ['']);

    const premiumMap = new Map(
      (premiumData || []).map(p => [p.guild_id, p])
    );

    const enrichedGuilds = (guilds || []).map(guild => {
      const premium = premiumMap.get(guild.guild_id);
      const now = new Date();
      const expiresAt = premium?.expires_at ? new Date(premium.expires_at) : null;
      const isExpired = expiresAt && expiresAt < now;
      const hasPremium = premium?.is_active && !isExpired;

      return {
        id: guild.guild_id,
        name: guild.guild_name,
        icon: guild.guild_icon,
        can_manage: guild.can_manage,
        bot_installed: guild.bot_installed,
        has_premium: hasPremium || false,
        premium_tier: hasPremium ? premium?.tier : null,
        premium_expires_at: premium?.expires_at || null,
      };
    });

    return jsonResponse({
      guilds: enrichedGuilds,
    });

  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error('Error fetching user guilds:', error);
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch guilds.',
      },
      500,
    );
  }
});
