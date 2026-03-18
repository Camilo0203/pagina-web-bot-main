import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MessageSquareQuote } from 'lucide-react';
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
import { suggestionSettingsSchema } from '../schemas';
import type {
  DashboardGuild,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  SuggestionSettings,
} from '../types';
import { getChannelOptions } from '../utils';
import { findMissingSelections, flattenFormErrors, getInventoryState } from '../validation';

type SuggestionsModuleValues = z.infer<typeof suggestionSettingsSchema>;

interface SuggestionsModuleProps {
  guild: DashboardGuild;
  config: GuildConfig;
  inventory: GuildInventory;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isSaving: boolean;
  onSave: (values: SuggestionSettings) => Promise<void>;
}

export default function SuggestionsModule({
  guild,
  config,
  inventory,
  mutation,
  syncStatus,
  isSaving,
  onSave,
}: SuggestionsModuleProps) {
  const channelOptions = getChannelOptions(inventory, ['text', 'announcement', 'forum']);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<SuggestionsModuleValues>({
    resolver: zodResolver(suggestionSettingsSchema) as never,
    defaultValues: config.suggestionSettings,
  });

  useEffect(() => {
    reset(config.suggestionSettings);
  }, [config.suggestionSettings, reset]);

  const enabled = watch('enabled');
  const validationErrors = flattenFormErrors(errors);
  const inventoryState = getInventoryState(inventory);
  const missingSelections = findMissingSelections(
    [
      { label: 'Canal base', value: config.suggestionSettings.channelId },
      { label: 'Canal logs', value: config.suggestionSettings.logChannelId },
      { label: 'Canal aprobadas', value: config.suggestionSettings.approvedChannelId },
      { label: 'Canal rechazadas', value: config.suggestionSettings.rejectedChannelId },
    ],
    channelOptions,
  );

  if (!guild.botInstalled) {
    return (
      <StateCard
        eyebrow="Onboarding"
        title="Instala el bot para gestionar sugerencias"
        description="Este modulo refleja el sistema real de sugerencias del bot y sus canales asociados."
        icon={MessageSquareQuote}
        tone="warning"
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSave(values);
      })}
      className="grid gap-6 xl:grid-cols-[1fr_1fr]"
    >
      <PanelCard
        eyebrow="Sugerencias"
        title="Canales y experiencia del usuario"
        description="Define donde nacen las ideas de la comunidad, donde las revisa el staff y donde se publica el resultado."
        actions={(
          <ConfigFormActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={() => reset(config.suggestionSettings)}
            saveLabel="Guardar flujo de sugerencias"
          />
        )}
      >
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <div className="mt-6 space-y-4">
          <ValidationSummary errors={[...validationErrors, ...missingSelections]} />
          {!inventoryState.hasInventory ? (
            <InventoryNotice
              title="Sin canales sincronizados"
              message="Todavia no recibimos canales desde el inventario del servidor. Re-sincroniza para poder elegir destinos reales."
            />
          ) : null}
        </div>

        <div className="mt-8 space-y-8">
          <ToggleCard
            title="Activar sugerencias"
            description="Permite usar el flujo `/suggest` del bot."
          >
            <input type="checkbox" {...register('enabled')} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          </ToggleCard>

          <FormSection
            title="Destinos del flujo"
            description="Separa el canal donde escriben los miembros del circuito de revision y de los canales donde publicas decisiones."
          >
            <div className="grid gap-5 md:grid-cols-2">
              {[
                ['channelId', 'Canal base', 'Donde la comunidad deja sugerencias nuevas.'],
                ['logChannelId', 'Canal logs', 'Revision interna del staff y trazabilidad.'],
                ['approvedChannelId', 'Canal aprobadas', 'Publicacion de sugerencias aceptadas.'],
                ['rejectedChannelId', 'Canal rechazadas', 'Publicacion de sugerencias rechazadas.'],
              ].map(([field, label, hint]) => (
                <FieldShell key={field} label={label} hint={hint} error={errors[field as keyof typeof errors]?.message as string | undefined}>
                <select {...register(field as keyof SuggestionSettings)} disabled={!enabled} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-600 dark:bg-surface-700">
                  <option value="">No configurado</option>
                  {channelOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                </FieldShell>
              ))}
            </div>
          </FormSection>
        </div>
      </PanelCard>

      <PanelCard title="Reglas de moderacion" description="Condiciones que cambian la experiencia del usuario y la forma en que el staff cierra cada sugerencia.">
        <div className="space-y-6">
          <FieldShell
            label="Cooldown (min)"
            hint="Tiempo minimo entre sugerencias consecutivas por usuario."
            error={errors.cooldownMinutes?.message}
          >
            <input type="number" min={0} max={1440} {...register('cooldownMinutes', { valueAsNumber: true })} className="dashboard-form-field" />
          </FieldShell>

          {[
            ['dmOnResult', 'Enviar DM al resolver', 'El usuario recibe el resultado por mensaje directo.'],
            ['requireReason', 'Exigir razon para moderar', 'Pide justificar aprobaciones o rechazos.'],
            ['anonymous', 'Modo anonimo', 'Oculta al autor en la publicacion inicial si el backend lo soporta.'],
          ].map(([field, label, description]) => (
            <ToggleCard key={field} title={label} description={description}>
              <input type="checkbox" {...register(field as keyof SuggestionSettings)} className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
            </ToggleCard>
          ))}
        </div>
      </PanelCard>
    </form>
  );
}
