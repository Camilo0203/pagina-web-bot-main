import { Activity } from 'lucide-react';
import StateCard from '../components/StateCard';
import type { DashboardGuild, GuildConfig, GuildEvent } from '../types';
import { formatDateTime } from '../utils';

interface ActivityModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  events: GuildEvent[];
}

export default function ActivityModule({
  guild,
  config,
  events,
}: ActivityModuleProps) {
  if (!events.length) {
    return (
      <StateCard
        eyebrow="Sin actividad"
        title="Aun no hay eventos de auditoria"
        description={guild.botInstalled
          ? 'Cuando guardes configuraciones o sincronices accesos, aqui apareceran los eventos recientes del panel.'
          : 'Invita el bot a este servidor y luego realiza el primer guardado para empezar a construir la auditoria.'}
        icon={Activity}
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
          Ultimo guardado
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
          Historial del panel
        </h2>
        <div className="mt-8 grid gap-4">
          <article className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Configuracion guardada</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{formatDateTime(config.updatedAt)}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Eventos registrados</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{events.length.toLocaleString()}</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Servidor</p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{guild.guildName}</p>
          </article>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
              Auditoria
            </p>
            <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
              Eventos recientes
            </h3>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-surface-700 dark:text-slate-300">
            Solo lectura
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {events.map((event) => (
            <article key={event.id} className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5 dark:border-surface-600 dark:bg-surface-700/70">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-950 dark:text-white">{event.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{event.description}</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:bg-surface-800 dark:text-slate-300">
                  {event.eventType}
                </div>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-400">{formatDateTime(event.createdAt)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
