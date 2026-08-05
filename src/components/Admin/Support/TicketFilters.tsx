"use client";
import {
  ALL_PRIORITIES,
  ALL_SCHOOLS,
  ALL_STATUSES,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "./supportHelpers";

export interface TicketFilterState {
  search: string;
  schoolId: string;
  priority: string;
  status: string;
}

export const EMPTY_FILTERS: TicketFilterState = {
  search: "",
  schoolId: ALL_SCHOOLS,
  priority: ALL_PRIORITIES,
  status: ALL_STATUSES,
};

interface TicketFiltersProps {
  /** Draft values — only pushed to the query when Apply is pressed. */
  value: TicketFilterState;
  onChange: (next: TicketFilterState) => void;
  onApply: () => void;
  onClear: () => void;
  schools: { id: string; name: string }[];
  isLoading?: boolean;
}

const selectClass =
  "w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-700";

const TicketFilters = ({
  value,
  onChange,
  onApply,
  onClear,
  schools,
  isLoading,
}: TicketFiltersProps) => {
  const set = (patch: Partial<TicketFilterState>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-5">
      <h2 className="text-xl font-semibold text-gray-900">Filters</h2>

      <input
        type="search"
        value={value.search}
        onChange={(e) => set({ search: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onApply()}
        placeholder="Search tickets..."
        className={selectClass}
      />

      <select
        value={value.schoolId}
        onChange={(e) => set({ schoolId: e.target.value })}
        aria-label="School"
        className={selectClass}
      >
        <option value={ALL_SCHOOLS}>{ALL_SCHOOLS}</option>
        {schools.map((school) => (
          <option key={school.id} value={school.id}>
            {school.name}
          </option>
        ))}
      </select>

      <select
        value={value.priority}
        onChange={(e) => set({ priority: e.target.value })}
        aria-label="Priority"
        className={selectClass}
      >
        <option value={ALL_PRIORITIES}>All Priorities</option>
        {PRIORITY_OPTIONS.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>

      <select
        value={value.status}
        onChange={(e) => set({ status: e.target.value })}
        aria-label="Status"
        className={selectClass}
      >
        <option value={ALL_STATUSES}>Status: All</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button
        onClick={onApply}
        disabled={isLoading}
        className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50"
      >
        {isLoading ? "Loading…" : "Apply"}
      </button>

      <button
        onClick={onClear}
        className="text-xs text-gray-500 hover:text-gray-700"
      >
        Clear
      </button>
    </div>
  );
};

export default TicketFilters;
