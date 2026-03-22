import { FilterX, Search } from 'lucide-react';
import FilterField from './FilterField';
import type {
  AssignmentFilter,
  OpenStateFilter,
  PriorityFilter,
  SlaFilter,
} from './inboxTypes';

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface InboxFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  openStateFilter: OpenStateFilter;
  onOpenStateFilterChange: (value: OpenStateFilter) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  slaFilter: SlaFilter;
  onSlaFilterChange: (value: SlaFilter) => void;
  assignmentFilter: AssignmentFilter;
  onAssignmentFilterChange: (value: AssignmentFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  openStateOptions: SelectOption<OpenStateFilter>[];
  priorityOptions: SelectOption<PriorityFilter>[];
  slaOptions: SelectOption<SlaFilter>[];
  assignmentOptions: SelectOption<AssignmentFilter>[];
  categoryOptions: Array<{ value: string; label: string }>;
  activeFiltersCount: number;
  onClearFilters: () => void;
  resultsLabel: string;
  supportLabel: string;
  communityLabel: string;
  clearFiltersLabel: string;
  searchLabel: string;
  searchPlaceholder: string;
  openStateLabel: string;
  priorityLabel: string;
  slaLabel: string;
  assignmentLabel: string;
  categoryLabel: string;
  allCategoriesLabel: string;
}

export default function InboxFilters(props: InboxFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterField label={props.searchLabel} htmlFor="ticket-search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="ticket-search"
            value={props.search}
            onChange={(event) => props.onSearchChange(event.target.value)}
            placeholder={props.searchPlaceholder}
            className="dashboard-form-field pl-11"
          />
        </div>
      </FilterField>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        <FilterField label={props.openStateLabel} htmlFor="open-state-filter">
          <select id="open-state-filter" value={props.openStateFilter} onChange={(event) => props.onOpenStateFilterChange(event.target.value as OpenStateFilter)} className="dashboard-form-field">
            {props.openStateOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FilterField>
        <FilterField label={props.priorityLabel} htmlFor="priority-filter">
          <select id="priority-filter" value={props.priorityFilter} onChange={(event) => props.onPriorityFilterChange(event.target.value as PriorityFilter)} className="dashboard-form-field">
            {props.priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FilterField>
        <FilterField label={props.slaLabel} htmlFor="sla-filter">
          <select id="sla-filter" value={props.slaFilter} onChange={(event) => props.onSlaFilterChange(event.target.value as SlaFilter)} className="dashboard-form-field">
            {props.slaOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FilterField>
        <FilterField label={props.assignmentLabel} htmlFor="assignment-filter">
          <select id="assignment-filter" value={props.assignmentFilter} onChange={(event) => props.onAssignmentFilterChange(event.target.value as AssignmentFilter)} className="dashboard-form-field">
            {props.assignmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FilterField>
        <FilterField label={props.categoryLabel} htmlFor="category-filter">
          <select id="category-filter" value={props.categoryFilter} onChange={(event) => props.onCategoryFilterChange(event.target.value)} className="dashboard-form-field md:col-span-2 xl:col-span-1 2xl:col-span-2">
            <option value="all">{props.allCategoriesLabel}</option>
            {props.categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FilterField>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{props.resultsLabel}</span>
        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{props.supportLabel}</span>
        <span className="dashboard-status-pill-compact dashboard-neutral-pill">{props.communityLabel}</span>
        {props.activeFiltersCount ? (
          <button type="button" onClick={props.onClearFilters} className="dashboard-secondary-button">
            <FilterX className="h-4 w-4" />
            {props.clearFiltersLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
