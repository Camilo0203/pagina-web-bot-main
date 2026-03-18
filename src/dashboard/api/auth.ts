import type { Session } from '@supabase/supabase-js';
import { getAuthCallbackUrl } from '../../config';
import { dashboardSyncResultSchema } from '../schemas';
import type { DashboardSessionState, DashboardSyncResult } from '../types';
import {
  createDashboardError,
  getSupabaseClient,
  GUILD_SYNC_TIMEOUT_MS,
  OAUTH_EXCHANGE_TIMEOUT_MS,
  persistDashboardAuthIntent,
  runQueryWithTimeout,
  withTimeout,
} from './shared';

export async function getDashboardSession(): Promise<DashboardSessionState> {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return {
      session: null,
      user: null,
    };
  }

  const client = getSupabaseClient();
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] =
    await runQueryWithTimeout(
      'auth.session',
      Promise.all([client.auth.getSession(), client.auth.getUser()]),
    );

  if (sessionError) {
    throw createDashboardError(
      'auth.session',
      sessionError,
      'No se pudo validar la sesion actual del dashboard.',
    );
  }

  if (userError) {
    throw createDashboardError(
      'auth.user',
      userError,
      'No se pudo cargar el usuario autenticado del dashboard.',
    );
  }

  return {
    session: sessionData.session,
    user: userData.user,
  };
}

export async function signInWithDiscord(requestedGuildId?: string | null): Promise<void> {
  const client = getSupabaseClient();
  persistDashboardAuthIntent(requestedGuildId);

  console.log('[dashboard-auth] signInWithDiscord:start', {
    redirectTo: getAuthCallbackUrl(),
    requestedGuildId: requestedGuildId ?? null,
  });

  const { error } = await client.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: getAuthCallbackUrl(),
      scopes: 'identify guilds guilds.members.read',
    },
  });

  if (error) {
    throw createDashboardError(
      'auth.oauth.start',
      error,
      'No se pudo iniciar el acceso con Discord para el dashboard.',
    );
  }
}

export async function signOutDashboard(): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await runQueryWithTimeout('auth.signout', client.auth.signOut());

  if (error) {
    throw createDashboardError(
      'auth.signout',
      error,
      'No se pudo cerrar la sesion del dashboard.',
    );
  }
}

export async function exchangeDashboardCodeForSession(code: string): Promise<Session | null> {
  const startedAt = Date.now();
  const client = getSupabaseClient();

  if (!code.trim()) {
    throw new Error('No llego un codigo OAuth valido al callback.');
  }

  console.log('[dashboard-auth] exchangeDashboardCodeForSession:start', {
    startedAt: new Date(startedAt).toISOString(),
    codeLength: code.length,
  });

  try {
    const { data, error } = await withTimeout(
      client.auth.exchangeCodeForSession(code),
      OAUTH_EXCHANGE_TIMEOUT_MS,
      `El intercambio OAuth tardo demasiado (${OAUTH_EXCHANGE_TIMEOUT_MS / 1000}s). Revisa la red, Supabase Auth y la configuracion de redirect URLs.`,
    );

    if (error) {
      throw error;
    }

    console.log('[dashboard-auth] exchangeDashboardCodeForSession:success', {
      durationMs: Date.now() - startedAt,
      hasSession: Boolean(data.session),
      userId: data.session?.user?.id ?? null,
    });

    return data.session;
  } catch (error: unknown) {
    const dashboardError = createDashboardError(
      'auth.oauth.exchange',
      error,
      'No se pudo intercambiar el codigo OAuth con Supabase.',
    );
    console.error('[dashboard-auth] exchangeDashboardCodeForSession:error', {
      durationMs: Date.now() - startedAt,
      message: dashboardError.message,
      error,
    });
    throw dashboardError;
  }
}

export async function syncDiscordGuilds(providerToken: string): Promise<DashboardSyncResult> {
  const startedAt = Date.now();
  const client = getSupabaseClient();

  if (!providerToken.trim()) {
    throw new Error('No llego un provider token valido para sincronizar los servidores.');
  }

  console.log('[dashboard-auth] syncDiscordGuilds:start', {
    startedAt: new Date(startedAt).toISOString(),
    tokenLength: providerToken.length,
  });

  try {
    const { data, error } = await withTimeout(
      client.functions.invoke('sync-discord-guilds', {
        body: {
          providerToken,
        },
      }),
      GUILD_SYNC_TIMEOUT_MS,
      `La sincronizacion inicial de servidores tardo demasiado (${GUILD_SYNC_TIMEOUT_MS / 1000}s). Revisa la funcion sync-discord-guilds, la red y el estado de Supabase.`,
    );

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('La funcion sync-discord-guilds respondio vacio.');
    }

    const parsedResult = dashboardSyncResultSchema.parse(data);
    console.log('[dashboard-auth] syncDiscordGuilds:success', {
      durationMs: Date.now() - startedAt,
      manageableCount: parsedResult.manageableCount,
      installedCount: parsedResult.installedCount,
    });

    return parsedResult;
  } catch (error: unknown) {
    const dashboardError = createDashboardError(
      'auth.guild-sync',
      error,
      'No se pudieron sincronizar los servidores administrables con Supabase.',
    );
    console.error('[dashboard-auth] syncDiscordGuilds:error', {
      durationMs: Date.now() - startedAt,
      message: dashboardError.message,
      error,
    });
    throw dashboardError;
  }
}
