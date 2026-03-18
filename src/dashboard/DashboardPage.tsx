import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, ServerCrash } from 'lucide-react';
import { config } from '../config';
import AuthCard from './components/AuthCard';
import DashboardModuleViewport from './components/DashboardModuleViewport';
import DashboardShell from './components/DashboardShell';
import StateCard from './components/StateCard';
import {
  useDashboardAuth,
  useDashboardGuilds,
  useGuildDashboardSnapshot,
  useRequestGuildBackupAction,
  useRequestGuildConfigChange,
  useRequestTicketDashboardAction,
  useSignInWithDiscord,
  useSignOutDashboard,
  useSyncDashboardGuilds,
} from './hooks/useDashboardData';
import { usePersistentDashboardSection } from './hooks/usePersistentDashboardSection';
import { useGuildSelection } from './hooks/useGuildSelection';
import { getDashboardSectionStates } from './utils';

export default function DashboardPage() {
  const [searchParams] = useSearchParams();
  const requestedGuildId = searchParams.get('guild');

  const authQuery = useDashboardAuth();
  const signIn = useSignInWithDiscord();
  const signOut = useSignOutDashboard();
  const syncGuilds = useSyncDashboardGuilds();

  const authState = authQuery.data ?? { session: null, user: null };
  const canUseDashboard = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  const isAuthenticated = Boolean(authState.user);

  const guildsQuery = useDashboardGuilds(isAuthenticated);
  const guilds = guildsQuery.data ?? [];
  const {
    selectedGuild,
    selectedGuildId,
    invalidRequestedGuildId,
    fallbackGuildId,
    setSelectedGuildId,
  } = useGuildSelection(guilds);

  const snapshotQuery = useGuildDashboardSnapshot(selectedGuildId, Boolean(selectedGuildId));
  const snapshot = snapshotQuery.data;
  const requestConfigChange = useRequestGuildConfigChange(selectedGuildId);
  const requestBackupAction = useRequestGuildBackupAction(selectedGuildId);
  const requestTicketAction = useRequestTicketDashboardAction(selectedGuildId);

  const { activeSection, setActiveSection } = usePersistentDashboardSection(
    selectedGuildId,
    snapshot?.config.dashboardPreferences.defaultSection,
  );

  const syncStatus = snapshot?.syncStatus ?? null;
  const mutations = snapshot?.mutations ?? [];
  const sectionStates = snapshot && selectedGuild
    ? getDashboardSectionStates(snapshot.config, selectedGuild, syncStatus, snapshot.backups, mutations)
    : [];
  const pendingMutations =
    syncStatus?.pendingMutations ?? mutations.filter((mutation) => mutation.status === 'pending').length;
  const failedMutations =
    syncStatus?.failedMutations ?? mutations.filter((mutation) => mutation.status === 'failed').length;
  const syncErrorMessage = syncGuilds.error instanceof Error ? syncGuilds.error.message : undefined;

  function syncGuildAccess() {
    const preferredGuildId = selectedGuildId ?? requestedGuildId;
    if (!authState.session?.provider_token) {
      console.warn('[dashboard-auth] dashboard:missing-provider-token', {
        selectedGuildId: preferredGuildId,
        hasSession: Boolean(authState.session),
        userId: authState.user?.id ?? null,
      });
      signIn.mutate(preferredGuildId);
      return;
    }

    void syncGuilds.mutateAsync(authState.session.provider_token).catch(() => undefined);
  }

  const titleGuildName = selectedGuild?.guildName ?? 'Dashboard';
  const authErrorMessage =
    authQuery.error instanceof Error ? authQuery.error.message : 'No se pudo validar la sesion del dashboard.';
  const guildsErrorMessage =
    guildsQuery.error instanceof Error
      ? guildsQuery.error.message
      : 'Intenta sincronizar otra vez o revisa la configuracion de Supabase.';
  const snapshotErrorMessage =
    snapshotQuery.error instanceof Error
      ? snapshotQuery.error.message
      : 'Revisa tablas, politicas RLS y el bridge del bot.';

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
        <div className="dashboard-shell flex min-h-screen items-center justify-center px-4 text-white">
          <div className="mx-auto w-full max-w-[42rem]">
            <StateCard
              eyebrow="Acceso seguro"
              title="Validando sesion del dashboard"
              description="Estamos comprobando tu sesion con Supabase antes de cargar servidores, permisos y estado operativo."
              icon={RefreshCcw}
              actions={(
                <span className="dashboard-status-pill-compact dashboard-neutral-pill">
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Verificando acceso
                </span>
              )}
            />
          </div>
        </div>
      ) : authQuery.isError ? (
        <div className="dashboard-shell px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <StateCard
              eyebrow="Acceso no disponible"
              title="No pudimos validar tu sesion"
              description={authErrorMessage}
              icon={ServerCrash}
              tone="danger"
              actions={(
                <>
                  <button
                    type="button"
                    onClick={() => authQuery.refetch()}
                    className="dashboard-primary-button"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reintentar validacion
                  </button>
                  <button
                    type="button"
                    onClick={() => signIn.mutate(requestedGuildId)}
                    disabled={signIn.isPending || !canUseDashboard}
                    className="dashboard-secondary-button"
                  >
                    Volver a iniciar con Discord
                  </button>
                </>
              )}
            />
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="dashboard-shell flex min-h-screen items-center justify-center px-4 py-8 text-white sm:px-6">
          <div className="mx-auto w-full max-w-[42rem]">
            <AuthCard
              canUseDashboard={canUseDashboard}
              isLoading={signIn.isPending}
              errorMessage={signIn.error instanceof Error ? signIn.error.message : undefined}
              onLogin={() => signIn.mutate(selectedGuildId ?? requestedGuildId)}
            />
          </div>
        </div>
      ) : guildsQuery.isLoading ? (
        <div className="dashboard-shell px-4 py-10 text-white">
          <div className="mx-auto max-w-5xl">
            <StateCard
              eyebrow="Sincronizacion inicial"
              title="Cargando tus servidores administrables"
              description="Estamos consultando el acceso ya sincronizado para preparar el selector de guild, el estado de salud y el snapshot del panel."
              icon={RefreshCcw}
              actions={(
                <span className="dashboard-status-pill-compact dashboard-neutral-pill">
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Preparando shell
                </span>
              )}
            />
          </div>
        </div>
      ) : guildsQuery.isError ? (
        <div className="dashboard-shell px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <StateCard
              eyebrow="Error de datos"
              title="No pudimos cargar tus servidores"
              description={guildsErrorMessage}
              icon={ServerCrash}
              tone="danger"
              actions={(
                <>
                  <button
                    type="button"
                    onClick={() => guildsQuery.refetch()}
                    className="dashboard-primary-button"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reintentar carga
                  </button>
                  <button
                    type="button"
                    onClick={syncGuildAccess}
                    disabled={syncGuilds.isPending}
                    className="dashboard-secondary-button"
                  >
                    <RefreshCcw className={`h-4 w-4 ${syncGuilds.isPending ? 'animate-spin' : ''}`} />
                    Re-sincronizar acceso
                  </button>
                </>
              )}
            />
          </div>
        </div>
      ) : !guilds.length ? (
        <div className="dashboard-shell px-4 py-10">
          <div className="mx-auto max-w-5xl">
            <StateCard
              eyebrow="Sin servidores"
              title="No encontramos guilds administrables para esta cuenta"
              description="Asegurate de tener permisos de administracion o Manage Server en Discord y vuelve a sincronizar el acceso."
              icon={AlertTriangle}
              tone="warning"
              actions={(
                <>
                  <button
                    type="button"
                    onClick={syncGuildAccess}
                    disabled={syncGuilds.isPending}
                    className="dashboard-primary-button"
                  >
                    <RefreshCcw className={`h-4 w-4 ${syncGuilds.isPending ? 'animate-spin' : ''}`} />
                    Re-sincronizar acceso
                  </button>
                  <button
                    type="button"
                    onClick={() => signOut.mutate()}
                    disabled={signOut.isPending}
                    className="dashboard-secondary-button"
                  >
                    Cambiar de cuenta
                  </button>
                </>
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
          syncStatus={syncStatus}
          pendingMutations={pendingMutations}
          failedMutations={failedMutations}
          sectionStates={sectionStates}
        >
          <DashboardModuleViewport
            activeSection={activeSection}
            selectedGuild={selectedGuild}
            invalidRequestedGuildId={invalidRequestedGuildId}
            fallbackGuildId={fallbackGuildId}
            setSelectedGuildId={setSelectedGuildId}
            syncGuildAccess={syncGuildAccess}
            isSyncing={syncGuilds.isPending}
            snapshot={snapshot}
            snapshotErrorMessage={snapshotErrorMessage}
            isSnapshotLoading={snapshotQuery.isLoading}
            isSnapshotError={snapshotQuery.isError}
            refetchSnapshot={() => void snapshotQuery.refetch()}
            requestConfigChangePending={requestConfigChange.isPending}
            requestBackupActionPending={requestBackupAction.isPending}
            requestTicketActionPending={requestTicketAction.isPending}
            onSectionChange={setActiveSection}
            onConfigSave={async (section, payload) => {
              await requestConfigChange.mutateAsync({ section, payload });
            }}
            onCreateBackup={async () => {
              await requestBackupAction.mutateAsync({
                action: 'create_backup',
                payload: {},
              });
            }}
            onRestoreBackup={async (backupId) => {
              await requestBackupAction.mutateAsync({
                action: 'restore_backup',
                payload: { backupId },
              });
            }}
            onTicketAction={async (action, payload) => {
              await requestTicketAction.mutateAsync({ action, payload });
            }}
          />
        </DashboardShell>
      )}
    </>
  );
}
