import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AlertOctagon, ArrowRight, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { config } from '../config';
import Logo from '../components/Logo';
import {
  CALLBACK_REDIRECT_DELAY_MS,
  type CallbackViewState,
  getOrCreateExecution,
  normalizeAuthError,
  restartAuthCallbackFlow,
  restartDiscordLogin,
  runAuthCallbackFlow,
  subscribeToExecution,
  updateExecutionState,
} from './authCallbackFlow';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [retryNonce, setRetryNonce] = useState(0);

  const authError = normalizeAuthError(
    searchParams.get('error_description') || searchParams.get('error'),
  );
  const code = searchParams.get('code');
  const attemptKey = useMemo(
    () => (authError ? `error:${authError}` : code ? `code:${code}` : 'missing-code'),
    [authError, code],
  );
  const [viewState, setViewState] = useState<CallbackViewState>(() => getOrCreateExecution(attemptKey).state);
  const dashboardBrandLabel = `${config.botName} Dashboard`;

  useEffect(() => {
    setViewState(getOrCreateExecution(attemptKey).state);
    return subscribeToExecution(attemptKey, setViewState);
  }, [attemptKey]);

  useEffect(() => {
    let redirectTimeout: number | null = null;

    void runAuthCallbackFlow(attemptKey, code, authError || null, queryClient)
      .then((redirectPath) => {
        redirectTimeout = window.setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, CALLBACK_REDIRECT_DELAY_MS);
      })
      .catch(() => undefined);

    return () => {
      if (redirectTimeout !== null) {
        window.clearTimeout(redirectTimeout);
      }
    };
  }, [attemptKey, authError, code, navigate, queryClient, retryNonce]);

  function handleRetrySync() {
    restartAuthCallbackFlow(attemptKey);
    setRetryNonce((current) => current + 1);
  }

  function handleRestartLogin() {
    void restartDiscordLogin(attemptKey).catch((error: unknown) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No se pudo reiniciar el login con Discord.';

      updateExecutionState(attemptKey, {
        phase: 'error',
        statusText: 'No se pudo reiniciar el login.',
        errorMessage: message,
        canRetrySync: false,
        canRestartLogin: true,
      });
    });
  }

  return (
    <main className="dashboard-shell flex min-h-screen items-center justify-center px-4 py-8 text-white sm:px-6">
      <Helmet>
        <title>{dashboardBrandLabel} | Auth</title>
      </Helmet>
      <div className="dashboard-surface relative w-full max-w-xl overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(88,101,242,0.12),transparent_28%)]" />
        <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-center">
          <Logo size="lg" subtitle={config.botName} />
          <div>
            <p className="dashboard-panel-label">Discord OAuth</p>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 dark:text-white">Acceso a {dashboardBrandLabel}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Verificando la sesion segura y sincronizando acceso a servidores sin alterar tu configuracion actual.
            </p>
          </div>
        </div>

        {viewState.errorMessage ? (
          <div className="relative z-[1] mt-8 rounded-[1.75rem] border border-rose-200/70 bg-rose-50/90 p-5 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertOctagon className="mt-0.5 h-5 w-5" />
              <div className="w-full">
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">No se completo el acceso</p>
                <p className="mt-2 text-lg font-semibold">Necesitamos una accion para continuar.</p>
                <p className="mt-2 text-sm leading-relaxed text-current/80">{viewState.errorMessage}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {viewState.canRetrySync ? (
                    <button type="button" onClick={handleRetrySync} className="dashboard-primary-button">
                      <RotateCcw className="h-4 w-4" />
                      Reintentar sincronizacion
                    </button>
                  ) : null}
                  {viewState.canRestartLogin ? (
                    <button type="button" onClick={handleRestartLogin} className="dashboard-secondary-button">
                      Reiniciar login con Discord
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-[1] mt-8 rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 dark:border-surface-600 dark:bg-surface-800/70 sm:p-6">
            <div className="flex items-start gap-3">
              {viewState.isCompleted ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
              ) : (
                <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-brand-500" />
              )}
              <div className="w-full">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {viewState.phase === 'redirecting' ? 'Finalizando acceso' : 'Acceso en progreso'}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{viewState.statusText}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {viewState.phase === 'syncing'
                    ? 'Estamos dejando lista la cuenta autenticada para entrar al dashboard con tus guilds administrables ya resueltos.'
                    : 'El callback mantiene el contexto del login para que no pierdas el servidor que querias abrir.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
