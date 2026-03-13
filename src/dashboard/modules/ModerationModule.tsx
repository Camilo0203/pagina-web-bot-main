import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Save, ShieldAlert } from 'lucide-react';
import { moderationSettingsSchema, type ModerationModuleValues } from '../schemas';
import type { DashboardGuild, GuildConfig } from '../types';
import StateCard from '../components/StateCard';

interface ModerationModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  isSaving: boolean;
  onSave: (values: Pick<GuildConfig, 'moderationSettings'>) => Promise<void>;
}

export default function ModerationModule({
  guild,
  config,
  isSaving,
  onSave,
}: ModerationModuleProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<ModerationModuleValues>({
    resolver: zodResolver(moderationSettingsSchema),
    defaultValues: config.moderationSettings,
  });

  useEffect(() => {
    reset(config.moderationSettings);
  }, [config.moderationSettings, reset]);

  const antiSpamEnabled = watch('antiSpamEnabled');
  const capsFilterEnabled = watch('capsFilterEnabled');
  const duplicateFilterEnabled = watch('duplicateFilterEnabled');
  const raidProtectionEnabled = watch('raidProtectionEnabled');

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Bot pendiente"
        title="La moderacion avanzada se habilita tras la instalacion"
        description="Invita el bot a este servidor para activar guardado de reglas anti-spam, caps, duplicados y anti-raid."
        icon={ShieldAlert}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave({ moderationSettings: values });
      })}
      className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
    >
      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
              Moderacion
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
              Reglas base de proteccion
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Ajusta limites y toggles para mantener el servidor limpio sin necesidad de acciones manuales en vivo.
            </p>
          </div>
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Guardando...' : isDirty ? 'Guardar reglas' : 'Sin cambios'}
          </button>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('antiSpamEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Anti-spam</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Limita rafagas de mensajes repetitivos o excesivos.</span>
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Umbral de mensajes</span>
            <input type="number" min={2} max={20} disabled={!antiSpamEnabled} {...register('antiSpamThreshold', { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700" />
          </label>

          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('linkFilterEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Filtro de links</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Bloquea enlaces no deseados o promocionales.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('capsFilterEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Filtro de mayusculas</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Modera mensajes con exceso de caps para reducir ruido.</span>
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Limite de caps (%)</span>
            <input type="number" min={20} max={100} disabled={!capsFilterEnabled} {...register('capsPercentageLimit', { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700" />
          </label>

          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('duplicateFilterEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Filtro de duplicados</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Detecta mensajes repetidos en una ventana corta de tiempo.</span>
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Ventana de duplicados (segundos)</span>
            <input type="number" min={10} max={300} disabled={!duplicateFilterEnabled} {...register('duplicateWindowSeconds', { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700" />
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
          Anti-raid
        </p>
        <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
          Endurecimiento del servidor
        </h3>
        <div className="mt-6 space-y-5">
          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('raidProtectionEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Proteccion anti-raid</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Activa presets pensados para llegadas masivas y comportamiento anomalo.</span>
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Preset anti-raid</span>
            <select {...register('raidPreset')} disabled={!raidProtectionEnabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="off">Off</option>
              <option value="balanced">Balanced</option>
              <option value="lockdown">Lockdown</option>
            </select>
          </label>

          <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/20 dark:text-brand-200">
            Este modulo guarda solo configuracion persistente. Las acciones en vivo quedan reservadas para una fase posterior con API del bot.
          </div>
        </div>
      </section>
    </form>
  );
}
