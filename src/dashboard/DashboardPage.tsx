import { Suspense, lazy, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  AlertTriangle,
  RefreshCcw,
  ServerCrash,
} from 'lucide-react';
import { config } from '../config';
import AuthCard from './components/AuthCard';
import DashboardShell from './components/DashboardShell';
import StateCard from './components/StateCard';
import {
  useDashboardAuth,
  useDashboardGuilds,
  useSaveGuildConfig,
  useSignInWithDiscord,
  useSignOutDashboard,
  useSyncDashboardGuilds,
  useGuildActivity,
  useGuildConfig,
  useGuildMetrics,
} from './hooks/useDashboardData';
import { useGuildSelection } from './hooks/useGuildSelection';
import { createDefaultGuildConfig } from './utils';
import type {
  DashboardSectionId,
  GuildConfig,
} from './types';

const OverviewModule = lazy(() => import('./modules/OverviewModule'));
const GeneralModule = lazy(() => import('./modules/GeneralModule'));
const ModerationModule = lazy(() => import('./modules/ModerationModule'));
const ActivityModule = lazy(() => import('./modules/ActivityModule'));
const AnalyticsModule = lazy(() => import('./modules/AnalyticsModule'));

function ModuleFallback() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-48 animate-pulse rounded-[2rem] border border-white/10 bg-white/70 dark:bg-surface-800/75"
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const authQuery = useDashboardAuth();
  const signIn = useSignInWithDiscord();
  const signOut = useSignOutDashboard();
  const syncGuilds = useSyncDashboardGuilds();
  const [activeSection, setActiveSection] = useState<DashboardSectionId>('overview');

  const authState = authQuery.data ?? { session: null, user: null };
  const canUseDashboard = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  const isAuthenticated = Boolean(authState.user);

  const guildsQuery = useDashboardGuilds(isAuthenticated);
  const guilds = guildsQuery.data ?? [];
  const { selectedGuild, selectedGuildId, setSelectedGuildId } = useGuildSelection(guilds);
  const configQuery = useGuildConfig(selectedGuildId, Boolean(selectedGuildId));
  const activityQuery = useGuildActivity(selectedGuildId, Boolean(selectedGuildId));
  const metricsQuery = useGuildMetrics(selectedGuildId, Boolean(selectedGuildId));
  const saveConfig = useSaveGuildConfig(selectedGuildId);

  const effectiveConfig = configQuery.data ?? createDefaultGuildConfig(selectedGuildId ?? '');
  const syncErrorMessage =
    syncGuilds.error instanceof Error
      ? syncGuilds.error.message
      : undefined;

  async function handleGeneralSave(values: Pick<GuildConfig, 'generalSettings' | 'dashboardPreferences'>) {
    await saveConfig.mutateAsync({
      generalSettings: values.generalSettings,
      moderationSettings: effectiveConfig.moderationSettings,
      dashboardPreferences: values.dashboardPreferences,
    });
  }

  async function handleModerationSave(values: Pick<GuildConfig, 'moderationSettings'>) {
    await saveConfig.mutateAsync({
      generalSettings: effectiveConfig.generalSettings,
      moderationSettings: values.moderationSettings,
      dashboardPreferences: effectiveConfig.dashboardPreferences,
    });
  }

  function syncGuildAccess() {
    if (!authState.session?.provider_token) {
      signIn.mutate();
      return;
    }

    void syncGuilds.mutateAsync(authState.session.provider_token).catch(() => undefined);
  }

  const moduleLoading =
    selectedGuild && (
      activeSection === 'overview'
        ? configQuery.isLoading || activityQuery.isLoading || metricsQuery.isLoading
        : activeSection === 'general' || activeSection === 'moderation'
          ? configQuery.isLoading
          : activeSection === 'activity'
            ? activityQuery.isLoading || configQuery.isLoading
            : metricsQuery.isLoading
    );

  const moduleError =
    activeSection === 'overview'
      ? configQuery.error || activityQuery.error || metricsQuery.error
      : activeSection === 'general' || activeSection === 'moderation'
        ? configQuery.error
        : activeSection === 'activity'
          ? activityQuery.error || configQuery.error
          : metricsQuery.error;

  const titleGuildName = selectedGuild?.guildName ?? 'Dashboard';

  return (
    <>
      <Helmet>
        <title>{config.botName} | Dashboard | {titleGuildName}</title>
        <meta
          name="description"
          content="Dashboard profesional para administrar configuraciones, actividad y analiticas de tu bot de Discord."
        />
      </Helmet>

      {authQuery.isLoading ? (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-xl">
            <p className="text-lg font-semibold">Validando sesion del dashboard...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen bg-[linear-gradient(180deg,_#101323_0%,_#151933_100%)] px-4 py-10 text-white">
          <div className="mx-auto max-w-5xl">
            <AuthCard
              canUseDashboard={canUseDashboard}
              isLoading={signIn.isPending}
              errorMessage={signIn.error instanceof Error ? signIn.error.message : undefined}
              onLogin={() => signIn.mutate()}
            />
          </div>
        </div>
      ) : guildsQuery.isLoading ? (
        <div className="min-h-screen bg-[linear-gradient(180deg,_#101323_0%,_#151933_100%)] px-4 py-10 text-white">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="text-lg font-semibold">Cargando servidores administrables...</p>
          </div>
        </div>
      ) : guildsQuery.isError ? (
        <div className="min-h-screen bg-[linear-gradient(180deg,_#101323_0%,_#151933_100%)] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <StateCard
              eyebrow="Error de datos"
              title="No pudimos cargar tus servidores"
              description={guildsQuery.error instanceof Error ? guildsQuery.error.message : 'Intenta sincronizar otra vez o revisa la configuracion de Supabase.'}
              icon={ServerCrash}
              tone="danger"
            />
          </div>
        </div>
      ) : !guilds.length ? (
        <div className="min-h-screen bg-[linear-gradient(180deg,_#101323_0%,_#151933_100%)] px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <StateCard
              eyebrow="Sin servidores"
              title="No encontramos guilds administrables para esta cuenta"
              description="Asegurate de tener permisos de administracion o Manage Server en Discord y vuelve a sincronizar el acceso."
              icon={AlertTriangle}
              tone="warning"
              actions={(
                <button
                  type="button"
                  onClick={syncGuildAccess}
                  disabled={syncGuilds.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw className={`h-4 w-4 ${syncGuilds.isPending ? 'animate-spin' : ''}`} />
                  Re-sincronizar acceso
                </button>
              )}
            />
          </div>
        </div>
      ) : (
        <DashboardShell
          user={authState.user!}
          guilds={guilds}
          selectedGuild={selectedGuild}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onGuildChange={setSelectedGuildId}
          onSync={syncGuildAccess}
          onLogout={() => signOut.mutate()}
          isSyncing={syncGuilds.isPending}
          syncError={syncErrorMessage}
        >
          {!selectedGuild ? (
            <StateCard
              eyebrow="Seleccion requerida"
              title="Escoge un servidor para continuar"
              description="En cuanto elijas un guild, cargaremos la configuracion, actividad y analiticas asociadas."
              icon={AlertTriangle}
            />
          ) : moduleError ? (
            <StateCard
              eyebrow="Modulo no disponible"
              title="No pudimos cargar esta seccion"
              description={moduleError instanceof Error ? moduleError.message : 'Revisa permisos, tablas y politicas RLS del panel.'}
              icon={ServerCrash}
              tone="danger"
            />
          ) : moduleLoading ? (
            <ModuleFallback />
          ) : (
            <Suspense fallback={<ModuleFallback />}>
              {activeSection === 'overview' ? (
                <OverviewModule
                  guild={selectedGuild}
                  config={effectiveConfig}
                  events={activityQuery.data ?? []}
                  metrics={metricsQuery.data ?? []}
                  onSectionChange={setActiveSection}
                />
              ) : null}
              {activeSection === 'general' ? (
                <GeneralModule
                  guild={selectedGuild}
                  config={effectiveConfig}
                  isSaving={saveConfig.isPending}
                  onSave={handleGeneralSave}
                />
              ) : null}
              {activeSection === 'moderation' ? (
                <ModerationModule
                  guild={selectedGuild}
                  config={effectiveConfig}
                  isSaving={saveConfig.isPending}
                  onSave={handleModerationSave}
                />
              ) : null}
              {activeSection === 'activity' ? (
                <ActivityModule
                  guild={selectedGuild}
                  config={effectiveConfig}
                  events={activityQuery.data ?? []}
                />
              ) : null}
              {activeSection === 'analytics' ? (
                <AnalyticsModule
                  guild={selectedGuild}
                  metrics={metricsQuery.data ?? []}
                />
              ) : null}
            </Suspense>
          )}
        </DashboardShell>
      )}
    </>
  );
}
