import { describe, expect, it } from 'vitest';
import { defaultGuildConfig, defaultGuildSyncStatus } from './schemas';
import {
  getAnalyticsCards,
  getOverviewInsight,
  getTimelineItems,
} from './insights';
import { getDashboardChecklist, getDashboardQuickActions, getDashboardSectionStates } from './utils';
import type { DashboardGuild, GuildConfigMutation, GuildMetricsDaily, TicketWorkspaceSnapshot } from './types';

const guild: DashboardGuild = {
  guildId: 'guild-1',
  guildName: 'TON618',
  guildIcon: null,
  permissionsRaw: '8',
  canManage: true,
  isOwner: true,
  botInstalled: true,
  memberCount: 128,
  premiumTier: '2',
  botLastSeenAt: '2026-03-20T00:00:00.000Z',
  lastSyncedAt: '2026-03-20T00:00:00.000Z',
};

const metrics: GuildMetricsDaily[] = [
  {
    guildId: 'guild-1',
    metricDate: '2026-03-19',
    commandsExecuted: 80,
    moderatedMessages: 10,
    activeMembers: 50,
    uptimePercentage: 98.5,
    ticketsOpened: 3,
    ticketsClosed: 2,
    openTickets: 4,
    slaBreaches: 1,
    avgFirstResponseMinutes: 45,
    modulesActive: ['tickets', 'welcome'],
  },
  {
    guildId: 'guild-1',
    metricDate: '2026-03-20',
    commandsExecuted: 120,
    moderatedMessages: 18,
    activeMembers: 64,
    uptimePercentage: 99.2,
    ticketsOpened: 5,
    ticketsClosed: 4,
    openTickets: 3,
    slaBreaches: 0,
    avgFirstResponseMinutes: 20,
    modulesActive: ['tickets', 'welcome', 'verification'],
  },
];

const mutations: GuildConfigMutation[] = [
  {
    id: 'mutation-1',
    guildId: 'guild-1',
    actorUserId: 'user-1',
    mutationType: 'config',
    section: 'tickets',
    status: 'pending',
    requestedPayload: {},
    appliedPayload: null,
    metadata: {},
    errorMessage: null,
    requestedAt: '2026-03-20T10:00:00.000Z',
    appliedAt: null,
    failedAt: null,
    supersededAt: null,
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
];

const workspace: TicketWorkspaceSnapshot = {
  inbox: [
    {
      ticketId: '100',
      guildId: 'guild-1',
      channelId: 'channel-1',
      queueType: 'support',
      categoryId: 'support',
      categoryLabel: 'Support',
      subject: 'Need help',
      userId: 'user-1',
      userLabel: 'Camilo',
      claimedBy: null,
      claimedByLabel: null,
      assigneeId: null,
      assigneeLabel: null,
      claimedAt: null,
      priority: 'high',
      workflowStatus: 'triage',
      isOpen: true,
      slaState: 'warning',
      slaTargetMinutes: 30,
      slaDueAt: '2026-03-20T12:00:00.000Z',
      createdAt: '2026-03-20T09:00:00.000Z',
      updatedAt: '2026-03-20T09:30:00.000Z',
      resolvedAt: null,
      closedAt: null,
      lastActivityAt: '2026-03-20T09:30:00.000Z',
      firstResponseAt: null,
      lastCustomerMessageAt: '2026-03-20T09:20:00.000Z',
      lastStaffMessageAt: null,
      messageCount: 4,
      staffMessageCount: 0,
      reopenCount: 0,
      tags: ['urgent'],
    },
  ],
  events: [],
  macros: [],
};

describe('insights helpers', () => {
  it('builds analytics cards with meaningful deltas', () => {
    const cards = getAnalyticsCards(metrics);

    expect(cards).toHaveLength(4);
    expect(cards[0].delta?.direction).toBe('up');
    expect(cards[2].tone).toBe('success');
  });

  it('builds a mixed timeline ordered from newest to oldest', () => {
    const items = getTimelineItems(
      [
        {
          id: 'event-1',
          guildId: 'guild-1',
          eventType: 'ticket_opened',
          title: 'Ticket opened',
          description: 'A new ticket was created.',
          metadata: {},
          createdAt: '2026-03-20T11:00:00.000Z',
        },
      ],
      mutations,
    );

    expect(items[0].id).toBe('event-event-1');
    expect(items[1].id).toBe('mutation-mutation-1');
  });

  it('builds overview insight with operational actions and support KPIs', () => {
    const config = { guildId: 'guild-1', ...defaultGuildConfig };
    const syncStatus = {
      ...defaultGuildSyncStatus,
      guildId: 'guild-1',
      bridgeStatus: 'healthy' as const,
    };
    const sectionStates = getDashboardSectionStates(config, guild, syncStatus, [], mutations);
    const checklist = getDashboardChecklist(guild, sectionStates, [], syncStatus);
    const quickActions = getDashboardQuickActions(sectionStates, checklist, syncStatus);
    const insight = getOverviewInsight(
      guild,
      config,
      metrics,
      mutations,
      [],
      syncStatus,
      workspace,
      sectionStates,
      checklist,
      quickActions,
    );

    expect(insight.kpis.find((item) => item.id === 'support')?.value).toBe('1');
    expect(insight.operationalActions.length).toBeGreaterThan(0);
  });
});
