import {
  defaultDashboardPreferences,
  defaultGeneralSettings,
  defaultGuildConfig,
  defaultGuildInventory,
  defaultGuildSyncStatus,
  defaultLegacyProtectionSettings,
  defaultModlogSettings,
  defaultServerRolesChannelsSettings,
  defaultSuggestionSettings,
  defaultSystemSettings,
  defaultTicketsSettings,
  defaultVerificationSettings,
  defaultWelcomeSettings,
  guildBackupManifestSchema,
  guildConfigSchema,
  guildInventorySchema,
  guildMutationSchema,
  guildSyncStatusSchema,
  ticketConversationEventSchema,
  ticketInboxItemSchema,
  ticketMacroSchema,
} from '../schemas';
import type {
  CommandRateLimitOverride,
  GuildBackupManifest,
  GuildConfig,
  GuildConfigMutation,
  GuildInventory,
  GuildSyncStatus,
  TicketConversationEvent,
  TicketInboxItem,
  TicketMacro,
} from '../types';

interface GuildConfigRow {
  guild_id?: string | null;
  general_settings?: unknown;
  server_roles_channels_settings?: unknown;
  tickets_settings?: unknown;
  verification_settings?: unknown;
  welcome_settings?: unknown;
  suggestion_settings?: unknown;
  modlog_settings?: unknown;
  command_settings?: unknown;
  system_settings?: unknown;
  moderation_settings?: unknown;
  dashboard_preferences?: unknown;
  updated_by?: string | null;
  updated_at?: string | null;
  config_source?: string | null;
}

interface GuildInventoryRow {
  guild_id?: string | null;
  roles?: unknown;
  channels?: unknown;
  categories?: unknown;
  commands?: unknown;
  updated_at?: string | null;
}

interface GuildSyncStatusRow {
  guild_id?: string | null;
  bridge_status?: string | null;
  bridge_message?: string | null;
  last_heartbeat_at?: string | null;
  last_inventory_at?: string | null;
  last_config_sync_at?: string | null;
  last_mutation_processed_at?: string | null;
  last_backup_at?: string | null;
  pending_mutations?: number | null;
  failed_mutations?: number | null;
  updated_at?: string | null;
}

interface GuildMutationRow {
  id?: string | null;
  guild_id?: string | null;
  actor_user_id?: string | null;
  mutation_type?: string | null;
  section?: string | null;
  status?: string | null;
  requested_payload?: unknown;
  applied_payload?: unknown;
  metadata?: Record<string, unknown> | null;
  error_message?: string | null;
  requested_at?: string | null;
  applied_at?: string | null;
  failed_at?: string | null;
  superseded_at?: string | null;
  updated_at?: string | null;
}

interface GuildBackupRow {
  backup_id?: string | null;
  guild_id?: string | null;
  actor_user_id?: string | null;
  source?: string | null;
  schema_version?: number | null;
  exported_at?: string | null;
  created_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface GuildTicketInboxRow {
  guild_id?: string | null;
  ticket_id?: string | null;
  channel_id?: string | null;
  user_id?: string | null;
  user_label?: string | null;
  workflow_status?: string | null;
  queue_type?: string | null;
  category_id?: string | null;
  category_label?: string | null;
  priority?: string | null;
  subject?: string | null;
  claimed_by?: string | null;
  claimed_by_label?: string | null;
  assignee_id?: string | null;
  assignee_label?: string | null;
  claimed_at?: string | null;
  first_response_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  last_customer_message_at?: string | null;
  last_staff_message_at?: string | null;
  last_activity_at?: string | null;
  message_count?: number | null;
  staff_message_count?: number | null;
  reopen_count?: number | null;
  tags?: unknown;
  sla_target_minutes?: number | null;
  sla_due_at?: string | null;
  sla_state?: string | null;
  is_open?: boolean | null;
}

interface GuildTicketEventRow {
  id?: string | null;
  guild_id?: string | null;
  ticket_id?: string | null;
  channel_id?: string | null;
  actor_id?: string | null;
  actor_kind?: string | null;
  actor_label?: string | null;
  event_type?: string | null;
  visibility?: string | null;
  title?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
}

interface GuildTicketMacroRow {
  macro_id?: string | null;
  guild_id?: string | null;
  label?: string | null;
  content?: string | null;
  visibility?: string | null;
  sort_order?: number | null;
  is_system?: boolean | null;
}

function normalizeDashboardPreferencesInput(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  const preferences = value as Record<string, unknown>;
  const defaultSection =
    typeof preferences.defaultSection === 'string'
      ? preferences.defaultSection.trim().toLowerCase()
      : null;

  if (defaultSection !== 'moderation') {
    return value;
  }

  return {
    ...preferences,
    defaultSection: 'system',
  };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

export function createDefaultGuildConfig(guildId: string): GuildConfig {
  return {
    guildId,
    ...defaultGuildConfig,
  };
}

export function createDefaultGuildInventory(guildId: string): GuildInventory {
  return {
    guildId,
    ...defaultGuildInventory,
  };
}

export function normalizeCommandRateLimitOverrides(value: unknown): Record<string, CommandRateLimitOverride> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const result: Record<string, CommandRateLimitOverride> = {};

  for (const [rawName, rawConfig] of Object.entries(value)) {
    const name = String(rawName || '').trim().toLowerCase();
    if (!name) {
      continue;
    }

    const override =
      rawConfig && typeof rawConfig === 'object' && !Array.isArray(rawConfig)
        ? {
          maxActions: clampNumber((rawConfig as Record<string, unknown>).max_actions ?? (rawConfig as Record<string, unknown>).maxActions, 1, 50, 4),
          windowSeconds: clampNumber((rawConfig as Record<string, unknown>).window_seconds ?? (rawConfig as Record<string, unknown>).windowSeconds, 1, 300, 20),
          enabled: (rawConfig as Record<string, unknown>).enabled !== false,
        }
        : {
          maxActions: clampNumber(rawConfig, 1, 50, 4),
          windowSeconds: 20,
          enabled: true,
        };

    result[name] = override;
  }

  return result;
}

export function normalizeGuildConfig(
  guildId: string,
  row: GuildConfigRow | null | undefined,
): GuildConfig {
  if (!row) {
    return createDefaultGuildConfig(guildId);
  }

  const parsed = guildConfigSchema.safeParse({
    guildId: row.guild_id ?? guildId,
    generalSettings: row.general_settings ?? defaultGeneralSettings,
    serverRolesChannelsSettings:
      row.server_roles_channels_settings ?? defaultServerRolesChannelsSettings,
    ticketsSettings: row.tickets_settings ?? defaultTicketsSettings,
    verificationSettings: row.verification_settings ?? defaultVerificationSettings,
    welcomeSettings: row.welcome_settings ?? defaultWelcomeSettings,
    suggestionSettings: row.suggestion_settings ?? defaultSuggestionSettings,
    modlogSettings: row.modlog_settings ?? defaultModlogSettings,
    commandSettings:
      row.command_settings && typeof row.command_settings === 'object' && !Array.isArray(row.command_settings)
        ? {
          ...(row.command_settings as Record<string, unknown>),
          commandRateLimitOverrides: normalizeCommandRateLimitOverrides(
            (row.command_settings as Record<string, unknown>).commandRateLimitOverrides ??
            (row.command_settings as Record<string, unknown>).command_rate_limit_overrides,
          ),
        }
        : defaultGuildConfig.commandSettings,
    systemSettings:
      row.system_settings && typeof row.system_settings === 'object' && !Array.isArray(row.system_settings)
        ? {
          maintenanceMode:
            (row.system_settings as Record<string, unknown>).maintenanceMode ??
            (row.system_settings as Record<string, unknown>).maintenance_mode ??
            defaultSystemSettings.maintenanceMode,
          maintenanceReason:
            (row.system_settings as Record<string, unknown>).maintenanceReason ??
            (row.system_settings as Record<string, unknown>).maintenance_reason ??
            defaultSystemSettings.maintenanceReason,
          legacyProtectionSettings:
            (row.system_settings as Record<string, unknown>).legacyProtectionSettings ??
            (row.system_settings as Record<string, unknown>).legacy_protection_settings ??
            row.moderation_settings ??
            defaultLegacyProtectionSettings,
        }
        : {
          ...defaultSystemSettings,
          legacyProtectionSettings: row.moderation_settings ?? defaultLegacyProtectionSettings,
        },
    dashboardPreferences:
      normalizeDashboardPreferencesInput(row.dashboard_preferences) ?? defaultDashboardPreferences,
    updatedBy: row.updated_by ?? null,
    updatedAt: row.updated_at ?? null,
    configSource: row.config_source ?? 'bot',
  });

  if (parsed.success) {
    return parsed.data;
  }

  return createDefaultGuildConfig(guildId);
}

export function normalizeGuildInventory(
  guildId: string,
  row: GuildInventoryRow | null | undefined,
): GuildInventory {
  if (!row) {
    return createDefaultGuildInventory(guildId);
  }

  const parsed = guildInventorySchema.safeParse({
    guildId: row.guild_id ?? guildId,
    roles: row.roles ?? [],
    channels: row.channels ?? [],
    categories: row.categories ?? [],
    commands: row.commands ?? [],
    updatedAt: row.updated_at ?? null,
  });

  if (parsed.success) {
    return parsed.data;
  }

  return createDefaultGuildInventory(guildId);
}

export function normalizeGuildSyncStatus(
  guildId: string,
  row: GuildSyncStatusRow | null | undefined,
): GuildSyncStatus | null {
  if (!row) {
    return null;
  }

  const parsed = guildSyncStatusSchema.safeParse({
    guildId: row.guild_id ?? guildId,
    bridgeStatus: row.bridge_status ?? defaultGuildSyncStatus.bridgeStatus,
    bridgeMessage: row.bridge_message ?? null,
    lastHeartbeatAt: row.last_heartbeat_at ?? null,
    lastInventoryAt: row.last_inventory_at ?? null,
    lastConfigSyncAt: row.last_config_sync_at ?? null,
    lastMutationProcessedAt: row.last_mutation_processed_at ?? null,
    lastBackupAt: row.last_backup_at ?? null,
    pendingMutations: row.pending_mutations ?? 0,
    failedMutations: row.failed_mutations ?? 0,
    updatedAt: row.updated_at ?? null,
  });

  return parsed.success ? parsed.data : null;
}

export function normalizeGuildMutations(rows: GuildMutationRow[] | null | undefined): GuildConfigMutation[] {
  return (rows ?? [])
    .map((row) =>
      guildMutationSchema.safeParse({
        id: row.id ?? '',
        guildId: row.guild_id ?? '',
        actorUserId: row.actor_user_id ?? null,
        mutationType: row.mutation_type ?? 'config',
        section: row.section ?? '',
        status: row.status ?? 'pending',
        requestedPayload: row.requested_payload ?? {},
        appliedPayload: row.applied_payload ?? null,
        metadata: row.metadata ?? {},
        errorMessage: row.error_message ?? null,
        requestedAt: row.requested_at ?? row.updated_at ?? new Date().toISOString(),
        appliedAt: row.applied_at ?? null,
        failedAt: row.failed_at ?? null,
        supersededAt: row.superseded_at ?? null,
        updatedAt: row.updated_at ?? row.requested_at ?? new Date().toISOString(),
      }),
    )
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((left, right) => right.requestedAt.localeCompare(left.requestedAt));
}

export function normalizeGuildBackups(rows: GuildBackupRow[] | null | undefined): GuildBackupManifest[] {
  return (rows ?? [])
    .map((row) =>
      guildBackupManifestSchema.safeParse({
        backupId: row.backup_id ?? '',
        guildId: row.guild_id ?? '',
        actorUserId: row.actor_user_id ?? null,
        source: row.source ?? 'manual',
        schemaVersion: row.schema_version ?? 1,
        exportedAt: row.exported_at ?? row.created_at ?? new Date().toISOString(),
        createdAt: row.created_at ?? row.exported_at ?? new Date().toISOString(),
        metadata: row.metadata ?? {},
      }),
    )
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function normalizeGuildTicketInbox(
  guildId: string,
  rows: GuildTicketInboxRow[] | null | undefined,
): TicketInboxItem[] {
  return (rows ?? [])
    .map((row) =>
      ticketInboxItemSchema.safeParse({
        guildId: row.guild_id ?? guildId,
        ticketId: row.ticket_id ?? '',
        channelId: row.channel_id ?? '',
        userId: row.user_id ?? '',
        userLabel: row.user_label ?? null,
        workflowStatus: row.workflow_status ?? 'new',
        queueType: row.queue_type ?? 'support',
        categoryId: row.category_id ?? null,
        categoryLabel: row.category_label ?? 'General',
        priority: row.priority ?? 'normal',
        subject: row.subject ?? null,
        claimedBy: row.claimed_by ?? null,
        claimedByLabel: row.claimed_by_label ?? null,
        assigneeId: row.assignee_id ?? null,
        assigneeLabel: row.assignee_label ?? null,
        claimedAt: row.claimed_at ?? null,
        firstResponseAt: row.first_response_at ?? null,
        resolvedAt: row.resolved_at ?? null,
        closedAt: row.closed_at ?? null,
        createdAt: row.created_at ?? new Date().toISOString(),
        updatedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
        lastCustomerMessageAt: row.last_customer_message_at ?? null,
        lastStaffMessageAt: row.last_staff_message_at ?? null,
        lastActivityAt: row.last_activity_at ?? row.updated_at ?? null,
        messageCount: row.message_count ?? 0,
        staffMessageCount: row.staff_message_count ?? 0,
        reopenCount: row.reopen_count ?? 0,
        tags: Array.isArray(row.tags) ? row.tags : [],
        slaTargetMinutes: row.sla_target_minutes ?? 0,
        slaDueAt: row.sla_due_at ?? null,
        slaState: row.sla_state ?? 'healthy',
        isOpen: row.is_open ?? true,
      }),
    )
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((left, right) => {
      if (left.isOpen !== right.isOpen) {
        return left.isOpen ? -1 : 1;
      }

      const leftDate = left.lastActivityAt ?? left.updatedAt;
      const rightDate = right.lastActivityAt ?? right.updatedAt;
      return rightDate.localeCompare(leftDate);
    });
}

export function normalizeGuildTicketEvents(
  guildId: string,
  rows: GuildTicketEventRow[] | null | undefined,
): TicketConversationEvent[] {
  return (rows ?? [])
    .map((row) =>
      ticketConversationEventSchema.safeParse({
        id: row.id ?? '',
        guildId: row.guild_id ?? guildId,
        ticketId: row.ticket_id ?? '',
        channelId: row.channel_id ?? null,
        actorId: row.actor_id ?? null,
        actorKind: row.actor_kind ?? 'system',
        actorLabel: row.actor_label ?? null,
        eventType: row.event_type ?? 'system',
        visibility: row.visibility ?? 'system',
        title: row.title ?? 'Evento',
        description: row.description ?? 'Sin descripcion',
        metadata: row.metadata ?? {},
        createdAt: row.created_at ?? new Date().toISOString(),
      }),
    )
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function normalizeGuildTicketMacros(
  guildId: string,
  rows: GuildTicketMacroRow[] | null | undefined,
): TicketMacro[] {
  return (rows ?? [])
    .map((row) =>
      ticketMacroSchema.safeParse({
        macroId: row.macro_id ?? '',
        guildId: row.guild_id ?? guildId,
        label: row.label ?? 'Macro',
        content: row.content ?? '',
        visibility: row.visibility ?? 'public',
        sortOrder: row.sort_order ?? 0,
        isSystem: row.is_system ?? false,
      }),
    )
    .filter((result) => result.success)
    .map((result) => result.data)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.label.localeCompare(right.label));
}
