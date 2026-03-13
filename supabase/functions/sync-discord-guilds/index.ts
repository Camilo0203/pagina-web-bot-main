import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DISCORD_ADMINISTRATOR = 8n;
const DISCORD_MANAGE_GUILD = 32n;

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
  permissions?: string;
  permissions_new?: string;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const authHeader = request.headers.get('Authorization');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables.');
    }

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { providerToken } = await request.json();
    if (typeof providerToken !== 'string' || !providerToken) {
      return new Response(JSON.stringify({ error: 'Missing Discord provider token.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid Supabase session.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const discordResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${providerToken}`,
      },
    });

    if (!discordResponse.ok) {
      return new Response(JSON.stringify({ error: 'Discord guild sync failed.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const discordGuilds = (await discordResponse.json()) as DiscordGuild[];
    const manageableGuilds = discordGuilds.filter((guild) => {
      const permissionsRaw = guild.permissions_new ?? guild.permissions ?? '0';
      const permissions = BigInt(permissionsRaw);
      return Boolean(guild.owner) || (permissions & DISCORD_ADMINISTRATOR) === DISCORD_ADMINISTRATOR || (permissions & DISCORD_MANAGE_GUILD) === DISCORD_MANAGE_GUILD;
    });

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);
    const nowIso = new Date().toISOString();

    if (!manageableGuilds.length) {
      await adminClient.from('user_guild_access').delete().eq('user_id', user.id);

      return new Response(JSON.stringify({
        guilds: [],
        syncedAt: nowIso,
        manageableCount: 0,
        installedCount: 0,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const guildIds = manageableGuilds.map((guild) => guild.id);
    const { data: installedGuilds, error: installedError } = await adminClient
      .from('bot_guilds')
      .select('guild_id, guild_name, guild_icon, member_count, premium_tier, last_heartbeat_at')
      .in('guild_id', guildIds);

    if (installedError) {
      throw installedError;
    }

    const installedById = new Map(
      (installedGuilds ?? []).map((guild) => [guild.guild_id, guild]),
    );

    const accessRows = manageableGuilds.map((guild) => {
      const permissionsRaw = guild.permissions_new ?? guild.permissions ?? '0';
      const installedGuild = installedById.get(guild.id);

      return {
        user_id: user.id,
        guild_id: guild.id,
        guild_name: guild.name,
        guild_icon: guild.icon,
        permissions_raw: permissionsRaw,
        can_manage: true,
        is_owner: Boolean(guild.owner),
        bot_installed: Boolean(installedGuild),
        member_count: installedGuild?.member_count ?? null,
        premium_tier: installedGuild?.premium_tier ?? null,
        bot_last_seen_at: installedGuild?.last_heartbeat_at ?? null,
        last_synced_at: nowIso,
      };
    });

    const { error: upsertError } = await adminClient
      .from('user_guild_access')
      .upsert(accessRows, { onConflict: 'user_id,guild_id' });

    if (upsertError) {
      throw upsertError;
    }

    const guildIdSet = new Set(guildIds);
    const { data: existingRows } = await adminClient
      .from('user_guild_access')
      .select('id, guild_id')
      .eq('user_id', user.id);

    const staleIds = (existingRows ?? [])
      .filter((row) => !guildIdSet.has(row.guild_id))
      .map((row) => row.id);

    if (staleIds.length) {
      await adminClient.from('user_guild_access').delete().in('id', staleIds);
    }

    const responseGuilds = accessRows
      .sort((left, right) => {
        if (left.bot_installed !== right.bot_installed) {
          return left.bot_installed ? -1 : 1;
        }

        return left.guild_name.localeCompare(right.guild_name);
      })
      .map((guild) => ({
        guildId: guild.guild_id,
        guildName: guild.guild_name,
        guildIcon: guild.guild_icon,
        permissionsRaw: guild.permissions_raw,
        canManage: guild.can_manage,
        isOwner: guild.is_owner,
        botInstalled: guild.bot_installed,
        memberCount: guild.member_count,
        premiumTier: guild.premium_tier,
        botLastSeenAt: guild.bot_last_seen_at,
        lastSyncedAt: guild.last_synced_at,
      }));

    return new Response(JSON.stringify({
      guilds: responseGuilds,
      syncedAt: nowIso,
      manageableCount: responseGuilds.length,
      installedCount: responseGuilds.filter((guild) => guild.botInstalled).length,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected sync error.';

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
