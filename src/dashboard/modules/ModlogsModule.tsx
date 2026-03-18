import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import {
  ConfigFormActions,
  FieldShell,
  InventoryNotice,
  ToggleCard,
  ValidationSummary,
} from '../components/ConfigForm';
import PanelCard from '../components/PanelCard';
import SectionMutationBanner from '../components/SectionMutationBanner';
import StateCard from '../components/StateCard';
import { modlogSettingsSchema } from '../schemas';
import type {
  DashboardGuild,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  ModlogSettings,
} from '../types';
import { getChannelOptions } from '../utils';
import { findMissingSelections, flattenFormErrors, getInventoryState } from '../validation';

type ModlogsModuleValues = z.infer<typeof modlogSettingsSchema>;

interface ModlogsModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  inventory: GuildInventory;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: ModlogSettings) => Promise<void>;
}

export default function ModlogsModule({
  guild,
  config,
  inventory,
  mutation,
  syncStatus,
  isSaving,
  onSave,
}: ModlogsModuleProps) {
  const channelOptions = getChannelOptions(inventory, ['text', 'announcement', 'forum']);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ModlogsModuleValues>({
    resolver: zodResolver(modlogSettingsSchema) as never,
    defaultValues: config.modlogSettings,
  });

  useEffect(() => {
    reset(config.modlogSettings);
  }, [config.modlogSettings, reset]);

  const enabled = watch('enabled');
  const validationErrors = flattenFormErrors(errors);
  const inventoryState = getInventoryState(inventory);
  const missingSelections = findMissingSelections(
    [{ label: 'Canal de modlogs', value: config.modlogSettings.channelId }],
    channelOptions,
  );

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="Instala el bot para configurar modlogs"
        description="Los eventos de moderacion dependen de que el bot pueda escuchar acciones reales dentro del servidor."
        icon={ShieldCheck}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave(values);
      })}
      className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
    >
      <PanelCard
        eyebrow="Modlogs"
        title="Canal de auditoria"
        description="Deja una bitacora clara de moderacion para que el equipo pueda revisar que paso y cuando paso."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() => reset(config.modlogSettings)}
            saveLabel="Guardar modlogs"
          />
        )}
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6 space-y-4">
          <ValidationSummary errors={[...validationErrors, ...missingSelections]} />
          {!inventoryState.hasInventory ? (
            <InventoryNotice
              title="Inventario vacio"
              message="No llegaron canales del servidor, asi que no podemos validar el destino real de los modlogs."
            />
          ) : null}
        </div>

        <div className="mt-8 space-y-5">
          <ToggleCard
            title="Modlogs activos"
            description="El bot escribira eventos de moderacion y cambios de miembros."
          >
            <input type="checkbox" {...register('enabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          </ToggleCard>

          <FieldShell
            label="Canal"
            hint="Canal central donde quedara la auditoria."
            error={errors.channelId?.message}
          >
            <select {...register('channelId')} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="">No configurado</option>
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </FieldShell>
        </div>
      </PanelCard>

      <PanelCard title="Eventos registrados" description="Elige exactamente que acciones del servidor deben quedar guardadas en la bitacora.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['logBans', 'Baneos'],
            ['logUnbans', 'Desbaneos'],
            ['logKicks', 'Expulsiones'],
            ['logMessageDelete', 'Mensajes eliminados'],
            ['logMessageEdit', 'Mensajes editados'],
            ['logRoleAdd', 'Roles agregados'],
            ['logRoleRemove', 'Roles retirados'],
            ['logNickname', 'Cambios de nickname'],
            ['logJoins', 'Entradas'],
            ['logLeaves', 'Salidas'],
            ['logVoice', 'Eventos de voz'],
          ].map(([field, label]) => (
            <ToggleCard key={field} title={label}>
              <input type="checkbox" {...register(field as keyof ModlogSettings)} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
          ))}
        </div>
      </PanelCard>
    </form>
  );
}
