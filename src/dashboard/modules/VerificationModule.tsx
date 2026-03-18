import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Shield } from 'lucide-react';
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
import { verificationSettingsSchema } from '../schemas';
import type {
  DashboardGuild,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  VerificationSettings,
} from '../types';
import { getChannelOptions, getRoleOptions } from '../utils';
import { findMissingSelections, flattenFormErrors, getInventoryState } from '../validation';

type VerificationModuleValues = z.infer<typeof verificationSettingsSchema>;

interface VerificationModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  inventory: GuildInventory;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: VerificationSettings) => Promise<void>;
}

export default function VerificationModule({
  guild,
  config,
  inventory,
  mutation,
  syncStatus,
  isSaving,
  onSave,
}: VerificationModuleProps) {
  const channelOptions = getChannelOptions(inventory, ['text', 'announcement', 'forum']);
  const roleOptions = getRoleOptions(inventory);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<VerificationModuleValues>({
    resolver: zodResolver(verificationSettingsSchema) as never,
    defaultValues: config.verificationSettings,
  });

  useEffect(() => {
    reset(config.verificationSettings);
  }, [config.verificationSettings, reset]);

  const enabled = watch('enabled');
  const mode = watch('mode');
  const validationErrors = flattenFormErrors(errors);
  const inventoryState = getInventoryState(inventory);
  const missingSelections = [
    ...findMissingSelections(
      [
        { label: 'Canal del panel', value: config.verificationSettings.channelId },
        { label: 'Canal de logs', value: config.verificationSettings.logChannelId },
      ],
      channelOptions,
    ),
    ...findMissingSelections(
      [
        { label: 'Rol verificado', value: config.verificationSettings.verifiedRoleId },
        { label: 'Rol no verificado', value: config.verificationSettings.unverifiedRoleId },
      ],
      roleOptions,
    ),
  ];

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="Instala el bot para administrar la verificacion"
        description="El panel de verificacion depende del inventario y de los handlers activos del bot dentro del servidor."
        icon={Shield}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave(values);
      })}
      className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"
    >
      <PanelCard
        eyebrow="Verificacion"
        title="Flujo de acceso al servidor"
        description="Configura como entra la gente al servidor, que rol recibe al completar el proceso y que pasa si llega una oleada sospechosa."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() => reset(config.verificationSettings)}
            saveLabel="Guardar acceso"
          />
        )}
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6 space-y-4">
          <ValidationSummary errors={[...validationErrors, ...missingSelections]} />
          {!inventoryState.hasInventory ? (
            <InventoryNotice
              title="Inventario incompleto"
              message="No llegaron roles o canales suficientes para validar el flujo completo de verificacion."
            />
          ) : null}
        </div>

        <div className="mt-8 space-y-8">
          <FormSection
            title="Flujo principal"
            description="Primero define donde vive el panel y que roles participan. Luego decide el modo exacto de verificacion."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ToggleCard title="Sistema activo" description="Activa el panel y las reglas de acceso verificable.">
            <input type="checkbox" {...register('enabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              </ToggleCard>

              <FieldShell label="Canal del panel" error={errors.channelId?.message}>
            <select {...register('channelId')} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="">No configurado</option>
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
              </FieldShell>

              <FieldShell label="Canal de logs">
            <select {...register('logChannelId')} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="">No configurado</option>
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
              </FieldShell>

              <FieldShell label="Rol verificado" error={errors.verifiedRoleId?.message}>
            <select {...register('verifiedRoleId')} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="">No configurado</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
              </FieldShell>

              <FieldShell label="Rol no verificado">
            <select {...register('unverifiedRoleId')} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="">No configurado</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
              </FieldShell>

              <FieldShell label="Modo">
            <select {...register('mode')} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="button">Boton</option>
              <option value="code">Codigo</option>
              <option value="question">Pregunta</option>
            </select>
              </FieldShell>

              <FieldShell label="Autokick (horas)" hint="0 desactiva el retiro automatico.">
                <input type="number" min={0} max={168} {...register('kickUnverifiedHours', { valueAsNumber: true })} className="dashboard-form-field" />
              </FieldShell>
            </div>
          </FormSection>
        </div>
      </PanelCard>

      <PanelCard title="Panel visual y antiraid" description="Textos, apariencia y reglas defensivas para que el acceso sea claro para miembros y seguro para el staff.">
        <div className="space-y-6">
          <FieldShell label="Titulo">
            <input {...register('panelTitle')} className="dashboard-form-field" />
          </FieldShell>
          <FieldShell label="Descripcion">
            <textarea {...register('panelDescription')} rows={4} className="dashboard-form-field" />
          </FieldShell>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldShell label="Color HEX" error={errors.panelColor?.message}>
              <input {...register('panelColor')} className="dashboard-form-field" />
            </FieldShell>
            <FieldShell label="Imagen">
              <input {...register('panelImage')} placeholder="https://..." className="dashboard-form-field" />
            </FieldShell>
          </div>
          {mode === 'question' ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="Pregunta" error={errors.question?.message}>
                <input {...register('question')} className="dashboard-form-field" />
              </FieldShell>
              <FieldShell label="Respuesta esperada" error={errors.questionAnswer?.message}>
                <input {...register('questionAnswer')} className="dashboard-form-field" />
              </FieldShell>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <ToggleCard title="Antiraid" description="Controla joins anormales antes de verificar.">
              <input type="checkbox" {...register('antiraidEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
            <ToggleCard title="DM al verificar" description="Confirma por mensaje directo cuando alguien completa el proceso.">
              <input type="checkbox" {...register('dmOnVerify')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Joins umbral</span>
              <input type="number" min={3} max={50} {...register('antiraidJoins', { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Ventana (seg)</span>
              <input type="number" min={5} max={60} {...register('antiraidSeconds', { valueAsNumber: true })} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Accion</span>
              <select {...register('antiraidAction')} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 dark:border-surface-600 dark:bg-surface-700">
                <option value="pause">Pause</option>
                <option value="kick">Kick</option>
              </select>
            </label>
          </div>
        </div>
      </PanelCard>
    </form>
  );
}
