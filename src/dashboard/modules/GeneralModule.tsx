import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Settings2 } from 'lucide-react';
import {
  ConfigFormActions,
  FieldShell,
  FormSection,
  ValidationSummary,
} from '../components/ConfigForm';
import PanelCard from '../components/PanelCard';
import SectionMutationBanner from '../components/SectionMutationBanner';
import StateCard from '../components/StateCard';
import {
  dashboardPreferencesSchema,
  generalSettingsSchema,
} from '../schemas';
import { flattenFormErrors } from '../validation';
import type {
  DashboardGuild,
  DashboardPreferences,
  GeneralSettings,
  GuildConfig,
  GuildConfigMutation,
  GuildSyncStatus,
} from '../types';

const generalModuleSchema = z.object({
  generalSettings: generalSettingsSchema,
  dashboardPreferences: dashboardPreferencesSchema,
});

type GeneralModuleValues = z.infer<typeof generalModuleSchema>;

interface GeneralModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: {
    generalSettings: GeneralSettings;
    dashboardPreferences: DashboardPreferences;
  }) => Promise<void>;
}

export default function GeneralModule({
  guild,
  config,
  mutation,
  syncStatus,
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
      generalSettings: config.generalSettings,
      dashboardPreferences: config.dashboardPreferences,
    },
  });

  useEffect(() => {
    reset({
      generalSettings: config.generalSettings,
      dashboardPreferences: config.dashboardPreferences,
    });
  }, [config.dashboardPreferences, config.generalSettings, reset]);

  const commandMode = watch('generalSettings.commandMode');
  const validationErrors = flattenFormErrors(errors);

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Instalacion requerida"
        title="Invita el bot antes de editar configuraciones"
        description="Cuando el bot este instalado en este servidor podremos mantener idioma, invocacion y preferencias persistentes del panel."
        icon={Settings2}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave(values);
      })}
      className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
    >
      <PanelCard
        eyebrow="General"
        title="Configuracion esencial del servidor"
        description="Define idioma, comandos y reglas base para que el panel y el bot se entiendan desde el primer minuto."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() =>
              reset({
                generalSettings: config.generalSettings,
                dashboardPreferences: config.dashboardPreferences,
              })
            }
            saveLabel="Guardar base operativa"
          />
        )}
        variant="highlight"
        stickyActions
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6">
          <ValidationSummary errors={validationErrors} />
        </div>

        <div className="mt-8 space-y-8">
          <FormSection
            title="Idioma y operacion"
            description="Estos ajustes definen el tono base del bot, la zona horaria que usaran los reportes y como invocan comandos los miembros."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell
                label="Idioma base"
                hint="Este idioma se usa en mensajes, paneles y respuestas principales del bot."
              >
            <select
              {...register('generalSettings.language')}
              className="dashboard-form-field"
            >
              <option value="es">Espanol</option>
              <option value="en">English</option>
            </select>
              </FieldShell>

              <FieldShell
                label="Zona horaria"
                hint="Afecta horarios visibles, reportes y automatizaciones programadas."
                error={errors.generalSettings?.timezone?.message}
              >
            <input
              {...register('generalSettings.timezone')}
              placeholder="America/Bogota"
              className="dashboard-form-field"
            />
              </FieldShell>

              <FieldShell
                label="Modo de comandos"
                hint="Elige si el usuario invoca al bot por mencion o con un prefijo corto."
              >
            <select
              {...register('generalSettings.commandMode')}
              className="dashboard-form-field"
            >
              <option value="mention">Mencion del bot</option>
              <option value="prefix">Prefijo</option>
            </select>
              </FieldShell>

              <FieldShell
                label="Prefijo"
                hint="Solo se usa si activas el modo por prefijo."
                error={errors.generalSettings?.prefix?.message}
              >
            <input
              {...register('generalSettings.prefix')}
              disabled={commandMode !== 'prefix'}
              placeholder="!"
              className="dashboard-form-field"
            />
              </FieldShell>
            </div>
          </FormSection>

          <FormSection
            title="Preset general de moderacion"
            description="Sirve como intencion operativa para el backend y deja claro que nivel de intervencion espera el staff."
          >
            <div className="grid gap-3 md:grid-cols-3">
            {[
              ['relaxed', 'Relajado', 'Mas flexible y menos intervencion automatica.'],
              ['balanced', 'Balanceado', 'Equilibrio entre proteccion y comodidad.'],
              ['strict', 'Estricto', 'Mas disciplina y menos tolerancia al ruido.'],
            ].map(([value, title, description]) => (
              <label
                key={value}
                className="dashboard-toggle-card has-[:checked]:border-brand-300 has-[:checked]:bg-brand-50/90 dark:has-[:checked]:border-brand-800 dark:has-[:checked]:bg-brand-900/20"
              >
                <input
                  type="radio"
                  value={value}
                  {...register('generalSettings.moderationPreset')}
                  className="sr-only"
                />
                <span className="block text-lg font-semibold text-slate-950 dark:text-white">
                  {title}
                </span>
                <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">
                  {description}
                </span>
              </label>
            ))}
            </div>
          </FormSection>
        </div>
      </PanelCard>

      <PanelCard
        eyebrow="Panel"
        title="Preferencias del equipo"
        description="Ajustes de presentacion para que el equipo vuelva directo a la tarea que mas usa."
        variant="soft"
      >
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Pantalla inicial
            </span>
            <select
              {...register('dashboardPreferences.defaultSection')}
              className="dashboard-form-field"
            >
              <option value="overview">Inicio</option>
              <option value="inbox">Bandeja de soporte</option>
              <option value="general">Configuracion inicial</option>
              <option value="server_roles">Roles y canales</option>
              <option value="tickets">Tickets</option>
              <option value="verification">Verificacion de acceso</option>
              <option value="welcome">Bienvenida</option>
              <option value="suggestions">Sugerencias de la comunidad</option>
              <option value="modlogs">Registro de moderacion</option>
              <option value="commands">Comandos</option>
              <option value="system">Sistema del bot</option>
              <option value="activity">Actividad reciente</option>
              <option value="analytics">Analitica</option>
            </select>
          </label>

          <label className="dashboard-toggle-card flex items-start gap-3">
            <input
              type="checkbox"
              {...register('dashboardPreferences.compactMode')}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">
                Modo compacto
              </span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                Reduce densidad visual para sesiones largas de moderacion.
              </span>
            </span>
          </label>

          <label className="dashboard-toggle-card flex items-start gap-3">
            <input
              type="checkbox"
              {...register('dashboardPreferences.showAdvancedCards')}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block font-semibold text-slate-950 dark:text-white">
                Tarjetas avanzadas
              </span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                Muestra contexto extra, recomendaciones y salud operativa ampliada.
              </span>
            </span>
          </label>

          <div className="rounded-[1.5rem] border border-brand-200/70 bg-brand-50/75 p-4 text-sm text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/20 dark:text-brand-200">
            Los cambios se envian a una cola auditada. El bot los aplica y confirma despues en la vista Resumen.
          </div>
        </div>
      </PanelCard>
    </form>
  );
}
