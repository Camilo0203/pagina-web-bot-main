import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertOctagon, Bot, CheckCircle2, Loader2 } from 'lucide-react';
import { config } from '../config';
import { useExchangeDashboardCode, useSyncDashboardGuilds } from './hooks/useDashboardData';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exchangeCode = useExchangeDashboardCode();
  const syncGuilds = useSyncDashboardGuilds();
  const [statusText, setStatusText] = useState('Preparando autenticacion con Discord...');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function completeAuthFlow() {
      const authError = searchParams.get('error_description') || searchParams.get('error');
      const code = searchParams.get('code');

      if (authError) {
        throw new Error(authError);
      }

      if (!code) {
        throw new Error('No llego ningun codigo OAuth a la ruta de callback.');
      }

      setStatusText('Intercambiando codigo por sesion segura...');
      const session = await exchangeCode.mutateAsync(code);

      if (!session?.provider_token) {
        throw new Error('Discord no devolvio provider_token. Repite el login para sincronizar servidores.');
      }

      setStatusText('Sincronizando servidores administrables con Supabase...');
      const syncResult = await syncGuilds.mutateAsync(session.provider_token);

      if (isCancelled) {
        return;
      }

      const firstGuildId = syncResult.guilds[0]?.guildId;
      setStatusText('Listo. Redirigiendo al panel...');

      window.setTimeout(() => {
        navigate(firstGuildId ? `/dashboard?guild=${encodeURIComponent(firstGuildId)}` : '/dashboard', {
          replace: true,
        });
      }, 500);
    }

    void completeAuthFlow().catch((error: unknown) => {
      if (isCancelled) {
        return;
      }

      const message = error instanceof Error ? error.message : 'No se pudo completar el callback.';
      setErrorMessage(message);
    });

    return () => {
      isCancelled = true;
    };
  }, [exchangeCode, navigate, searchParams, syncGuilds]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <Helmet>
        <title>{config.botName} | Auth Callback</title>
      </Helmet>
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand-300">Discord OAuth</p>
            <h1 className="text-3xl font-bold">Callback del dashboard</h1>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-8 rounded-[1.75rem] border border-rose-400/30 bg-rose-500/10 p-6">
            <div className="flex items-start gap-3">
              <AlertOctagon className="mt-0.5 h-5 w-5 text-rose-300" />
              <div>
                <p className="font-semibold text-rose-100">No pudimos completar el acceso</p>
                <p className="mt-2 text-sm leading-relaxed text-rose-100/80">{errorMessage}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-3">
              {syncGuilds.isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
              ) : (
                <Loader2 className="mt-0.5 h-5 w-5 animate-spin text-emerald-300" />
              )}
              <div>
                <p className="font-semibold text-emerald-100">Procesando acceso seguro</p>
                <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">{statusText}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
