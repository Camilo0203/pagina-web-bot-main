import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import {
  Bot,
  ExternalLink,
  LogOut,
  Menu,
  Moon,
  RefreshCcw,
  Sun,
  X,
} from 'lucide-react';
import { dashboardSections } from '../constants';
import type { DashboardGuild, DashboardSectionId } from '../types';
import {
  formatDateTime,
  formatRelativeTime,
  resolveGuildIconUrl,
  resolveGuildInitials,
  resolveUserAvatarUrl,
} from '../utils';
import { getDiscordInviteUrl } from '../../config';
import { useTheme } from '../../components/ThemeProvider';

interface DashboardShellProps {
  user: User;
  guilds: DashboardGuild[];
  selectedGuild: DashboardGuild | null;
  activeSection: DashboardSectionId;
  onSectionChange: (section: DashboardSectionId) => void;
  onGuildChange: (guildId: string) => void;
  onSync: () => void;
  onLogout: () => void;
  isSyncing: boolean;
  syncError?: string;
  children: ReactNode;
}

interface SidebarProps {
  guilds: DashboardGuild[];
  selectedGuild: DashboardGuild | null;
  activeSection: DashboardSectionId;
  onSectionChange: (section: DashboardSectionId) => void;
  onGuildChange: (guildId: string) => void;
  onSync: () => void;
  onLogout: () => void;
  isSyncing: boolean;
}

function SidebarContent({
  guilds,
  selectedGuild,
  activeSection,
  onSectionChange,
  onGuildChange,
  onSync,
  onLogout,
  isSyncing,
}: SidebarProps) {
  const inviteUrl = selectedGuild ? getDiscordInviteUrl(selectedGuild.guildId) : '';

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/80 p-5 shadow-xl dark:bg-surface-800/85">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
              Dashboard
            </p>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">
              Control center
            </p>
          </div>
        </Link>

        <div className="mt-5">
          <label htmlFor="guild-select" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Servidor
          </label>
          <select
            id="guild-select"
            value={selectedGuild?.guildId ?? ''}
            onChange={(event) => onGuildChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
          >
            {guilds.map((guild) => (
              <option key={guild.guildId} value={guild.guildId}>
                {guild.guildName}
                {guild.botInstalled ? ' · instalado' : ' · pendiente'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="rounded-[1.75rem] border border-white/10 bg-white/80 p-4 shadow-xl dark:bg-surface-800/85">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Modulos
        </p>
        <div className="space-y-2">
          {dashboardSections.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-200'
                    : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-300 dark:hover:border-surface-600 dark:hover:bg-surface-700/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{section.label}</p>
                    <p className="mt-1 text-sm opacity-80">{section.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {selectedGuild ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950 p-5 text-white shadow-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-300">
            Estado del bot
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${selectedGuild.botInstalled ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <p className="text-lg font-semibold">
              {selectedGuild.botInstalled ? 'Instalado y sincronizado' : 'Instalacion pendiente'}
            </p>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            Ultima sincronizacion {formatRelativeTime(selectedGuild.lastSyncedAt)}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Heartbeat del bot {formatDateTime(selectedGuild.botLastSeenAt)}
          </p>
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Re-sincronizar acceso'}
            </button>
            {!selectedGuild.botInstalled && inviteUrl ? (
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                <ExternalLink className="h-4 w-4" />
                Invitar bot a este servidor
              </a>
            ) : null}
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent px-4 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardShell({
  user,
  guilds,
  selectedGuild,
  activeSection,
  onSectionChange,
  onGuildChange,
  onSync,
  onLogout,
  isSyncing,
  syncError,
  children,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const sectionMeta = dashboardSections.find((section) => section.id === activeSection);
  const guildIconUrl = selectedGuild ? resolveGuildIconUrl(selectedGuild) : null;
  const userAvatarUrl = resolveUserAvatarUrl(user);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(88,101,242,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#f6f8ff_0%,_#eef2ff_100%)] text-slate-950 transition-colors dark:bg-[radial-gradient(circle_at_top_left,_rgba(88,101,242,0.2),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#101323_0%,_#151933_100%)] dark:text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-6">
        <aside className="hidden lg:block">
          <SidebarContent
            guilds={guilds}
            selectedGuild={selectedGuild}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            onGuildChange={onGuildChange}
            onSync={onSync}
            onLogout={onLogout}
            isSyncing={isSyncing}
          />
        </aside>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
        ) : null}

        <div className={`fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm overflow-y-auto px-4 py-4 transition-transform duration-300 lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full rounded-[2rem] border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-xl border border-white/10 p-2 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              guilds={guilds}
              selectedGuild={selectedGuild}
              activeSection={activeSection}
              onSectionChange={(section) => {
                onSectionChange(section);
                setIsSidebarOpen(false);
              }}
              onGuildChange={(guildId) => {
                onGuildChange(guildId);
                setIsSidebarOpen(false);
              }}
              onSync={onSync}
              onLogout={onLogout}
              isSyncing={isSyncing}
            />
          </div>
        </div>

        <main className="min-w-0">
          <header className="sticky top-4 z-30 rounded-[2rem] border border-white/10 bg-white/75 px-4 py-4 shadow-xl backdrop-blur-xl dark:bg-surface-800/80 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="mt-1 inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-lg font-bold text-white shadow-lg">
                    {guildIconUrl ? (
                      <img src={guildIconUrl} alt={selectedGuild?.guildName ?? 'Guild icon'} className="h-full w-full object-cover" />
                    ) : (
                      <span>{resolveGuildInitials(selectedGuild?.guildName ?? 'Dashboard')}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {sectionMeta?.label ?? 'Dashboard'}
                    </p>
                    <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
                      {selectedGuild?.guildName ?? 'Selecciona un servidor'}
                    </h1>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {sectionMeta?.description ?? 'Gestion centralizada para tu bot de Discord.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-surface-600 dark:bg-surface-700 dark:text-white dark:hover:bg-surface-600"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Claro' : 'Oscuro'}
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-surface-600 dark:bg-surface-700 dark:text-white dark:hover:bg-surface-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  Sitio web
                </Link>
                <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-surface-600 dark:bg-surface-700">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 dark:bg-surface-600">
                    {userAvatarUrl ? (
                      <img src={userAvatarUrl} alt={user.email ?? 'User avatar'} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">{(user.email ?? 'A').slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      {user.email ?? 'Administrador'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Solo acceso administrativo
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {syncError ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
                {syncError}
              </div>
            ) : null}
          </header>

          <div className="pb-6 pt-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
