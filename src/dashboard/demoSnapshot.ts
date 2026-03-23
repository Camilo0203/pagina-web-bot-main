import type { User } from '@supabase/supabase-js';
import type { DashboardGuild, GuildDashboardSnapshot, TicketDashboardActionId } from './types';
import {
  defaultGuildConfig,
  defaultGuildInventory,
  defaultGuildSyncStatus,
} from './schemas';

const NOW = '2026-03-23T16:00:00.000Z';

export const demoDashboardUser: User = {
  id: 'demo-user-1',
  email: 'ops-lead-demo@ton618.local',
  app_metadata: { provider: 'discord', providers: ['discord'] },
  user_metadata: {
    full_name: 'Ops Lead Demo',
    name: 'Ops Lead Demo',
    provider_id: '1234567890',
  },
  aud: 'authenticated',
  created_at: NOW,
};

export const demoDashboardGuild: DashboardGuild = {
  guildId: 'guild-demo-1',
  guildName: 'TON618 Ops Beta',
  guildIcon: null,
  permissionsRaw: '8',
  canManage: true,
  isOwner: true,
  botInstalled: true,
  memberCount: 1842,
  premiumTier: null,
  botLastSeenAt: NOW,
  lastSyncedAt: NOW,
};

export function createDemoSnapshot(): GuildDashboardSnapshot {
  return {
    config: {
      guildId: demoDashboardGuild.guildId,
      ...defaultGuildConfig,
      generalSettings: {
        ...defaultGuildConfig.generalSettings,
        timezone: 'America/Bogota',
        opsPlan: 'pro',
      },
      serverRolesChannelsSettings: {
        ...defaultGuildConfig.serverRolesChannelsSettings,
        supportRoleId: 'role-support',
        adminRoleId: 'role-admin',
        ticketPanelChannelId: 'channel-ticket-panel',
        dashboardChannelId: 'channel-dashboard',
      },
      ticketsSettings: {
        ...defaultGuildConfig.ticketsSettings,
        slaMinutes: 30,
        slaEscalationEnabled: true,
        slaEscalationMinutes: 45,
        incidentModeEnabled: true,
        incidentPausedCategories: ['billing'],
        incidentMessage: 'Estamos operando con capacidad reducida mientras resolvemos un incidente.',
      },
    },
    inventory: {
      guildId: demoDashboardGuild.guildId,
      ...defaultGuildInventory,
      channels: [
        { id: 'channel-dashboard', name: 'ops-dashboard', type: 'text', parentId: null, position: 1 },
        { id: 'channel-ticket-panel', name: 'tickets', type: 'text', parentId: null, position: 2 },
      ],
      roles: [
        { id: 'role-support', name: 'Support', colorHex: '5865F2', position: 1, managed: false },
        { id: 'role-admin', name: 'Ops Admin', colorHex: '57F287', position: 2, managed: false },
      ],
      categories: [
        { id: 'support', label: 'Support', description: 'Casos operativos', priority: 'normal' },
        { id: 'billing', label: 'Billing', description: 'Cobros y renovaciones', priority: 'high' },
      ],
      commands: [
        { name: 'ticket', label: '/ticket', category: 'support' },
        { name: 'setup', label: '/setup', category: 'config' },
      ],
      updatedAt: NOW,
    },
    events: [
      {
        id: 'event-1',
        guildId: demoDashboardGuild.guildId,
        eventType: 'playbook',
        title: 'Playbook SLA activo',
        description: 'El bot detecto un ticket en warning y publico una recomendacion de escalado.',
        metadata: {},
        createdAt: '2026-03-23T15:52:00.000Z',
      },
    ],
    metrics: [
      {
        guildId: demoDashboardGuild.guildId,
        metricDate: '2026-03-23',
        commandsExecuted: 148,
        moderatedMessages: 12,
        activeMembers: 834,
        uptimePercentage: 99.97,
        ticketsOpened: 18,
        ticketsClosed: 15,
        openTickets: 7,
        slaBreaches: 1,
        avgFirstResponseMinutes: 8,
        modulesActive: ['tickets', 'playbooks', 'verification'],
      },
      {
        guildId: demoDashboardGuild.guildId,
        metricDate: '2026-03-22',
        commandsExecuted: 121,
        moderatedMessages: 9,
        activeMembers: 812,
        uptimePercentage: 99.92,
        ticketsOpened: 16,
        ticketsClosed: 12,
        openTickets: 6,
        slaBreaches: 2,
        avgFirstResponseMinutes: 11,
        modulesActive: ['tickets', 'playbooks', 'verification'],
      },
    ],
    mutations: [],
    backups: [
      {
        backupId: 'backup-demo-1',
        guildId: demoDashboardGuild.guildId,
        actorUserId: 'demo-user-1',
        source: 'manual',
        schemaVersion: 2,
        exportedAt: '2026-03-23T13:00:00.000Z',
        createdAt: '2026-03-23T13:00:00.000Z',
        metadata: {},
      },
    ],
    syncStatus: {
      ...defaultGuildSyncStatus,
      guildId: demoDashboardGuild.guildId,
      bridgeStatus: 'healthy',
      lastHeartbeatAt: NOW,
      lastInventoryAt: NOW,
      lastConfigSyncAt: NOW,
      lastMutationProcessedAt: NOW,
      lastBackupAt: '2026-03-23T13:00:00.000Z',
      updatedAt: NOW,
    },
    ticketWorkspace: {
      inbox: [
        {
          guildId: demoDashboardGuild.guildId,
          ticketId: '1042',
          channelId: 'channel-ticket-1042',
          userId: 'user-1042',
          userLabel: 'Camilo QA',
          workflowStatus: 'waiting_staff',
          queueType: 'support',
          categoryId: 'billing',
          categoryLabel: 'Billing',
          priority: 'high',
          subject: 'No se actualizo la suscripcion',
          claimedBy: null,
          claimedByLabel: null,
          assigneeId: null,
          assigneeLabel: null,
          claimedAt: null,
          firstResponseAt: null,
          resolvedAt: null,
          closedAt: null,
          createdAt: '2026-03-23T15:20:00.000Z',
          updatedAt: '2026-03-23T15:50:00.000Z',
          lastCustomerMessageAt: '2026-03-23T15:50:00.000Z',
          lastStaffMessageAt: null,
          lastActivityAt: '2026-03-23T15:50:00.000Z',
          messageCount: 3,
          staffMessageCount: 0,
          reopenCount: 0,
          tags: ['billing', 'priority'],
          slaTargetMinutes: 30,
          slaDueAt: '2026-03-23T15:50:00.000Z',
          slaState: 'warning',
          isOpen: true,
        },
        {
          guildId: demoDashboardGuild.guildId,
          ticketId: '1039',
          channelId: 'channel-ticket-1039',
          userId: 'user-1039',
          userLabel: 'Nora Support',
          workflowStatus: 'resolved',
          queueType: 'support',
          categoryId: 'support',
          categoryLabel: 'Support',
          priority: 'normal',
          subject: 'Error de acceso al panel',
          claimedBy: 'staff-1',
          claimedByLabel: 'Ops Lead Demo',
          assigneeId: 'staff-1',
          assigneeLabel: 'Ops Lead Demo',
          claimedAt: '2026-03-22T16:05:00.000Z',
          firstResponseAt: '2026-03-22T16:06:00.000Z',
          resolvedAt: '2026-03-22T16:20:00.000Z',
          closedAt: '2026-03-22T16:20:00.000Z',
          createdAt: '2026-03-22T16:00:00.000Z',
          updatedAt: '2026-03-22T16:20:00.000Z',
          lastCustomerMessageAt: '2026-03-22T16:04:00.000Z',
          lastStaffMessageAt: '2026-03-22T16:06:00.000Z',
          lastActivityAt: '2026-03-22T16:20:00.000Z',
          messageCount: 6,
          staffMessageCount: 2,
          reopenCount: 0,
          tags: ['resolved'],
          slaTargetMinutes: 30,
          slaDueAt: null,
          slaState: 'resolved',
          isOpen: false,
        },
      ],
      events: [
        {
          id: 'ticket-event-1',
          guildId: demoDashboardGuild.guildId,
          ticketId: '1042',
          channelId: 'channel-ticket-1042',
          actorId: 'user-1042',
          actorKind: 'customer',
          actorLabel: 'Camilo QA',
          eventType: 'customer_message',
          visibility: 'public',
          title: 'Cliente actualizo el contexto',
          description: 'Comparte captura del fallo y confirma que el cobro si fue procesado.',
          metadata: {},
          createdAt: '2026-03-23T15:50:00.000Z',
        },
      ],
      macros: [
        {
          macroId: 'need_details',
          guildId: demoDashboardGuild.guildId,
          label: 'Pedir detalle',
          content: 'Compartenos pasos exactos, capturas y cualquier ID relevante para investigar mas rapido.',
          visibility: 'public',
          sortOrder: 1,
          isSystem: true,
        },
        {
          macroId: 'handoff',
          guildId: demoDashboardGuild.guildId,
          label: 'Nota de handoff',
          content: 'Handoff interno: contexto levantado, impacto validado y pendiente seguimiento del especialista.',
          visibility: 'internal',
          sortOrder: 2,
          isSystem: true,
        },
      ],
    },
    playbooks: {
      definitions: [
        {
          guildId: demoDashboardGuild.guildId,
          playbookId: 'triage_support',
          key: 'triage_support',
          label: 'Triage de soporte',
          description: 'Ayuda al staff a reclamar y ordenar tickets nuevos.',
          tier: 'free',
          executionMode: 'assistive',
          summary: 'Detecta tickets nuevos sin responsable.',
          triggerSummary: 'Tickets abiertos sin claim o primera respuesta.',
          isEnabled: true,
          sortOrder: 1,
          updatedAt: NOW,
        },
        {
          guildId: demoDashboardGuild.guildId,
          playbookId: 'sla_escalation',
          key: 'sla_escalation',
          label: 'Escalado por SLA',
          description: 'Prioriza tickets cerca del vencimiento.',
          tier: 'pro',
          executionMode: 'assistive',
          summary: 'Lee warning y breached para empujar decisiones.',
          triggerSummary: 'Tickets en warning o breached.',
          isEnabled: true,
          sortOrder: 2,
          updatedAt: NOW,
        },
      ],
      runs: [
        {
          runId: 'run_1042_sla_escalation',
          guildId: demoDashboardGuild.guildId,
          playbookId: 'sla_escalation',
          ticketId: '1042',
          userId: 'user-1042',
          status: 'pending',
          tone: 'warning',
          title: 'El riesgo SLA necesita escalado',
          summary: 'El ticket se acerca al SLA. Conviene subir prioridad antes de que se estanque.',
          reason: 'El estado SLA es warning con objetivo de 30 minutos.',
          suggestedAction: 'set_priority',
          suggestedPriority: 'urgent',
          suggestedStatus: null,
          suggestedMacroId: 'handoff',
          confidence: 0.87,
          sortOrder: 1,
          metadata: {},
          createdAt: '2026-03-23T15:50:00.000Z',
          updatedAt: NOW,
        },
      ],
      customerMemory: [
        {
          guildId: demoDashboardGuild.guildId,
          userId: 'user-1042',
          displayLabel: 'Camilo QA',
          totalTickets: 3,
          openTickets: 1,
          resolvedTickets: 2,
          breachedTickets: 1,
          recentTags: ['billing', 'renewal'],
          lastTicketAt: '2026-03-23T15:20:00.000Z',
          lastResolvedAt: '2026-03-20T17:00:00.000Z',
          riskLevel: 'watch',
          summary: 'Camilo QA es un usuario recurrente con tickets recientes de billing y una senal de riesgo SLA.',
          updatedAt: NOW,
        },
      ],
      recommendations: [
        {
          recommendationId: '1042_sla_escalation',
          guildId: demoDashboardGuild.guildId,
          ticketId: '1042',
          userId: 'user-1042',
          playbookId: 'sla_escalation',
          status: 'pending',
          tone: 'warning',
          title: 'El riesgo SLA necesita escalado',
          summary: 'El ticket se acerca al SLA. Conviene subir prioridad antes de que se estanque.',
          reason: 'El estado SLA es warning con objetivo de 30 minutos.',
          suggestedAction: 'set_priority',
          suggestedPriority: 'urgent',
          suggestedStatus: null,
          suggestedMacroId: 'handoff',
          confidence: 0.87,
          customerRiskLevel: 'watch',
          customerSummary: 'Camilo QA es un usuario recurrente con tickets recientes de billing y una senal de riesgo SLA.',
          metadata: {
            assistant: {
              provider: 'deterministic',
              mode: 'assistive',
              replyDraft: 'Vamos a escalar este caso internamente para que no se nos pase la ventana de respuesta.',
              nextAction: 'Subir prioridad y escalar ownership.',
            },
          },
          createdAt: '2026-03-23T15:50:00.000Z',
          updatedAt: NOW,
        },
      ],
    },
    partialFailures: [],
  };
}

export function applyDemoTicketAction(
  snapshot: GuildDashboardSnapshot,
  action: TicketDashboardActionId,
  payload: Record<string, unknown>,
): GuildDashboardSnapshot {
  const ticketId = String(payload.ticketId || '');
  if (!ticketId) {
    return snapshot;
  }

  const recommendationId = typeof payload.recommendationId === 'string' ? payload.recommendationId : null;
  const runId = typeof payload.runId === 'string' ? payload.runId : null;

  const nextInbox = snapshot.ticketWorkspace.inbox.map((ticket) => {
    if (ticket.ticketId !== ticketId) return ticket;

    switch (action) {
      case 'claim':
        return { ...ticket, claimedBy: demoDashboardUser.id, claimedByLabel: 'Ops Lead Demo' };
      case 'unclaim':
        return { ...ticket, claimedBy: null, claimedByLabel: null };
      case 'assign_self':
        return { ...ticket, assigneeId: demoDashboardUser.id, assigneeLabel: 'Ops Lead Demo' };
      case 'unassign':
        return { ...ticket, assigneeId: null, assigneeLabel: null };
      case 'set_status':
        return { ...ticket, workflowStatus: String(payload.workflowStatus || ticket.workflowStatus) as typeof ticket.workflowStatus };
      case 'set_priority':
        return { ...ticket, priority: String(payload.priority || ticket.priority) as typeof ticket.priority };
      case 'close':
        return {
          ...ticket,
          workflowStatus: 'closed' as typeof ticket.workflowStatus,
          isOpen: false,
          closedAt: NOW,
          resolvedAt: NOW,
          slaState: 'resolved' as typeof ticket.slaState,
        };
      case 'reopen':
        return {
          ...ticket,
          workflowStatus: 'triage' as typeof ticket.workflowStatus,
          isOpen: true,
          closedAt: null,
          resolvedAt: null,
          slaState: 'healthy' as typeof ticket.slaState,
        };
      case 'add_tag':
        return { ...ticket, tags: Array.from(new Set([...ticket.tags, String(payload.tag || '').trim()])).filter(Boolean) };
      case 'remove_tag':
        return { ...ticket, tags: ticket.tags.filter((tag) => tag !== String(payload.tag || '')) };
      default:
        return ticket;
    }
  });

  const mapRecommendationStatus = (currentStatus: 'pending' | 'applied' | 'dismissed') => {
    if (recommendationId && currentStatus !== 'pending') {
      return currentStatus;
    }
    if (action === 'dismiss_recommendation') return 'dismissed' as const;
    if (
      action === 'confirm_recommendation'
      || action === 'set_status'
      || action === 'set_priority'
      || action === 'post_macro'
    ) {
      return 'applied' as const;
    }
    return currentStatus;
  };

  return {
    ...snapshot,
    ticketWorkspace: {
      ...snapshot.ticketWorkspace,
      inbox: nextInbox,
    },
    playbooks: {
      ...snapshot.playbooks,
      recommendations: snapshot.playbooks.recommendations.map((recommendation) =>
        recommendation.recommendationId === recommendationId
          ? {
            ...recommendation,
            status: mapRecommendationStatus(recommendation.status),
          }
          : recommendation,
      ),
      runs: snapshot.playbooks.runs.map((run) =>
        run.runId === runId
          ? {
            ...run,
            status:
              action === 'dismiss_recommendation'
                ? 'dismissed'
                : action === 'confirm_recommendation' || action === 'set_status' || action === 'set_priority' || action === 'post_macro'
                  ? 'applied'
                  : run.status,
          }
          : run,
      ),
    },
  };
}
