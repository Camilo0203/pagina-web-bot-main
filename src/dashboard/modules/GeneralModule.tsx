import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Save, Settings2 } from 'lucide-react';
import { generalModuleSchema, type GeneralModuleValues } from '../schemas';
import type { DashboardGuild, GuildConfig } from '../types';
import StateCard from '../components/StateCard';

interface GeneralModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  isSaving: boolean;
  onSave: (values: Pick<GuildConfig, 'generalSettings' | 'dashboardPreferences'>) => Promise<void>;
}

export default function GeneralModule({
  guild,
  config,
  isSaving,
  onSave,
}: GeneralModuleProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<GeneralModuleValues>({
    resolver: zodResolver(generalModuleSchema),
    defaultValues: {
      ...config.generalSettings,
      ...config.dashboardPreferences,
    },
  });

  useEffect(() => {
    reset({
      ...config.generalSettings,
      ...config.dashboardPreferences,
    });
  }, [config.dashboardPreferences, config.generalSettings, reset]);

  const commandMode = watch('commandMode');

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Instalacion requerida"
        title="Invita el bot antes de editar configuraciones"
        description="Cuando el bot este instalado en este servidor podremos guardar idioma, zona horaria y preferencias persistentes del panel."
        icon={Settings2}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave({
          generalSettings: {
            language: values.language,
            commandMode: values.commandMode,
            prefix: values.prefix,
            timezone: values.timezone,
            moderationPreset: values.moderationPreset,
          },
          dashboardPreferences: {
            defaultSection: values.defaultSection,
            compactMode: values.compactMode,
            showAdvancedCards: values.showAdvancedCards,
          },
        });
      })}
      className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
    >
      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
              General
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">
              Identidad operativa del servidor
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
              Define idioma, forma de invocacion del bot y la experiencia principal del panel.
            </p>
          </div>
          <button
            type="submit"
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Guardando...' : isDirty ? 'Guardar cambios' : 'Sin cambios'}
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Idioma base</span>
            <select {...register('language')} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Zona horaria</span>
            <input
              {...register('timezone')}
              placeholder="America/Bogota"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700"
            />
            {errors.timezone ? (
              <span className="mt-2 block text-sm text-rose-500">{errors.timezone.message}</span>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Modo de comandos</span>
            <select {...register('commandMode')} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700">
              <option value="mention">Mencion del bot</option>
              <option value="prefix">Prefijo</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Prefijo</span>
            <input
              {...register('prefix')}
              disabled={commandMode !== 'prefix'}
              placeholder="!"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700"
            />
            {errors.prefix ? (
              <span className="mt-2 block text-sm text-rose-500">{errors.prefix.message}</span>
            ) : null}
          </label>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Preset general de moderacion</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {[
              ['relaxed', 'Relajado', 'Permite mas flexibilidad y menos intervencion automatica.'],
              ['balanced', 'Balanceado', 'Equilibrio entre proteccion y comodidad para la comunidad.'],
              ['strict', 'Estricto', 'Reduce ruido y endurece los limites desde el inicio.'],
            ].map(([value, title, description]) => (
              <label
                key={value}
                className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4 transition hover:border-brand-300 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50 dark:border-surface-600 dark:bg-surface-700/70 dark:hover:border-brand-700 dark:has-[:checked]:bg-brand-900/20"
              >
                <input type="radio" value={value} {...register('moderationPreset')} className="sr-only" />
                <span className="block text-lg font-semibold text-slate-950 dark:text-white">{title}</span>
                <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{description}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/85 p-8 shadow-xl dark:bg-surface-800/85">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">
          Preferencias del panel
        </p>
        <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
          Experiencia de trabajo
        </h3>
        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Modulo inicial</span>
            <select {...register('defaultSection')} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700">
              <option value="overview">Overview</option>
              <option value="general">General</option>
              <option value="moderation">Moderacion</option>
              <option value="activity">Activity</option>
              <option value="analytics">Analytics</option>
            </select>
          </label>

          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('compactMode')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Modo compacto</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Reduce densidad visual para moderadores que trabajan muchas horas en el panel.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70">
            <input type="checkbox" {...register('showAdvancedCards')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">Tarjetas avanzadas</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Muestra tarjetas extra de contexto y recomendaciones dentro del overview.</span>
            </span>
          </label>

          <div className="rounded-3xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/20 dark:text-brand-200">
            Los cambios se guardan como configuracion persistente por servidor y generan un evento de auditoria.
          </div>
        </div>
      </section>
    </form>
  );
}
