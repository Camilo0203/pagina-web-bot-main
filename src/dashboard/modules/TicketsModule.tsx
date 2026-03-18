import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Ticket } from 'lucide-react';
import {
  ConfigFormActions,
  FieldShell,
  FormSection,
  InventoryNotice,
  ToggleCard,
  ValidationSummary,
} from '../components/ConfigForm';
import PanelCard from '../components/PanelCard';
import SectionMutationBanner from '../components/SectionMutationBanner';
import StateCard from '../components/StateCard';
import { ticketsSettingsSchema } from '../schemas';
import type {
  DashboardGuild,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  TicketsSettings,
} from '../types';
import { getCategoryOptions, getChannelOptions, getRoleOptions } from '../utils';
import { findMissingSelections, flattenFormErrors, getInventoryState } from '../validation';

type TicketsModuleValues = z.infer<typeof ticketsSettingsSchema>;

interface TicketsModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  inventory: GuildInventory;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: TicketsSettings) => Promise<void>;
}

const priorityLabels = [
  ['low', 'Baja'],
  ['normal', 'Normal'],
  ['high', 'Alta'],
  ['urgent', 'Urgente'],
] as const;

export default function TicketsModule({
  guild,
  config,
  inventory,
  mutation,
  syncStatus,
  isSaving,
  onSave,
}: TicketsModuleProps) {
  const channelOptions = getChannelOptions(inventory, ['text', 'announcement', 'forum']);
  const roleOptions = getRoleOptions(inventory);
  const categoryOptions = getCategoryOptions(inventory);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<TicketsModuleValues>({
    resolver: zodResolver(ticketsSettingsSchema) as never,
    defaultValues: config.ticketsSettings,
  });

  useEffect(() => {
    reset(config.ticketsSettings);
  }, [config.ticketsSettings, reset]);

  const slaEscalationEnabled = watch('slaEscalationEnabled');
  const dailySlaReportEnabled = watch('dailySlaReportEnabled');
  const incidentPausedCategories = watch('incidentPausedCategories');
  const slaOverridesPriority = watch('slaOverridesPriority');
  const validationErrors = flattenFormErrors(errors);
  const inventoryState = getInventoryState(inventory);
  const missingSelections = [
    ...findMissingSelections(
      [
        { label: 'Rol escalado', value: config.ticketsSettings.slaEscalationRoleId },
      ],
      roleOptions,
    ),
    ...findMissingSelections(
      [
        { label: 'Canal escalado', value: config.ticketsSettings.slaEscalationChannelId },
        { label: 'Canal reporte diario', value: config.ticketsSettings.dailySlaReportChannelId },
      ],
      channelOptions,
    ),
  ];
  const missingIncidentCategories = config.ticketsSettings.incidentPausedCategories
    .filter((categoryId) => !categoryOptions.some((category) => category.value === categoryId))
    .map((categoryId) => `La categoria pausada ${categoryId} ya no existe en el inventario.`);

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="Instala el bot para activar configuracion de tickets"
        description="En cuanto el bot este dentro podremos aplicar limites, SLA, autoasignacion y modo incidente al flujo real de tickets."
        icon={Ticket}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave(values);
      })}
      className="space-y-6"
    >
      <PanelCard
        eyebrow="Tickets y SLA"
        title="Operacion del sistema de tickets"
        description="Aqui decides cuanta carga soporta el sistema, cuanto tarda en pedir ayuda y cuando debe escalar o reportar automaticamente."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() => reset(config.ticketsSettings)}
            saveLabel="Guardar operacion de tickets"
          />
        )}
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6 space-y-4">
          <ValidationSummary errors={[...validationErrors, ...missingSelections, ...missingIncidentCategories]} />
          {!inventoryState.hasInventory ? (
            <InventoryNotice
              title="Inventario operativo incompleto"
              message="Faltan canales, roles o categorias sincronizadas. Puedes revisar la configuracion, pero conviene re-sincronizar antes de cerrar escalados o incidentes."
            />
          ) : null}
        </div>

        <div className="mt-8 space-y-8">
          <FormSection
            title="Capacidad y tiempos"
            description="Estos valores marcan cuanto trabajo soporta la cola, cuanto debe esperar el usuario y cuando el sistema considera que un ticket necesita ayuda."
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['maxTickets', 'Max tickets por usuario', 1, 10],
                ['globalTicketLimit', 'Limite global', 0, 500],
                ['cooldownMinutes', 'Cooldown (min)', 0, 1440],
                ['minDays', 'Minimo dias en servidor', 0, 365],
                ['autoCloseMinutes', 'Auto close (min)', 0, 10080],
                ['slaMinutes', 'SLA alerta (min)', 0, 1440],
                ['smartPingMinutes', 'Smart ping (min)', 0, 1440],
                ['slaEscalationMinutes', 'Escalado SLA (min)', 0, 10080],
              ].map(([field, label, min, max]) => (
                <FieldShell key={String(field)} label={String(label)} error={errors[field as keyof typeof errors]?.message as string | undefined}>
                  <input
                    type="number"
                    min={Number(min)}
                    max={Number(max)}
                    {...register(field as keyof TicketsSettings, { valueAsNumber: true })}
                    className="dashboard-form-field"
                  />
                </FieldShell>
              ))}
            </div>
          </FormSection>

          <FormSection
            title="Automatizaciones y experiencia"
            description="Auto-assign, incident mode, reportes y mensajes directos se gestionan por separado para que el admin entienda que esta activando."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['autoAssignEnabled', 'Autoasignacion', 'Asigna tickets nuevos automaticamente.'],
                ['autoAssignRequireOnline', 'Solo online', 'Evita asignar staff desconectado.'],
                ['autoAssignRespectAway', 'Respeta ausentes', 'No asigna a miembros marcados como away.'],
                ['dailySlaReportEnabled', 'Reporte diario SLA', 'Envia un resumen diario de tickets incumplidos o en riesgo.'],
                ['incidentModeEnabled', 'Modo incidente', 'Pausa categorias concretas y muestra un mensaje especial.'],
                ['dmOnOpen', 'DM al abrir', 'Confirma al usuario que el ticket fue creado.'],
                ['dmOnClose', 'DM al cerrar', 'Avisa cuando el ticket se cierra.'],
                ['dmTranscripts', 'Enviar transcripts', 'Comparte transcripciones por DM cuando aplique.'],
                ['dmAlerts', 'DM alertas', 'Permite mensajes directos relacionados con SLA o eventos.'],
                ['slaEscalationEnabled', 'Escalado automatico', 'Escala tickets vencidos a un rol o canal adicional.'],
              ].map(([field, label, description]) => (
                <ToggleCard key={field} title={label} description={description}>
                  <input
                    type="checkbox"
                    {...register(field as keyof TicketsSettings)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </ToggleCard>
              ))}
            </div>
          </FormSection>
        </div>
      </PanelCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard title="Escalado y reportes" description="Roles y canales usados cuando un ticket necesita visibilidad extra o seguimiento diario.">
          <div className="grid gap-5 md:grid-cols-2">
            <FieldShell label="Rol escalado" error={errors.slaEscalationRoleId?.message}>
              <select
                {...register('slaEscalationRoleId')}
                disabled={!slaEscalationEnabled}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700"
              >
                <option value="">No configurado</option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="Canal escalado">
              <select
                {...register('slaEscalationChannelId')}
                disabled={!slaEscalationEnabled}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700"
              >
                <option value="">No configurado</option>
                {channelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="Canal reporte diario" error={errors.dailySlaReportChannelId?.message}>
              <select
                {...register('dailySlaReportChannelId')}
                disabled={!dailySlaReportEnabled}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700"
              >
                <option value="">Usar fallback del bot</option>
                {channelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="Mensaje modo incidente" error={errors.incidentMessage?.message}>
              <textarea
                {...register('incidentMessage')}
                rows={3}
                className="dashboard-form-field"
              />
            </FieldShell>
          </div>
        </PanelCard>

        <PanelCard title="Reglas avanzadas" description="Ajustes finos para cambiar SLA o escalado segun prioridad y categoria sin tocar la base general.">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Overrides SLA por prioridad</p>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {priorityLabels.map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="mb-2 block text-sm text-slate-600 dark:text-slate-300">{label}</span>
                    <input
                      type="number"
                      min={0}
                      max={10080}
                      value={slaOverridesPriority[key] ?? 0}
                      onChange={(event) => {
                        const next = { ...watch('slaOverridesPriority') };
                        const value = Number(event.target.value) || 0;
                        if (value > 0) next[key] = value;
                        else delete next[key];
                        setValue('slaOverridesPriority', next, { shouldDirty: true });
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Categorias pausadas en incidente</p>
              <div className="mt-3 grid gap-3">
                {categoryOptions.length ? (
                  categoryOptions.map((category) => {
                    const checked = incidentPausedCategories.includes(category.value);
                    return (
                      <label
                        key={category.value}
                        className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 dark:border-surface-600 dark:bg-surface-700/70"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            const next = new Set(watch('incidentPausedCategories'));
                            if (event.target.checked) next.add(category.value);
                            else next.delete(category.value);
                            setValue('incidentPausedCategories', Array.from(next), { shouldDirty: true });
                          }}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span>
                          <span className="block font-semibold text-slate-950 dark:text-white">{category.label}</span>
                          {category.description ? (
                            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                              {category.description}
                            </span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-5 text-sm text-slate-500 dark:border-surface-600 dark:bg-surface-700/40 dark:text-slate-400">
                    El inventario todavia no ha publicado categorias de tickets configurables.
                  </div>
                )}
              </div>
            </div>
          </div>
        </PanelCard>
      </div>
    </form>
  );
}
