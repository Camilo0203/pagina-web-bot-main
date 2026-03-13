import { ExternalLink, LayoutTemplate, ShieldCheck, Sparkles } from 'lucide-react';
import { getDiscordInviteUrl } from '../../config';
import type {
  DashboardGuild,
  DashboardSectionId,
  GuildConfig,
  GuildEvent,
  GuildMetricsDaily,
} from '../types';
import {
  formatDateTime,
  formatRelativeTime,
  getMetricsSummary,
} from '../utils';

interface OverviewModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  events: GuildEvent[];
  metrics: GuildMetricsDaily[];
  onSectionChange: (section: DashboardSectionId) => void;
}

export default function OverviewModule({
  guild,
  config,
  events,
  metrics,
  onSectionChange,
}: OverviewModuleProps) {
  const summary = getMetricsSummary(metrics);
  const activeModules = [
    config.moderationSettings.antiSpamEnabled,
    config.moderationSettings.linkFilterEnabled,
    config.moderationSettings.capsFilterEnabled,
    config.moderationSettings.duplicateFilterEnabled,
    config.moderationSettings.raidProtectionEnabled,
  ].filter(Boolean).length;
  const inviteUrl = getDiscordInviteUrl(guild.guildId);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
              <Sparkles className="h-3.5 w-3.5" />
              Panel v1
            </div>
            <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
              {guild.guildName}
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Vista ejecutiva del servidor. Aqui ves el estado de instalacion, el ultimo guardado y la salud de los modulos clave.
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
            guild.botInstalled
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200'
          }`}>
            <div className={`h-2.5 w-2.5 rounded-full ${guild.botInstalled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {guild.botInstalled ? 'Bot instalado' : 'Invitacion pendiente'}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Comandos 7 dias',
              value: summary.totals.commandsExecuted.toLocaleString(),
              note: metrics.length ? 'Acumulado reciente' : 'Sin datos aun',
            },
            {
              label: 'Acciones moderadas',
              value: summary.totals.moderatedMessages.toLocaleString(),
              note: metrics.length ? 'Ultimos 7 dias' : 'Sin datos aun',
            },
            {
              label: 'Miembros activos',
              value: (summary.latest?.activeMembers ?? guild.memberCount ?? 0).toLocaleString(),
              note: guild.memberCount ? 'Capacidad visible' : 'Esperando telemetria',
            },
            {
              label: 'Uptime medio',
              value: `${summary.averageUptime.toFixed(2)}%`,
              note: metrics.length ? 'Promedio semanal' : 'Sin medicion',
            },
          ].map((card) => (
            <article key={card.label} className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {card.note}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-surface-600 dark:bg-surface-700/70">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Configuracion actual
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Idioma</dt>
                <dd className="mt-2 text-lg font-semibold">{config.generalSettings.language.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Modo de comando</dt>
                <dd className="mt-2 text-lg font-semibold capitalize">{config.generalSettings.commandMode}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Zona horaria</dt>
                <dd className="mt-2 text-lg font-semibold">{config.generalSettings.timezone}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-slate-400">Modulos activos</dt>
                <dd className="mt-2 text-lg font-semibold">{activeModules} / 5</dd>
              </div>
            </dl>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Ultimo guardado {formatRelativeTime(config.updatedAt)}.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-white/10">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-200">
              <LayoutTemplate className="h-4 w-4" />
              Quick actions
            </div>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => onSectionChange('general')}
                className="rounded-2xl bg-white px-4 py-3 text-left font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Ajustes generales y preferencias del panel
              </button>
              <button
                type="button"
                onClick={() => onSectionChange('moderation')}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left font-semibold text-white transition hover:bg-white/15"
              >
                Afinar reglas de moderacion
              </button>
              <button
                type="button"
                onClick={() => onSectionChange('activity')}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-left font-semibold text-white transition hover:bg-white/15"
              >
                Revisar auditoria reciente
              </button>
              {!guild.botInstalled && inviteUrl ? (
                <a
                  href={inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-400/50 bg-brand-500/20 px-4 py-3 font-semibold text-white transition hover:bg-brand-500/30"
                >
                  <ExternalLink className="h-4 w-4" />
                  Invitar bot a este servidor
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-6">
        <article className="rounded-[2rem] border border-white/10 bg-white/85 p-6 shadow-xl dark:bg-surface-800/85">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">Actividad reciente</h3>
          <div className="mt-5 space-y-4">
            {events.length ? events.slice(0, 4).map((event) => (
              <div key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
                <p className="font-semibold text-slate-950 dark:text-white">{event.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-400">{formatDateTime(event.createdAt)}</p>
              </div>
            )) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm text-slate-500 dark:border-surface-600 dark:bg-surface-700/40 dark:text-slate-400">
                Aun no hay eventos registrados para este servidor.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/85 p-6 shadow-xl dark:bg-surface-800/85">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">Salud operativa</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Ultima sincronizacion</p>
              <p className="mt-2 text-lg font-semibold">{formatDateTime(guild.lastSyncedAt)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Heartbeat del bot</p>
              <p className="mt-2 text-lg font-semibold">{formatDateTime(guild.botLastSeenAt)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Nivel premium</p>
              <p className="mt-2 text-lg font-semibold capitalize">{guild.premiumTier ?? 'free'}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
