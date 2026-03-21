import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  FilterX,
  LifeBuoy,
  MessageSquareText,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Tags,
  UserRoundCheck,
  XCircle,
} from 'lucide-react';
import PanelCard from '../components/PanelCard';
import DashboardDegradationNotice from '../components/DashboardDegradationNotice';
import SectionMutationBanner from '../components/SectionMutationBanner';
import { useTranslation } from 'react-i18next';
import StateCard from '../components/StateCard';
import ModuleEmptyState from '../components/ModuleEmptyState';
import { fadeInVariants, panelSwapVariants, staggerContainerVariants } from '../motion';
import type {
  DashboardGuild,
  DashboardPartialFailure,
  GuildConfigMutation,
  GuildSyncStatus,
  TicketDashboardActionId,
  TicketInboxItem,
  TicketWorkspaceSnapshot,
  TicketWorkflowStatus,
} from '../types';
import {
  formatDateTime,
  formatMinutesLabel,
  formatRelativeTime,
  getCustomerProfileForTicket,
  getTicketEventsForTicket,
  getTicketQueueLabel,
  getTicketSlaLabel,
  getTicketStatusLabel,
  getTicketWorkspaceSummary,
} from '../utils';
import type { ActionFeedback, AssignmentFilter, OpenStateFilter, PriorityFilter, SlaFilter } from './inbox/inboxTypes';
import {
  getActionLabel,
  getAssignmentOptions,
  getFeedbackClasses,
  getMacroVisibilityLabel,
  getOpenStateOptions,
  getPriorityLabel,
  getPriorityOptions,
  getPriorityTone,
  getSlaTone,
  getSlaOptions,
  getStatusTone,
  getVisibilityLabel,
  getWorkflowOptions,
  priorityWeight,
} from './inbox/inboxHelpers';
import FilterField from './inbox/FilterField';

interface InboxModuleProps {
  guild: DashboardGuild;
  workspace: TicketWorkspaceSnapshot;
  mutation: GuildConfigMutation | null;
  syncStatus: GuildSyncStatus | null;
  isMutating: boolean;
  onAction: (action: TicketDashboardActionId, payload: Record<string, unknown>) => Promise<void>;
  partialFailures: DashboardPartialFailure[];
}

function getFeedbackIcon(tone: ActionFeedback['tone']) {
  if (tone === 'error') return <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />;
  if (tone === 'success') return <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />;
  return <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0" />;
}

export default function InboxModule({
  guild,
  workspace,
  mutation,
  syncStatus,
  isMutating,
  onAction,
  partialFailures,
}: InboxModuleProps) {
  const { t } = useTranslation();
  const workflowOptions = useMemo(() => getWorkflowOptions(t), [t]);
  const openStateOptions = useMemo(() => getOpenStateOptions(t), [t]);
  const priorityOptions = useMemo(() => getPriorityOptions(t), [t]);
  const slaOptions = useMemo(() => getSlaOptions(t), [t]);
  const assignmentOptions = useMemo(() => getAssignmentOptions(t), [t]);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [openStateFilter, setOpenStateFilter] = useState<OpenStateFilter>('open');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [slaFilter, setSlaFilter] = useState<SlaFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');
  const [replyDraft, setReplyDraft] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState<TicketWorkflowStatus>('triage');
  const [priorityDraft, setPriorityDraft] = useState<TicketInboxItem['priority']>('normal');
  const [selectedMacroId, setSelectedMacroId] = useState('');
  const [macroConfirmed, setMacroConfirmed] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const lastDraftTicketIdRef = useRef<string | null>(null);

  const summary = useMemo(() => getTicketWorkspaceSummary(workspace.inbox), [workspace.inbox]);

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(workspace.inbox.map((ticket) => ticket.categoryLabel).filter(Boolean)))
        .sort((left, right) => left.localeCompare(right, 'es'))
        .map((label) => ({ value: label, label })),
    [workspace.inbox],
  );

  const filteredInbox = useMemo(() => {
    const query = search.trim().toLowerCase();

    return workspace.inbox
      .filter((ticket) => {
        if (openStateFilter === 'open') return ticket.isOpen;
        if (openStateFilter === 'closed') return !ticket.isOpen;
        return true;
      })
      .filter((ticket) => (priorityFilter === 'all' ? true : ticket.priority === priorityFilter))
      .filter((ticket) => (slaFilter === 'all' ? true : ticket.slaState === slaFilter))
      .filter((ticket) => (categoryFilter === 'all' ? true : ticket.categoryLabel === categoryFilter))
      .filter((ticket) => {
        if (assignmentFilter === 'claimed') return Boolean(ticket.claimedBy);
        if (assignmentFilter === 'unclaimed') return !ticket.claimedBy;
        if (assignmentFilter === 'assigned') return Boolean(ticket.assigneeId);
        if (assignmentFilter === 'unassigned') return !ticket.assigneeId;
        return true;
      })
      .filter((ticket) => {
        if (!query) {
          return true;
        }

        return [
          ticket.ticketId,
          ticket.categoryLabel,
          ticket.subject ?? '',
          ticket.userLabel ?? '',
          ticket.userId,
          ticket.claimedByLabel ?? '',
          ticket.assigneeLabel ?? '',
          ticket.tags.join(' '),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);
      })
      .sort((left, right) => {
        if (left.isOpen !== right.isOpen) return left.isOpen ? -1 : 1;
        if (left.slaState !== right.slaState) {
          if (left.slaState === 'breached') return -1;
          if (right.slaState === 'breached') return 1;
          if (left.slaState === 'warning') return -1;
          if (right.slaState === 'warning') return 1;
        }
        const priorityDelta = priorityWeight(right.priority) - priorityWeight(left.priority);
        if (priorityDelta !== 0) return priorityDelta;
        return (right.lastActivityAt ?? right.updatedAt).localeCompare(left.lastActivityAt ?? left.updatedAt);
      });
  }, [assignmentFilter, categoryFilter, openStateFilter, priorityFilter, search, slaFilter, workspace.inbox]);

  useEffect(() => {
    if (!filteredInbox.length) {
      setSelectedTicketId(null);
      return;
    }

    if (!selectedTicketId || !filteredInbox.some((ticket) => ticket.ticketId === selectedTicketId)) {
      setSelectedTicketId(filteredInbox[0].ticketId);
    }
  }, [filteredInbox, selectedTicketId]);

  const selectedTicket = useMemo(
    () => filteredInbox.find((ticket) => ticket.ticketId === selectedTicketId) ?? null,
    [filteredInbox, selectedTicketId],
  );

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }

    if (lastDraftTicketIdRef.current === selectedTicket.ticketId) {
      return;
    }

    lastDraftTicketIdRef.current = selectedTicket.ticketId;

    setStatusDraft(selectedTicket.workflowStatus);
    setPriorityDraft(selectedTicket.priority);
    setReplyDraft('');
    setNoteDraft('');
    setTagDraft('');
    setSelectedMacroId('');
    setMacroConfirmed(false);
    setActionFeedback(null);
  }, [selectedTicket]);

  useEffect(() => {
    setMacroConfirmed(false);
  }, [selectedMacroId]);

  const timeline = useMemo(
    () => getTicketEventsForTicket(workspace.events, selectedTicket?.ticketId ?? null),
    [selectedTicket?.ticketId, workspace.events],
  );

  const customerProfile = useMemo(
    () => getCustomerProfileForTicket(workspace.inbox, selectedTicket),
    [selectedTicket, workspace.inbox],
  );

  const selectedMacro = useMemo(
    () => workspace.macros.find((macro) => macro.macroId === selectedMacroId) ?? null,
    [selectedMacroId, workspace.macros],
  );

  const activeFiltersCount = [
    openStateFilter !== 'open',
    priorityFilter !== 'all',
    slaFilter !== 'all',
    categoryFilter !== 'all',
    assignmentFilter !== 'all',
    search.trim().length > 0,
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch('');
    setOpenStateFilter('open');
    setPriorityFilter('all');
    setSlaFilter('all');
    setCategoryFilter('all');
    setAssignmentFilter('all');
  }

  function moveSelection(direction: 1 | -1) {
    if (!filteredInbox.length) {
      return;
    }

    const currentIndex = filteredInbox.findIndex((ticket) => ticket.ticketId === selectedTicketId);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = Math.min(filteredInbox.length - 1, Math.max(0, safeIndex + direction));
    setSelectedTicketId(filteredInbox[nextIndex].ticketId);
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const tagName = target.tagName;

    if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveSelection(1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveSelection(-1);
    }
  }

  async function runAction(action: TicketDashboardActionId, payload: Record<string, unknown> = {}) {
    if (!selectedTicket) return;

    setActionFeedback({
      tone: 'pending',
      message: `Registrando la solicitud para ${getActionLabel(action, t)}...`,
      action,
      ticketId: selectedTicket.ticketId,
    });

    try {
      await onAction(action, {
        ticketId: selectedTicket.ticketId,
        channelId: selectedTicket.channelId,
        ...payload,
      });

      if (action === 'reply_customer' || action === 'post_macro') {
        setReplyDraft('');
        setSelectedMacroId('');
        setMacroConfirmed(false);
      }

      if (action === 'add_note') setNoteDraft('');
      if (action === 'add_tag') setTagDraft('');

      setActionFeedback({
        tone: 'success',
        message: `Solicitud enviada para ${getActionLabel(action, t)}. El inbox se actualizara en el siguiente refresh.`,
        action,
        ticketId: selectedTicket.ticketId,
      });
    } catch (error) {
      setActionFeedback({
        tone: 'error',
        message: error instanceof Error ? error.message : `No se pudo ${getActionLabel(action, t)}.`,
        action,
        ticketId: selectedTicket.ticketId,
      });
    }
  }

  if (!guild.botInstalled) {
    return <StateCard eyebrow={t('dashboard.inbox.install.eyebrow')} title={t('dashboard.inbox.install.title')} description={t('dashboard.inbox.install.desc')} icon={LifeBuoy} tone="warning" />;
  }

  if (!workspace.inbox.length) {
    return (
      <ModuleEmptyState
        icon={LifeBuoy}
        title={t('dashboard.inbox.empty.title')}
        description={t('dashboard.inbox.empty.desc')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DashboardDegradationNotice
        failures={partialFailures}
        title={t('dashboard.inbox.degraded')}
      />

      <PanelCard eyebrow={t('dashboard.inbox.workspace.eyebrow')} title={t('dashboard.inbox.workspace.title')} description={t('dashboard.inbox.workspace.desc')} variant="highlight">
        <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />
        <motion.div variants={staggerContainerVariants} initial="hidden" animate="show" className="dashboard-grid-fit-standard mt-8">
          {[
            [t('dashboard.inbox.workspace.kpi.open.label'), `${summary.open}`, t('dashboard.inbox.workspace.kpi.open.note')],
            [t('dashboard.inbox.workspace.kpi.unclaimed.label'), `${summary.unclaimed}`, t('dashboard.inbox.workspace.kpi.unclaimed.note')],
            [t('dashboard.inbox.workspace.kpi.breached.label'), `${summary.breached}`, t('dashboard.inbox.workspace.kpi.breached.note')],
            [t('dashboard.inbox.workspace.kpi.warning.label'), `${summary.warning}`, t('dashboard.inbox.workspace.kpi.warning.note')],
            [t('dashboard.inbox.workspace.kpi.resolved.label'), `${summary.resolved}`, t('dashboard.inbox.workspace.kpi.resolved.note')],
          ].map(([label, value, note]) => (
            <motion.article key={label} variants={fadeInVariants} className="dashboard-kpi-card min-w-0">
              <p className="dashboard-data-label">{label}</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.05em] text-slate-950 dark:text-white">{value}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{note}</p>
            </motion.article>
          ))}
        </motion.div>
      </PanelCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
        <PanelCard eyebrow={t('dashboard.inbox.list.eyebrow')} title={t('dashboard.inbox.list.title')} description={t('dashboard.inbox.list.desc')} variant="soft">
          <div className="space-y-4" onKeyDown={handleListKeyDown}>
            <FilterField label={t('dashboard.inbox.list.searchLabel')} htmlFor="ticket-search">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input id="ticket-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('dashboard.inbox.list.searchPlaceholder')} className="dashboard-form-field pl-11" />
              </div>
            </FilterField>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <FilterField label={t('dashboard.inbox.list.openState')} htmlFor="open-state-filter">
                <select id="open-state-filter" value={openStateFilter} onChange={(event) => setOpenStateFilter(event.target.value as OpenStateFilter)} className="dashboard-form-field">
                  {openStateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </FilterField>
              <FilterField label={t('dashboard.inbox.list.priority')} htmlFor="priority-filter">
                <select id="priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)} className="dashboard-form-field">
                  {priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </FilterField>
              <FilterField label={t('dashboard.inbox.list.sla')} htmlFor="sla-filter">
                <select id="sla-filter" value={slaFilter} onChange={(event) => setSlaFilter(event.target.value as SlaFilter)} className="dashboard-form-field">
                  {slaOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </FilterField>
              <FilterField label={t('dashboard.inbox.list.assignment')} htmlFor="assignment-filter">
                <select id="assignment-filter" value={assignmentFilter} onChange={(event) => setAssignmentFilter(event.target.value as AssignmentFilter)} className="dashboard-form-field">
                  {assignmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </FilterField>
              <FilterField label={t('dashboard.inbox.list.category')} htmlFor="category-filter">
                <select id="category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="dashboard-form-field md:col-span-2 xl:col-span-1 2xl:col-span-2">
                  <option value="all">{t('dashboard.inbox.filters.allCategories')}</option>
                  {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </FilterField>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.list.results', { count: filteredInbox.length })}</span>
              <span className="dashboard-status-pill-compact dashboard-neutral-pill">{summary.queues.support} {t('dashboard.inbox.list.support')}</span>
              <span className="dashboard-status-pill-compact dashboard-neutral-pill">{summary.queues.community} {t('dashboard.inbox.list.community')}</span>
              {activeFiltersCount ? (
                <button type="button" onClick={clearFilters} className="dashboard-secondary-button">
                  <FilterX className="h-4 w-4" />
                  {t('dashboard.inbox.list.clearFilters')}
                </button>
              ) : null}
            </div>

            {!filteredInbox.length ? (
              <div className="dashboard-empty-state">
                {t('dashboard.inbox.list.noResults')}
              </div>
            ) : (
              <motion.div variants={staggerContainerVariants} initial="hidden" animate="show" className="dashboard-scroll-panel space-y-3" tabIndex={0} aria-label="Resultados de tickets">
                {filteredInbox.map((ticket) => {
                  const active = selectedTicket?.ticketId === ticket.ticketId;
                  return (
                    <motion.button key={ticket.ticketId} type="button" variants={fadeInVariants} whileHover={{ y: -2 }} onClick={() => setSelectedTicketId(ticket.ticketId)} aria-pressed={active} className={`dashboard-interactive-card w-full rounded-[1.55rem] border p-4 text-left ${active ? 'border-brand-300/55 bg-[linear-gradient(135deg,rgba(88,101,242,0.12),rgba(20,184,166,0.06))] shadow-[0_18px_40px_rgba(88,101,242,0.12)] dark:border-brand-700/60 dark:bg-brand-950/18' : 'dashboard-data-card hover:border-brand-200/80 hover:bg-white/95 dark:hover:border-brand-800'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">{t('dashboard.inbox.list.ticketPrefix', { id: ticket.ticketId })}</p>
                          <p className="mt-2 break-words text-lg font-semibold text-slate-950 dark:text-white">{ticket.subject || ticket.categoryLabel}</p>
                          <p className="mt-2 break-words text-sm text-slate-700 dark:text-slate-300">{ticket.userLabel ?? ticket.userId}</p>
                        </div>
                        <div className="flex min-w-[7rem] flex-col items-end gap-2">
                          <span className={`dashboard-status-pill ${getStatusTone(ticket.workflowStatus)}`}>{getTicketStatusLabel(ticket.workflowStatus)}</span>
                          <span className={`dashboard-status-pill ${getSlaTone(ticket.slaState)}`}>{getTicketSlaLabel(ticket.slaState)}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{getTicketQueueLabel(ticket.queueType)}</span>
                        <span className={`dashboard-status-pill-compact ${getPriorityTone(ticket.priority)}`}>Prioridad {getPriorityLabel(ticket.priority, t)}</span>
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{ticket.claimedByLabel ?? t('dashboard.inbox.list.unclaimed')}</span>
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{ticket.assigneeLabel ?? t('dashboard.inbox.list.unassigned')}</span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span>{t('dashboard.inbox.list.messages', { count: ticket.messageCount })}</span>
                        <span>{t('dashboard.inbox.list.activity', { time: formatRelativeTime(ticket.lastActivityAt ?? ticket.updatedAt) })}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
        </PanelCard>

        {!selectedTicket ? (
          <StateCard eyebrow={t('dashboard.inbox.selection.eyebrow')} title={t('dashboard.inbox.selection.title')} description={t('dashboard.inbox.selection.desc')} icon={LifeBuoy} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={selectedTicket.ticketId} variants={panelSwapVariants} initial="hidden" animate="show" exit="exit" className="space-y-6">
              <PanelCard
                eyebrow={t('dashboard.inbox.detail.eyebrow')}
                title={`${selectedTicket.subject || selectedTicket.categoryLabel}`}
                description={t('dashboard.inbox.detail.desc', { id: selectedTicket.ticketId, user: selectedTicket.userLabel ?? selectedTicket.userId })}
                variant="highlight"
                stickyActions
                actions={
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => runAction('claim')} disabled={isMutating || Boolean(selectedTicket.claimedBy)} className="dashboard-primary-button">
                      <UserRoundCheck className="h-4 w-4" />
                      {t('dashboard.inbox.detail.actions.claim')}
                    </button>
                    <button type="button" onClick={() => runAction('unclaim')} disabled={isMutating || !selectedTicket.claimedBy} className="dashboard-secondary-button">{t('dashboard.inbox.detail.actions.unclaim')}</button>
                    <button type="button" onClick={() => runAction('assign_self')} disabled={isMutating || Boolean(selectedTicket.assigneeId)} className="dashboard-secondary-button">{t('dashboard.inbox.detail.actions.assignSelf')}</button>
                    <button type="button" onClick={() => runAction('unassign')} disabled={isMutating || !selectedTicket.assigneeId} className="dashboard-secondary-button">{t('dashboard.inbox.detail.actions.unassign')}</button>
                  </div>
                }
              >
                <SectionMutationBanner mutation={mutation} syncStatus={syncStatus} />

                {actionFeedback && actionFeedback.ticketId === selectedTicket.ticketId ? (
                  <div className={`mt-5 ${getFeedbackClasses(actionFeedback.tone)}`} role={actionFeedback.tone === 'error' ? 'alert' : 'status'} aria-live="polite">
                    {getFeedbackIcon(actionFeedback.tone)}
                    <p className="text-sm leading-6">{actionFeedback.message}</p>
                  </div>
                ) : null}

                {(syncStatus?.bridgeStatus === 'degraded' || syncStatus?.bridgeStatus === 'error') ? (
                  <div className="dashboard-action-note mt-5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p className="text-sm leading-6" dangerouslySetInnerHTML={{ __html: t('dashboard.inbox.detail.bridgeWarning', { status: syncStatus.bridgeStatus }) }} />
                  </div>
                ) : null}

                <div className="mt-8 grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                  <div className="space-y-6">
                    <div className="dashboard-grid-fit-standard">
                      {[
                        [t('dashboard.inbox.detail.attrs.status'), getTicketStatusLabel(selectedTicket.workflowStatus), getStatusTone(selectedTicket.workflowStatus), selectedTicket.isOpen ? t('dashboard.inbox.detail.attrs.statusActive') : t('dashboard.inbox.detail.attrs.statusInactive')],
                        [t('dashboard.inbox.detail.attrs.priority'), getPriorityLabel(selectedTicket.priority, t), getPriorityTone(selectedTicket.priority), t('dashboard.inbox.detail.attrs.priorityNote')],
                        [t('dashboard.inbox.detail.attrs.sla'), getTicketSlaLabel(selectedTicket.slaState), getSlaTone(selectedTicket.slaState), t('dashboard.inbox.detail.attrs.slaNote', { time: formatMinutesLabel(selectedTicket.slaTargetMinutes) })],
                        [t('dashboard.inbox.detail.attrs.category'), selectedTicket.categoryLabel, 'dashboard-neutral-pill', getTicketQueueLabel(selectedTicket.queueType)],
                      ].map(([label, value, tone, note]) => (
                        <article key={label} className="dashboard-data-card min-w-0">
                          <p className="dashboard-data-label">{label}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`dashboard-status-pill ${tone}`}>{value}</span>
                          </div>
                          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{note}</p>
                        </article>
                      ))}
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <div className="flex items-center gap-3">
                        <CircleUserRound className="h-4 w-4 text-brand-500" />
                        <div>
                          <p className="dashboard-panel-label">{t('dashboard.inbox.detail.customer.eyebrow')}</p>
                          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.customer.title')}</h3>
                        </div>
                      </div>

                      <div className="dashboard-grid-fit-standard mt-5">
                        {[
                          [t('dashboard.inbox.detail.customer.user'), selectedTicket.userLabel ?? selectedTicket.userId],
                          [t('dashboard.inbox.detail.customer.claimOwner'), selectedTicket.claimedByLabel ?? t('dashboard.inbox.list.unclaimed')],
                          [t('dashboard.inbox.detail.customer.assignee'), selectedTicket.assigneeLabel ?? t('dashboard.inbox.list.unassigned')],
                          [t('dashboard.inbox.detail.customer.firstResponse'), formatDateTime(selectedTicket.firstResponseAt)],
                          [t('dashboard.inbox.detail.customer.lastCustomer'), formatDateTime(selectedTicket.lastCustomerMessageAt)],
                          [t('dashboard.inbox.detail.customer.lastStaff'), formatDateTime(selectedTicket.lastStaffMessageAt)],
                          [t('dashboard.inbox.detail.customer.created'), formatDateTime(selectedTicket.createdAt)],
                          [t('dashboard.inbox.detail.customer.lastSync'), formatDateTime(selectedTicket.updatedAt)],
                        ].map(([label, value]) => (
                          <div key={label} className="dashboard-data-card">
                            <p className="dashboard-data-label">{label}</p>
                            <p className="dashboard-data-value break-words">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.customer.totalMessages', { count: selectedTicket.messageCount })}</span>
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.customer.staffMessages', { count: selectedTicket.staffMessageCount })}</span>
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.customer.reopens', { count: selectedTicket.reopenCount })}</span>
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.customer.slaDue', { time: formatDateTime(selectedTicket.slaDueAt) })}</span>
                      </div>
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="dashboard-panel-label">{t('dashboard.inbox.detail.timeline.eyebrow')}</p>
                          <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.timeline.title')}</h3>
                        </div>
                        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.timeline.eventsCount', { count: timeline.length })}</span>
                      </div>

                      <div className="dashboard-scroll-panel mt-5 space-y-3">
                        {timeline.length ? timeline.map((event) => (
                          <article key={event.id} className="dashboard-data-card">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="break-words font-semibold text-slate-950 dark:text-white">{event.title}</p>
                                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{event.description}</p>
                              </div>
                              <span className="dashboard-status-pill-compact dashboard-neutral-pill">{getVisibilityLabel(event.visibility, t)}</span>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                              <span>{event.actorLabel ?? t('dashboard.inbox.detail.timeline.systemActor')}</span>
                              <span>|</span>
                              <span>{formatDateTime(event.createdAt)}</span>
                            </div>
                          </article>
                        )) : <div className="dashboard-empty-state">{t('dashboard.inbox.detail.timeline.empty')}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <p className="dashboard-panel-label">{t('dashboard.inbox.detail.ops.eyebrow')}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.ops.statusTitle')}</h3>

                      <div className="mt-5 space-y-4">
                        <div className="grid gap-3">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.inbox.detail.ops.statusLabel')}</label>
                          <select value={statusDraft} onChange={(event) => setStatusDraft(event.target.value as TicketWorkflowStatus)} className="dashboard-form-field">
                            {workflowOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                          <button type="button" onClick={() => runAction('set_status', { workflowStatus: statusDraft })} disabled={isMutating || statusDraft === selectedTicket.workflowStatus} className="dashboard-primary-button">
                            <Clock3 className="h-4 w-4" />
                            {t('dashboard.inbox.detail.ops.applyStatus')}
                          </button>
                        </div>

                        <div className="grid gap-3">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('dashboard.inbox.detail.ops.priorityLabel')}</label>
                          <select value={priorityDraft} onChange={(event) => setPriorityDraft(event.target.value as TicketInboxItem['priority'])} className="dashboard-form-field">
                            {priorityOptions.filter((option) => option.value !== 'all').map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                          <button type="button" onClick={() => runAction('set_priority', { priority: priorityDraft })} disabled={isMutating || priorityDraft === selectedTicket.priority} className="dashboard-secondary-button">{t('dashboard.inbox.detail.ops.updatePriority')}</button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => runAction('reopen')} disabled={isMutating || selectedTicket.isOpen} className="dashboard-secondary-button">{t('dashboard.inbox.detail.ops.reopen')}</button>
                          <button type="button" onClick={() => runAction('close', { reason: t('dashboard.inbox.detail.ops.closeReason') })} disabled={isMutating || !selectedTicket.isOpen} className="dashboard-secondary-button">{t('dashboard.inbox.detail.ops.close')}</button>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <div className="flex items-center gap-3">
                        <Tags className="h-4 w-4 text-brand-500" />
                        <div>
                          <p className="dashboard-panel-label">{t('dashboard.inbox.detail.ops.tagsEyebrow')}</p>
                          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.ops.tagsTitle')}</h3>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedTicket.tags.length ? selectedTicket.tags.map((tag) => (
                          <button key={tag} type="button" onClick={() => runAction('remove_tag', { tag })} disabled={isMutating} className="dashboard-status-pill-compact dashboard-neutral-pill hover:border-rose-300 hover:text-rose-600" title={t('dashboard.inbox.detail.ops.removeTag', { tag })}>
                            {tag}
                          </button>
                        )) : <span className="text-sm text-slate-600 dark:text-slate-400">{t('dashboard.inbox.detail.ops.noTags')}</span>}
                      </div>

                      <div className="mt-4 flex flex-col gap-3">
                        <input
                          value={tagDraft}
                          onChange={(event) => setTagDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey && tagDraft.trim() && !isMutating) {
                              event.preventDefault();
                              void runAction('add_tag', { tag: tagDraft.trim() });
                            }
                          }}
                          placeholder={t('dashboard.inbox.detail.ops.tagPlaceholder')}
                          className="dashboard-form-field"
                        />
                        <button type="button" onClick={() => runAction('add_tag', { tag: tagDraft.trim() })} disabled={isMutating || !tagDraft.trim()} className="dashboard-primary-button">{t('dashboard.inbox.detail.ops.addTag')}</button>
                      </div>
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="h-4 w-4 text-brand-500" />
                        <div>
                          <p className="dashboard-panel-label">{t('dashboard.inbox.detail.ops.noteEyebrow')}</p>
                          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.ops.noteTitle')}</h3>
                        </div>
                      </div>
                      <textarea
                        value={noteDraft}
                        onChange={(event) => setNoteDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && noteDraft.trim() && !isMutating) {
                            event.preventDefault();
                            void runAction('add_note', { note: noteDraft.trim() });
                          }
                        }}
                        rows={5}
                        placeholder={t('dashboard.inbox.detail.ops.notePlaceholder')}
                        className="dashboard-form-field mt-4"
                      />
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('dashboard.inbox.detail.ops.shortcutHint')}</p>
                      <button type="button" onClick={() => runAction('add_note', { note: noteDraft.trim() })} disabled={isMutating || !noteDraft.trim()} className="dashboard-primary-button mt-4">{t('dashboard.inbox.detail.ops.saveNote')}</button>
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-brand-500" />
                        <div>
                          <p className="dashboard-panel-label">{t('dashboard.inbox.detail.ops.macrosEyebrow')}</p>
                          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.ops.macrosTitle')}</h3>
                        </div>
                      </div>

                      {workspace.macros.length ? (
                        <div className="mt-4 space-y-4">
                          <select value={selectedMacroId} onChange={(event) => setSelectedMacroId(event.target.value)} className="dashboard-form-field">
                            <option value="">{t('dashboard.inbox.detail.ops.selectMacro')}</option>
                            {workspace.macros.map((macro) => (
                              <option key={macro.macroId} value={macro.macroId}>
                                {macro.label}
                              </option>
                            ))}
                          </select>

                          {selectedMacro ? (
                            <>
                              <div className="dashboard-data-card">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="dashboard-status-pill-compact dashboard-neutral-pill">{selectedMacro.label}</span>
                                  <span className="dashboard-status-pill-compact dashboard-neutral-pill">{getMacroVisibilityLabel(selectedMacro, t)}</span>
                                  {selectedMacro.isSystem ? <span className="dashboard-status-pill-compact dashboard-neutral-pill">System</span> : null}
                                </div>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{selectedMacro.content}</p>
                              </div>

                              <label className="flex items-start gap-3 rounded-[1.2rem] border border-slate-200/70 bg-white/60 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                                <input type="checkbox" checked={macroConfirmed} onChange={(event) => setMacroConfirmed(event.target.checked)} className="mt-1" />
                                <span>{t('dashboard.inbox.detail.ops.macroConfirm')}</span>
                              </label>

                              <button type="button" onClick={() => runAction('post_macro', { macroId: selectedMacro.macroId })} disabled={isMutating || !macroConfirmed} className="dashboard-primary-button">
                                {t('dashboard.inbox.detail.ops.postMacro')}
                              </button>
                            </>
                          ) : <div className="dashboard-empty-state">{t('dashboard.inbox.detail.ops.macroEmptySelection')}</div>}
                        </div>
                      ) : <div className="dashboard-empty-state mt-4">{t('dashboard.inbox.detail.ops.noMacros')}</div>}
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <div className="flex items-center gap-3">
                        <MessageSquareText className="h-4 w-4 text-brand-500" />
                        <div>
                          <p className="dashboard-panel-label">{t('dashboard.inbox.detail.ops.replyEyebrow')}</p>
                          <h3 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.ops.replyTitle')}</h3>
                        </div>
                      </div>
                      <textarea
                        value={replyDraft}
                        onChange={(event) => setReplyDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && replyDraft.trim() && !isMutating) {
                            event.preventDefault();
                            void runAction('reply_customer', { message: replyDraft.trim() });
                          }
                        }}
                        rows={5}
                        placeholder={t('dashboard.inbox.detail.ops.replyPlaceholder')}
                        className="dashboard-form-field mt-4"
                      />
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t('dashboard.inbox.detail.ops.shortcutHint')}</p>
                      <button type="button" onClick={() => runAction('reply_customer', { message: replyDraft.trim() })} disabled={isMutating || !replyDraft.trim()} className="dashboard-primary-button mt-4">
                        <Send className="h-4 w-4" />
                        {t('dashboard.inbox.detail.ops.sendReply')}
                      </button>
                    </div>

                    <div className="dashboard-surface-soft rounded-[1.6rem] p-5">
                      <p className="dashboard-panel-label">{t('dashboard.inbox.detail.history.eyebrow')}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{t('dashboard.inbox.detail.history.title')}</h3>
                      {customerProfile ? (
                        <>
                          <div className="dashboard-grid-fit-standard mt-4">
                            <div className="dashboard-data-card">
                              <p className="dashboard-data-label">{t('dashboard.inbox.detail.history.client')}</p>
                              <p className="dashboard-data-value">{customerProfile.displayLabel}</p>
                            </div>
                            <div className="dashboard-data-card">
                              <p className="dashboard-data-label">{t('dashboard.inbox.detail.history.lastTicket')}</p>
                              <p className="dashboard-data-value">{formatDateTime(customerProfile.lastTicketAt)}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.history.openCount', { count: customerProfile.openTickets })}</span>
                            <span className="dashboard-status-pill-compact dashboard-neutral-pill">{t('dashboard.inbox.detail.history.closedCount', { count: customerProfile.closedTickets })}</span>
                          </div>

                          <div className="mt-5 space-y-3">
                            {customerProfile.recentTickets.map((ticket) => {
                              const isCurrent = ticket.ticketId === selectedTicket.ticketId;
                              return (
                                <button key={ticket.ticketId} type="button" onClick={() => setSelectedTicketId(ticket.ticketId)} disabled={isCurrent} className="dashboard-data-card w-full text-left disabled:cursor-default disabled:opacity-100">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <p className="font-semibold text-slate-950 dark:text-white">#{ticket.ticketId}</p>
                                      <p className="mt-2 break-words text-sm text-slate-700 dark:text-slate-300">{ticket.subject || ticket.categoryLabel}</p>
                                    </div>
                                    <span className={`dashboard-status-pill-compact ${getStatusTone(ticket.workflowStatus)}`}>{getTicketStatusLabel(ticket.workflowStatus)}</span>
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                                    <span>{formatDateTime(ticket.createdAt)}</span>
                                    {isCurrent ? <span>{t('dashboard.inbox.detail.history.currentTicket')}</span> : <span>{t('dashboard.inbox.detail.history.openDetail')}</span>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : <div className="dashboard-empty-state mt-4">{t('dashboard.inbox.detail.history.empty')}</div>}
                    </div>
                  </div>
                </div>
              </PanelCard>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
