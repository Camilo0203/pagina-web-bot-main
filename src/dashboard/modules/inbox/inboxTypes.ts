import type { TicketDashboardActionId, TicketInboxItem } from '../../types';
import type { useTranslation } from 'react-i18next';

export type OpenStateFilter = 'all' | 'open' | 'closed';
export type PriorityFilter = TicketInboxItem['priority'] | 'all';
export type SlaFilter = TicketInboxItem['slaState'] | 'all';
export type AssignmentFilter = 'all' | 'claimed' | 'unclaimed' | 'assigned' | 'unassigned';
export type ActionFeedbackTone = 'success' | 'error' | 'pending';

export interface ActionFeedback {
  tone: ActionFeedbackTone;
  message: string;
  action: TicketDashboardActionId;
  ticketId: string;
}

export type T = ReturnType<typeof useTranslation>['t'];
