import type {
  GuildSyncStatus,
  TicketConversationEvent,
  TicketCustomerProfile,
  TicketInboxItem,
  TicketSlaState,
  TicketWorkflowStatus,
} from '../types';

export function getHealthLabel(syncStatus: GuildSyncStatus | null): string {
  if (!syncStatus) {
    return 'Sin telemetria';
  }

  switch (syncStatus.bridgeStatus) {
    case 'healthy':
      return 'Sincronizado';
    case 'degraded':
      return 'Con retraso';
    case 'error':
      return 'Con errores';
    default:
      return 'Desconocido';
  }
}

export function getTicketStatusLabel(status: TicketWorkflowStatus): string {
  switch (status) {
    case 'new':
      return 'Nuevo';
    case 'triage':
      return 'Triage';
    case 'waiting_user':
      return 'Esperando usuario';
    case 'waiting_staff':
      return 'Esperando staff';
    case 'escalated':
      return 'Escalado';
    case 'resolved':
      return 'Resuelto';
    case 'closed':
      return 'Cerrado';
    default:
      return status;
  }
}

export function getTicketQueueLabel(queueType: TicketInboxItem['queueType']): string {
  return queueType === 'community' ? 'Comunidad' : 'Soporte';
}

export function getTicketSlaLabel(slaState: TicketSlaState): string {
  switch (slaState) {
    case 'warning':
      return 'Por vencer';
    case 'breached':
      return 'Incumplido';
    case 'paused':
      return 'Pausado';
    case 'resolved':
      return 'Resuelto';
    default:
      return 'Saludable';
  }
}

export function formatMinutesLabel(minutes: number | null): string {
  if (!minutes || minutes <= 0) {
    return 'Sin SLA';
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

export function getTicketWorkspaceSummary(inbox: TicketInboxItem[]) {
  const open = inbox.filter((ticket) => ticket.isOpen);
  const breached = open.filter((ticket) => ticket.slaState === 'breached');
  const warning = open.filter((ticket) => ticket.slaState === 'warning');
  const claimed = open.filter((ticket) => Boolean(ticket.claimedBy));
  const resolved = inbox.filter((ticket) => ticket.workflowStatus === 'resolved');
  const queues = open.reduce<Record<'support' | 'community', number>>(
    (accumulator, ticket) => {
      accumulator[ticket.queueType] += 1;
      return accumulator;
    },
    {
      support: 0,
      community: 0,
    },
  );

  return {
    total: inbox.length,
    open: open.length,
    breached: breached.length,
    warning: warning.length,
    claimed: claimed.length,
    unclaimed: open.length - claimed.length,
    resolved: resolved.length,
    queues,
  };
}

export function getTicketEventsForTicket(
  events: TicketConversationEvent[],
  ticketId: string | null,
): TicketConversationEvent[] {
  if (!ticketId) {
    return [];
  }

  return events.filter((event) => event.ticketId === ticketId);
}

export function getCustomerProfileForTicket(
  inbox: TicketInboxItem[],
  ticket: TicketInboxItem | null,
): TicketCustomerProfile | null {
  if (!ticket) {
    return null;
  }

  const customerTickets = inbox
    .filter((entry) => entry.userId === ticket.userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return {
    userId: ticket.userId,
    displayLabel: ticket.userLabel ?? `Usuario ${ticket.userId}`,
    openTickets: customerTickets.filter((entry) => entry.isOpen).length,
    closedTickets: customerTickets.filter((entry) => !entry.isOpen).length,
    lastTicketAt: customerTickets[0]?.createdAt ?? null,
    recentTickets: customerTickets.slice(0, 6),
  };
}
