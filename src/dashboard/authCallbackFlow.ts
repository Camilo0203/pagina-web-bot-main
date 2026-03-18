import type { Session } from '@supabase/supabase-js';
import type { QueryClient } from '@tanstack/react-query';
import {
  clearDashboardAuthIntent,
  exchangeDashboardCodeForSession,
  getDashboardSession,
  peekDashboardAuthIntent,
  resolveDashboardRedirectPath,
  signInWithDiscord,
  syncDiscordGuilds,
} from './api';
import { dashboardQueryKeys } from './constants';

export const CALLBACK_REDIRECT_DELAY_MS = 700;
const CALLBACK_EXECUTION_STORAGE_PREFIX = 'dashboard:auth-callback:';

export type CallbackPhase = 'exchanging' | 'syncing' | 'redirecting' | 'error';

export interface CallbackViewState {
  phase: CallbackPhase;
  statusText: string;
  errorMessage: string;
  isCompleted: boolean;
  canRetrySync: boolean;
  canRestartLogin: boolean;
  redirectPath: string | null;
}

interface CallbackExecution {
  promise: Promise<string> | null;
  session: Session | null;
  requestedGuildId: string | null;
  state: CallbackViewState;
}

const callbackExecutions = new Map<string, CallbackExecution>();
const callbackSubscribers = new Map<string, Set<(state: CallbackViewState) => void>>();

export function normalizeAuthError(value: string | null): string {
  if (!value) {
    return '';
  }

  const decoded = value.replace(/\+/g, ' ').trim();
  return decoded || value;
}

function createInitialState(): CallbackViewState {
  return {
    phase: 'exchanging',
    statusText: 'Preparando autenticacion con Discord...',
    errorMessage: '',
    isCompleted: false,
    canRetrySync: false,
    canRestartLogin: false,
    redirectPath: null,
  };
}

function readExecutionStorage(attemptKey: string): CallbackExecution | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawExecution = window.sessionStorage.getItem(`${CALLBACK_EXECUTION_STORAGE_PREFIX}${attemptKey}`);
    if (!rawExecution) {
      return null;
    }

    const parsedExecution = JSON.parse(rawExecution) as {
      requestedGuildId?: unknown;
      state?: Partial<CallbackViewState>;
    };

    return {
      promise: null,
      session: null,
      requestedGuildId:
        typeof parsedExecution.requestedGuildId === 'string' && parsedExecution.requestedGuildId
          ? parsedExecution.requestedGuildId
          : null,
      state: {
        ...createInitialState(),
        ...parsedExecution.state,
      },
    };
  } catch {
    return null;
  }
}

export function persistExecutionStorage(attemptKey: string, execution: { requestedGuildId: string | null; state: CallbackViewState; session?: Session | null; promise?: Promise<string> | null }) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(
      `${CALLBACK_EXECUTION_STORAGE_PREFIX}${attemptKey}`,
      JSON.stringify({
        requestedGuildId: execution.requestedGuildId,
        state: execution.state,
      }),
    );
  } catch {
    // Ignoramos errores de storage para no romper el callback.
  }
}

export function getOrCreateExecution(attemptKey: string): CallbackExecution {
  const current = callbackExecutions.get(attemptKey);
  if (current) {
    return current;
  }

  const storedExecution = readExecutionStorage(attemptKey);
  const requestedGuildId = storedExecution?.requestedGuildId ?? peekDashboardAuthIntent().requestedGuildId;
  const execution: CallbackExecution = storedExecution ?? {
    promise: null,
    session: null,
    requestedGuildId,
    state: createInitialState(),
  };
  callbackExecutions.set(attemptKey, execution);
  persistExecutionStorage(attemptKey, execution);
  return execution;
}

export function subscribeToExecution(attemptKey: string, listener: (state: CallbackViewState) => void) {
  const listeners = callbackSubscribers.get(attemptKey) ?? new Set<(state: CallbackViewState) => void>();
  listeners.add(listener);
  callbackSubscribers.set(attemptKey, listeners);

  return () => {
    const currentListeners = callbackSubscribers.get(attemptKey);
    if (!currentListeners) {
      return;
    }

    currentListeners.delete(listener);
    if (!currentListeners.size) {
      callbackSubscribers.delete(attemptKey);
    }
  };
}

function emitExecutionState(attemptKey: string) {
  const execution = callbackExecutions.get(attemptKey);
  if (!execution) {
    return;
  }

  const listeners = callbackSubscribers.get(attemptKey);
  if (!listeners?.size) {
    return;
  }

  for (const listener of listeners) {
    listener(execution.state);
  }
}

export function updateExecutionState(attemptKey: string, patch: Partial<CallbackViewState>) {
  const execution = getOrCreateExecution(attemptKey);
  execution.state = {
    ...execution.state,
    ...patch,
  };
  persistExecutionStorage(attemptKey, execution);
  emitExecutionState(attemptKey);
}

async function recoverExistingSession() {
  const authState = await getDashboardSession();
  return authState.session;
}

function buildRedirectPath(execution: CallbackExecution, availableGuildIds: string[]): string {
  const preferredGuildId = execution.requestedGuildId;
  if (preferredGuildId && availableGuildIds.includes(preferredGuildId)) {
    return resolveDashboardRedirectPath(preferredGuildId);
  }

  return resolveDashboardRedirectPath(availableGuildIds[0] ?? null);
}

async function invalidateDashboardQueries(queryClient: QueryClient, redirectGuildId: string | null) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.auth }),
    queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.guilds }),
    redirectGuildId
      ? queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.snapshot(redirectGuildId) })
      : Promise.resolve(),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  ]);

  queryClient.removeQueries({ queryKey: ['dashboard', 'snapshot'] });
}

function resolveRetryFlags(errorMessage: string, execution: CallbackExecution) {
  const lowerMessage = errorMessage.toLowerCase();
  const canRetrySync =
    Boolean(execution.session?.provider_token)
    && !lowerMessage.includes('codigo')
    && !lowerMessage.includes('oauth')
    && !lowerMessage.includes('provider_token');
  const canRestartLogin =
    lowerMessage.includes('provider_token')
    || lowerMessage.includes('oauth')
    || lowerMessage.includes('codigo')
    || !canRetrySync;

  return {
    canRetrySync,
    canRestartLogin,
  };
}

export function runAuthCallbackFlow(
  attemptKey: string,
  code: string | null,
  authError: string | null,
  queryClient: QueryClient,
): Promise<string> {
  const execution = getOrCreateExecution(attemptKey);
  if (execution.state.isCompleted && execution.state.redirectPath) {
    return Promise.resolve(execution.state.redirectPath);
  }

  if (execution.promise) {
    return execution.promise;
  }

  execution.promise = (async () => {
    console.log('[dashboard-auth] callback:begin', {
      attemptKey,
      hasCode: Boolean(code),
      hasAuthError: Boolean(authError),
      callbackPath: window.location.pathname,
      callbackSearch: window.location.search,
      requestedGuildId: execution.requestedGuildId,
      hasCachedSession: Boolean(execution.session),
    });

    if (authError) {
      throw new Error(authError);
    }

    if (!execution.session) {
      updateExecutionState(attemptKey, {
        phase: 'exchanging',
        statusText: 'Intercambiando codigo por sesion segura...',
        errorMessage: '',
        canRetrySync: false,
        canRestartLogin: false,
      });

      let session: Session | null = null;
      let exchangeError: unknown = null;

      if (code) {
        try {
          session = await exchangeDashboardCodeForSession(code);
        } catch (error: unknown) {
          exchangeError = error;
        }
      }

      if (!session) {
        session = await recoverExistingSession();
      }

      if (!session && exchangeError) {
        throw exchangeError;
      }

      if (!session) {
        throw new Error('No llego ninguna sesion valida al callback. Vuelve a iniciar sesion desde el dashboard.');
      }

      execution.session = session;
      persistExecutionStorage(attemptKey, execution);
    }

    if (!execution.session?.provider_token) {
      throw new Error('Discord no devolvio provider_token. Repite el login para sincronizar servidores.');
    }

    updateExecutionState(attemptKey, {
      phase: 'syncing',
      statusText: 'Sincronizando servidores administrables con Supabase...',
      errorMessage: '',
      canRetrySync: false,
      canRestartLogin: false,
    });

    const syncResult = await syncDiscordGuilds(execution.session.provider_token);
    const redirectGuildId =
      execution.requestedGuildId && syncResult.guilds.some((guild) => guild.guildId === execution.requestedGuildId)
        ? execution.requestedGuildId
        : syncResult.guilds[0]?.guildId ?? null;

    await invalidateDashboardQueries(queryClient, redirectGuildId);

    const redirectPath = buildRedirectPath(
      execution,
      syncResult.guilds.map((guild) => guild.guildId),
    );
    clearDashboardAuthIntent();

    updateExecutionState(attemptKey, {
      phase: 'redirecting',
      statusText: syncResult.guilds.length
        ? 'Listo. Redirigiendo al panel con tus servidores sincronizados...'
        : 'Listo. Redirigiendo al dashboard para continuar con la cuenta autenticada...',
      errorMessage: '',
      isCompleted: true,
      canRetrySync: false,
      canRestartLogin: false,
      redirectPath,
    });

    return redirectPath;
  })().catch((error: unknown) => {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No se pudo completar el callback del dashboard.';
    const retryFlags = resolveRetryFlags(message, execution);

    console.error('[dashboard-auth] callback:error', {
      attemptKey,
      message,
      hasCachedSession: Boolean(execution.session),
      hasProviderToken: Boolean(execution.session?.provider_token),
      requestedGuildId: execution.requestedGuildId,
      error,
    });

    updateExecutionState(attemptKey, {
      phase: 'error',
      statusText: 'El acceso seguro no pudo completarse.',
      errorMessage: message,
      isCompleted: false,
      canRetrySync: retryFlags.canRetrySync,
      canRestartLogin: retryFlags.canRestartLogin,
      redirectPath: null,
    });

    throw error;
  }).finally(() => {
    const currentExecution = callbackExecutions.get(attemptKey);
    if (currentExecution) {
      currentExecution.promise = null;
    }
  });

  return execution.promise;
}

export function restartAuthCallbackFlow(attemptKey: string) {
  const execution = getOrCreateExecution(attemptKey);
  updateExecutionState(attemptKey, {
    phase: 'syncing',
    statusText: 'Reintentando sincronizacion de servidores...',
    errorMessage: '',
    canRetrySync: false,
    canRestartLogin: false,
  });
  execution.promise = null;
  persistExecutionStorage(attemptKey, execution);
}

export function restartDiscordLogin(attemptKey: string) {
  const execution = getOrCreateExecution(attemptKey);
  execution.promise = null;
  execution.session = null;
  persistExecutionStorage(attemptKey, execution);

  return signInWithDiscord(execution.requestedGuildId);
}
