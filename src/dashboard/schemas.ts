import { z } from 'zod';
import type {
  DashboardPreferences,
  DashboardSectionId,
  GeneralSettings,
  GuildConfig,
  ModerationSettings,
} from './types';

export const dashboardSectionIds = [
  'overview',
  'general',
  'moderation',
  'activity',
  'analytics',
] as const satisfies readonly DashboardSectionId[];

export const generalSettingsSchema = z
  .object({
    language: z.enum(['es', 'en']),
    commandMode: z.enum(['mention', 'prefix']),
    prefix: z
      .string()
      .trim()
      .min(1, 'El prefijo es obligatorio')
      .max(5, 'Usa un prefijo corto'),
    timezone: z.string().trim().min(1, 'Selecciona una zona horaria'),
    moderationPreset: z.enum(['relaxed', 'balanced', 'strict']),
  })
  .superRefine((value, context) => {
    if (value.commandMode === 'prefix' && !value.prefix.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ingresa un prefijo para el modo por prefijo.',
        path: ['prefix'],
      });
    }
  });

export const moderationSettingsSchema = z.object({
  antiSpamEnabled: z.boolean(),
  antiSpamThreshold: z.number().int().min(2).max(20),
  linkFilterEnabled: z.boolean(),
  capsFilterEnabled: z.boolean(),
  capsPercentageLimit: z.number().int().min(20).max(100),
  duplicateFilterEnabled: z.boolean(),
  duplicateWindowSeconds: z.number().int().min(10).max(300),
  raidProtectionEnabled: z.boolean(),
  raidPreset: z.enum(['off', 'balanced', 'lockdown']),
});

export const dashboardPreferencesSchema = z.object({
  defaultSection: z.enum(dashboardSectionIds),
  compactMode: z.boolean(),
  showAdvancedCards: z.boolean(),
});

export const generalModuleSchema = generalSettingsSchema.extend({
  defaultSection: z.enum(dashboardSectionIds),
  compactMode: z.boolean(),
  showAdvancedCards: z.boolean(),
});

export const dashboardGuildSchema = z.object({
  guildId: z.string().min(1),
  guildName: z.string().min(1),
  guildIcon: z.string().nullable(),
  permissionsRaw: z.string().default('0'),
  canManage: z.boolean(),
  isOwner: z.boolean(),
  botInstalled: z.boolean(),
  memberCount: z.number().int().nullable(),
  premiumTier: z.string().nullable(),
  botLastSeenAt: z.string().nullable(),
  lastSyncedAt: z.string().nullable(),
});

export const guildConfigSchema = z.object({
  guildId: z.string().min(1),
  generalSettings: generalSettingsSchema,
  moderationSettings: moderationSettingsSchema,
  dashboardPreferences: dashboardPreferencesSchema,
  updatedBy: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

export const guildEventSchema = z.object({
  id: z.string().min(1),
  guildId: z.string().min(1),
  eventType: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string().min(1),
});

export const guildMetricsSchema = z.object({
  guildId: z.string().min(1),
  metricDate: z.string().min(1),
  commandsExecuted: z.number().int().nonnegative(),
  moderatedMessages: z.number().int().nonnegative(),
  activeMembers: z.number().int().nonnegative(),
  uptimePercentage: z.number().min(0).max(100),
});

export const dashboardSyncResultSchema = z.object({
  guilds: z.array(dashboardGuildSchema),
  syncedAt: z.string().min(1),
  manageableCount: z.number().int().nonnegative(),
  installedCount: z.number().int().nonnegative(),
});

const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

export const defaultGeneralSettings: GeneralSettings = {
  language: 'es',
  commandMode: 'mention',
  prefix: '!',
  timezone: systemTimezone,
  moderationPreset: 'balanced',
};

export const defaultModerationSettings: ModerationSettings = {
  antiSpamEnabled: true,
  antiSpamThreshold: 6,
  linkFilterEnabled: true,
  capsFilterEnabled: true,
  capsPercentageLimit: 70,
  duplicateFilterEnabled: true,
  duplicateWindowSeconds: 45,
  raidProtectionEnabled: true,
  raidPreset: 'balanced',
};

export const defaultDashboardPreferences: DashboardPreferences = {
  defaultSection: 'overview',
  compactMode: false,
  showAdvancedCards: true,
};

export const defaultGuildConfig: Omit<GuildConfig, 'guildId'> = {
  generalSettings: defaultGeneralSettings,
  moderationSettings: defaultModerationSettings,
  dashboardPreferences: defaultDashboardPreferences,
  updatedBy: null,
  updatedAt: null,
};

export type GeneralModuleValues = z.infer<typeof generalModuleSchema>;
export type ModerationModuleValues = z.infer<typeof moderationSettingsSchema>;
