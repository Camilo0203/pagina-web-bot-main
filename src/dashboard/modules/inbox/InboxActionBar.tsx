import { UserRoundCheck } from 'lucide-react';
import type { TicketDashboardActionId, TicketInboxItem } from '../../types';

interface InboxActionBarProps {
  ticket: TicketInboxItem;
  isMutating: boolean;
  labels: {
    claim: string;
    unclaim: string;
    assignSelf: string;
    unassign: string;
  };
  onAction: (action: TicketDashboardActionId) => void;
}

export default function InboxActionBar({
  ticket,
  isMutating,
  labels,
  onAction,
}: InboxActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onAction('claim')} disabled={isMutating || Boolean(ticket.claimedBy)} className="dashboard-primary-button">
        <UserRoundCheck className="h-4 w-4" />
        {labels.claim}
      </button>
      <button type="button" onClick={() => onAction('unclaim')} disabled={isMutating || !ticket.claimedBy} className="dashboard-secondary-button">{labels.unclaim}</button>
      <button type="button" onClick={() => onAction('assign_self')} disabled={isMutating || Boolean(ticket.assigneeId)} className="dashboard-secondary-button">{labels.assignSelf}</button>
      <button type="button" onClick={() => onAction('unassign')} disabled={isMutating || !ticket.assigneeId} className="dashboard-secondary-button">{labels.unassign}</button>
    </div>
  );
}
