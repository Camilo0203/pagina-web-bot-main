import { BarChart3 } from 'lucide-react';
import type { DashboardGuild, GuildMetricsDaily } from '../types';
import { formatMetricDate, getMetricsSummary } from '../utils';
import StateCard from '../components/StateCard';

interface AnalyticsModuleProps {
  guild: DashboardGuild;
  metrics: GuildMetricsDaily[];
}

export default function AnalyticsModule({
  guild,
  metrics,
}: AnalyticsModuleProps) {
  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="La analitica se activara cuando el bot entre al servidor"
        description="Tu bot debe escribir en guild_metrics_daily para que este modulo muestre comandos, acciones de moderacion, actividad y uptime real."
        icon={BarChart3}
        tone="warning"
      />
    );
  }

  if (!metrics.length) {
    return (
      <StateCard
        eyebrow="Sin metricas"
        title="Todavia no hay telemetria por servidor"
        description="La dashboard ya esta lista. Solo falta que tu bot escriba snapshots diarios en guild_metrics_daily para llenar estas vistas."
        icon={BarChart3}
      />
    );
  }

  const summary = getMetricsSummary(metrics);
  const maxCommands = Math.max(...metrics.map((metric) => metric.commandsExecuted), 1);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
          Analytics
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          Tendencia de los ultimos {metrics.length} dias
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Comandos', summary.totals.commandsExecuted.toLocaleString()],
            ['Moderacion', summary.totals.moderatedMessages.toLocaleString()],
            ['Activos max', summary.totals.activeMembers.toLocaleString()],
            ['Uptime prom', `${summary.averageUptime.toFixed(2)}%`],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-6 dark:border-surface-600 dark:bg-surface-700/70">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Comandos ejecutados</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Serie diaria</p>
          </div>
          <div className="mt-8 grid h-64 grid-cols-7 items-end gap-3">
            {summary.series.map((metric) => (
              <div key={metric.metricDate} className="flex h-full flex-col justify-end">
                <div
                  className="rounded-t-3xl bg-gradient-to-t from-brand-600 via-brand-500 to-sky-400"
                  style={{ height: `${Math.max((metric.commandsExecuted / maxCommands) * 100, 8)}%` }}
                />
                <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  {formatMetricDate(metric.metricDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <h3 className="text-2xl font-bold text-slate-950 dark:text-white">Detalle por dia</h3>
        <div className="mt-6 space-y-4">
          {summary.series.map((metric) => (
            <article key={metric.metricDate} className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-950 dark:text-white">{formatMetricDate(metric.metricDate)}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Snapshot diario del guild</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-surface-800 dark:text-slate-300">
                  {metric.uptimePercentage.toFixed(2)}% uptime
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Comandos</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{metric.commandsExecuted.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Moderacion</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{metric.moderatedMessages.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Activos</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{metric.activeMembers.toLocaleString()}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
