import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Sparkles } from 'lucide-react';
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
import { welcomeSettingsSchema } from '../schemas';
import type {
  DashboardGuild,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  WelcomeSettings,
} from '../types';
import { getChannelOptions, getRoleOptions } from '../utils';
import { findMissingSelections, flattenFormErrors, getInventoryState } from '../validation';

type WelcomeModuleValues = z.infer<typeof welcomeSettingsSchema>;

interface WelcomeModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  inventory: GuildInventory;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: WelcomeSettings) => Promise<void>;
}

export default function WelcomeModule({
  guild,
  config,
  inventory,
  mutation,
  syncStatus,
  isSaving,
  onSave,
}: WelcomeModuleProps) {
  const channelOptions = getChannelOptions(inventory, ['text', 'announcement', 'forum']);
  const roleOptions = getRoleOptions(inventory);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<WelcomeModuleValues>({
    resolver: zodResolver(welcomeSettingsSchema) as never,
    defaultValues: config.welcomeSettings,
  });

  useEffect(() => {
    reset(config.welcomeSettings);
  }, [config.welcomeSettings, reset]);

  const welcomeEnabled = watch('welcomeEnabled');
  const goodbyeEnabled = watch('goodbyeEnabled');
  const validationErrors = flattenFormErrors(errors);
  const inventoryState = getInventoryState(inventory);
  const missingSelections = [
    ...findMissingSelections(
      [
        { label: 'Canal bienvenida', value: config.welcomeSettings.welcomeChannelId },
        { label: 'Canal despedida', value: config.welcomeSettings.goodbyeChannelId },
      ],
      channelOptions,
    ),
    ...findMissingSelections(
      [{ label: 'Autorole', value: config.welcomeSettings.welcomeAutoroleId }],
      roleOptions,
    ),
  ];

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="Instala el bot para editar bienvenida y despedida"
        description="Estos mensajes se aplican en eventos reales de miembros. El bot necesita estar dentro del servidor para ejecutarlos."
        icon={Sparkles}
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
        eyebrow="Bienvenida"
        title="Experiencia de bienvenida"
        description="Prepara el primer mensaje que vera un miembro nuevo, si recibira DM y si saldra con un autorrol base."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() => reset(config.welcomeSettings)}
            saveLabel="Guardar experiencia"
          />
        )}
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6 space-y-4">
          <ValidationSummary errors={[...validationErrors, ...missingSelections]} />
          {!inventoryState.hasInventory ? (
            <InventoryNotice
              title="Inventario sin publicar"
              message="Los canales y roles del servidor todavia no estan disponibles para validar bienvenida, despedida o autoroles."
            />
          ) : null}
        </div>

        <div className="mt-8 space-y-8">
          <ToggleCard
            title="Activar bienvenida"
            description="Publica embeds de bienvenida y opcionalmente DM al usuario."
          >
            <input type="checkbox" {...register('welcomeEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          </ToggleCard>

          <FormSection
            title="Bienvenida publica"
            description="Deja lista la pieza publica que ve el servidor y la automatizacion opcional por DM o autorrol."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell label="Canal bienvenida" error={errors.welcomeChannelId?.message}>
              <select {...register('welcomeChannelId')} disabled={!welcomeEnabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
                <option value="">No configurado</option>
                {channelOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              </FieldShell>
              <FieldShell label="Autorole">
              <select {...register('welcomeAutoroleId')} disabled={!welcomeEnabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
                <option value="">No configurado</option>
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              </FieldShell>
            </div>

            <FieldShell label="Titulo">
              <input {...register('welcomeTitle')} className="dashboard-form-field" />
            </FieldShell>
            <FieldShell label="Mensaje">
              <textarea {...register('welcomeMessage')} rows={4} className="dashboard-form-field" />
            </FieldShell>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldShell label="Color HEX" error={errors.welcomeColor?.message}>
              <input {...register('welcomeColor')} className="dashboard-form-field" />
            </FieldShell>
            <FieldShell label="Banner">
              <input {...register('welcomeBanner')} placeholder="https://..." className="dashboard-form-field" />
            </FieldShell>
          </div>
            <FieldShell label="Footer">
              <input {...register('welcomeFooter')} className="dashboard-form-field" />
            </FieldShell>
          <div className="grid gap-4 md:grid-cols-2">
            <ToggleCard title="Mostrar thumbnail">
              <input type="checkbox" {...register('welcomeThumbnail')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
            <ToggleCard title="Enviar DM">
              <input type="checkbox" {...register('welcomeDm')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
          </div>
            <FieldShell label="Mensaje DM" error={errors.welcomeDmMessage?.message}>
              <textarea {...register('welcomeDmMessage')} rows={3} className="dashboard-form-field" />
            </FieldShell>
          </FormSection>
        </div>
      </PanelCard>

      <PanelCard title="Despedida" description="Configura el mensaje que deja trazabilidad cuando alguien abandona el servidor.">
        <div className="space-y-5">
          <ToggleCard
            title="Activar despedida"
            description="Publica embed cuando un miembro sale del servidor."
          >
            <input type="checkbox" {...register('goodbyeEnabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          </ToggleCard>
          <FieldShell label="Canal despedida" error={errors.goodbyeChannelId?.message}>
            <select {...register('goodbyeChannelId')} disabled={!goodbyeEnabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
              <option value="">No configurado</option>
              {channelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </FieldShell>
          <FieldShell label="Titulo">
            <input {...register('goodbyeTitle')} className="dashboard-form-field" />
          </FieldShell>
          <FieldShell label="Mensaje">
            <textarea {...register('goodbyeMessage')} rows={4} className="dashboard-form-field" />
          </FieldShell>
          <div className="grid gap-5 md:grid-cols-2">
            <FieldShell label="Color HEX" error={errors.goodbyeColor?.message}>
              <input {...register('goodbyeColor')} className="dashboard-form-field" />
            </FieldShell>
            <ToggleCard title="Mostrar thumbnail">
              <input type="checkbox" {...register('goodbyeThumbnail')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
          </div>
          <FieldShell label="Footer">
            <input {...register('goodbyeFooter')} className="dashboard-form-field" />
          </FieldShell>
        </div>
      </PanelCard>
    </form>
  );
}
