import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Layers3 } from 'lucide-react';
import {
  ConfigFormActions,
  FieldShell,
  FormSection,
  InventoryNotice,
  ValidationSummary,
} from '../components/ConfigForm';
import PanelCard from '../components/PanelCard';
import SectionMutationBanner from '../components/SectionMutationBanner';
import StateCard from '../components/StateCard';
import { serverRolesChannelsSettingsSchema } from '../schemas';
import type {
  DashboardGuild,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  ServerRolesChannelsSettings,
} from '../types';
import { getChannelOptions, getRoleOptions } from '../utils';
import { findMissingSelections, flattenFormErrors, getInventoryState } from '../validation';

type ServerRolesModuleValues = z.infer<typeof serverRolesChannelsSettingsSchema>;

interface ServerRolesModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  inventory: GuildInventory;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: ServerRolesChannelsSettings) => Promise<void>;
}

function SelectField({
  label,
  hint,
  error,
  registerName,
  options,
  register,
}: {
  label: string;
  hint?: string;
  error?: string;
  registerName: keyof ServerRolesChannelsSettings;
  options: Array<{ value: string; label: string }>;
  register: ReturnType<typeof useForm<ServerRolesModuleValues>>['register'];
}) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <select
        {...register(registerName)}
        className="dashboard-form-field"
      >
        <option value="">No configurado</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export default function ServerRolesModule({
  guild,
  config,
  inventory,
  mutation,
  syncStatus,
  isSaving,
  onSave,
}: ServerRolesModuleProps) {
  const roleOptions = getRoleOptions(inventory);
  const channelOptions = getChannelOptions(inventory, ['text', 'announcement', 'forum']);
  const voiceChannelOptions = getChannelOptions(inventory, ['voice']);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ServerRolesModuleValues>({
    resolver: zodResolver(serverRolesChannelsSettingsSchema) as never,
    defaultValues: config.serverRolesChannelsSettings,
  });

  useEffect(() => {
    reset(config.serverRolesChannelsSettings);
  }, [config.serverRolesChannelsSettings, reset]);
  const validationErrors = flattenFormErrors(errors);
  const inventoryState = getInventoryState(inventory);
  const missingSelections = [
    ...findMissingSelections(
      [
        { label: 'Canal principal del panel', value: config.serverRolesChannelsSettings.dashboardChannelId },
        { label: 'Canal del panel de tickets', value: config.serverRolesChannelsSettings.ticketPanelChannelId },
        { label: 'Canal de registros', value: config.serverRolesChannelsSettings.logsChannelId },
        { label: 'Canal de transcripciones', value: config.serverRolesChannelsSettings.transcriptChannelId },
        { label: 'Canal de reporte semanal', value: config.serverRolesChannelsSettings.weeklyReportChannelId },
        { label: 'Canal contador de miembros', value: config.serverRolesChannelsSettings.liveMembersChannelId },
        { label: 'Canal contador por rol', value: config.serverRolesChannelsSettings.liveRoleChannelId },
      ],
      [...channelOptions, ...voiceChannelOptions],
    ),
    ...findMissingSelections(
      [
        { label: 'Rol del contador', value: config.serverRolesChannelsSettings.liveRoleId },
        { label: 'Rol del equipo de soporte', value: config.serverRolesChannelsSettings.supportRoleId },
        { label: 'Rol administrador', value: config.serverRolesChannelsSettings.adminRoleId },
        { label: 'Rol minimo para tickets', value: config.serverRolesChannelsSettings.verifyRoleId },
      ],
      roleOptions,
    ),
  ];

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="Instala el bot para publicar canales y roles en la dashboard"
        description="Este modulo usa inventario real del servidor. Cuando el bot este dentro, cargaremos canales, roles y paneles disponibles."
        icon={Layers3}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave(values);
      })}
      className="grid gap-6 xl:grid-cols-2"
    >
      <PanelCard
        eyebrow="Roles y canales"
        title="Base operativa del servidor"
        description="Estos canales y roles destraban tickets, logs y automatizaciones. Si esto queda bien, el resto del panel avanza mucho mas rapido."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() => reset(config.serverRolesChannelsSettings)}
            saveLabel="Guardar asignaciones"
          />
        )}
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6 space-y-4">
          <ValidationSummary errors={[...validationErrors, ...missingSelections]} />
          {!inventoryState.hasInventory ? (
            <InventoryNotice
              title="Inventario no disponible"
              message="Todavia no llegaron roles o canales desde el bot. Puedes revisar la configuracion actual, pero conviene re-sincronizar antes de guardar."
            />
          ) : null}
          {inventoryState.isStale ? (
            <InventoryNotice
              title="Inventario desactualizado"
              message="El snapshot del servidor no parece reciente. Si acabas de crear canales o roles, re-sincroniza antes de asignarlos aqui."
              tone="neutral"
            />
          ) : null}
        </div>

        <div className="mt-8 space-y-8">
          <FormSection
            title="Canales de operacion"
            description="Conecta los espacios donde el bot publicara paneles, guardara trazas y mantendra contadores visibles para el staff."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField label="Canal principal del panel" hint="Punto de entrada del dashboard operativo dentro de Discord." registerName="dashboardChannelId" options={channelOptions} register={register} />
              <SelectField label="Canal del panel de tickets" hint="Aqui se publica el punto de arranque del flujo de soporte." registerName="ticketPanelChannelId" options={channelOptions} register={register} />
              <SelectField label="Canal de registros generales" hint="Logs transversales del bot y del bridge." registerName="logsChannelId" options={channelOptions} register={register} />
              <SelectField label="Canal de transcripciones" hint="Donde se guardan cierres y transcripts de tickets." registerName="transcriptChannelId" options={channelOptions} register={register} />
              <SelectField label="Canal de reporte semanal" hint="Recepcion de resumenes operativos programados." registerName="weeklyReportChannelId" options={channelOptions} register={register} />
              <SelectField label="Canal contador de miembros" hint="Canal de voz usado como contador visible." registerName="liveMembersChannelId" options={voiceChannelOptions} register={register} />
              <SelectField label="Canal contador por rol" hint="Canal de voz usado para mostrar el total de un rol concreto." registerName="liveRoleChannelId" options={voiceChannelOptions} register={register} />
              <SelectField label="Rol mostrado en contador" hint="Rol que alimenta el contador por rol." registerName="liveRoleId" options={roleOptions} register={register} />
            </div>
          </FormSection>
        </div>
      </PanelCard>

      <PanelCard
        eyebrow="Accesos"
        title="Roles esenciales"
        description="El bot usa estos roles para dar acceso al staff, separar permisos y operar flujos sensibles sin confusion."
      >
        <FormSection
          title="Accesos del staff"
          description="Estas asignaciones resuelven permisos transversales para soporte, acciones sensibles y filtros por nivel de acceso."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField label="Rol del equipo de soporte" hint="Base para auto-asignacion, escalados y visibilidad operativa." registerName="supportRoleId" options={roleOptions} register={register} />
            <SelectField label="Rol administrador del bot" hint="Bypass y acciones delicadas del bot." registerName="adminRoleId" options={roleOptions} register={register} />
            <SelectField label="Rol minimo para crear tickets" hint="Usado como piso de acceso si el backend lo aplica." registerName="verifyRoleId" options={roleOptions} register={register} />
          </div>
        </FormSection>

        <div className="mt-8 rounded-3xl border border-brand-200 bg-brand-50/70 p-4 text-sm text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/20 dark:text-brand-200">
          Todos los selectores salen del inventario sincronizado por el bot. Si aqui falta un rol o canal, primero re-sincroniza el servidor y luego vuelve a esta pantalla.
        </div>
      </PanelCard>
    </form>
  );
}
