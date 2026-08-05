"use client";
import type { GlobalTicket } from "@/services/globalAdminDashboardService";
import { priorityStyle, statusStyle, timeAgo } from "./supportHelpers";

interface TicketListProps {
  tickets: GlobalTicket[];
  total: number;
  isLoading?: boolean;
  error?: string | null;
  selectedId?: string | null;
  onSelect: (ticket: GlobalTicket) => void;
  schoolNames: Record<string, string>;
  requesterLabels: Record<string, string>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNewTicket: () => void;
}

const TicketList = ({
  tickets,
  total,
  isLoading,
  error,
  selectedId,
  onSelect,
  schoolNames,
  requesterLabels,
  page,
  totalPages,
  onPageChange,
  onNewTicket,
}: TicketListProps) => {
  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Tickets</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {isLoading ? "Loading…" : `${total} result${total === 1 ? "" : "s"}`}
          </span>
          <button
            onClick={onNewTicket}
            className="rounded-md bg-bgBlue px-3 py-1.5 text-xs text-white"
          >
            New ticket
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="py-8 text-center text-xs text-gray-400">
            Loading tickets…
          </p>
        ) : !tickets.length ? (
          <p className="py-8 text-center text-xs text-gray-400">
            No tickets match these filters
          </p>
        ) : (
          tickets.map((ticket) => {
            const school = ticket.schoolId
              ? schoolNames[ticket.schoolId]
              : undefined;
            const requester = ticket.createdByUserId
              ? requesterLabels[ticket.createdByUserId]
              : undefined;
            // "School . Role . 2h ago" — drop the parts we can't resolve.
            const meta = [school, requester, timeAgo(ticket.dateCreated)]
              .filter(Boolean)
              .join(" · ");

            return (
              <button
                key={ticket.id}
                onClick={() => onSelect(ticket)}
                className={`flex items-start justify-between gap-3 rounded-lg border p-4 text-left transition-colors ${
                  selectedId === ticket.id
                    ? "border-bgBlue bg-blue-50/40"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 truncate">
                    {ticket.subject || "Untitled ticket"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{meta}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={`rounded-md px-2 py-1 text-xs ${priorityStyle(ticket.priority)}`}
                  >
                    {ticket.priority || "—"}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] ${statusStyle(ticket.status)}`}
                  >
                    {ticket.status || "—"}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isLoading}
            className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isLoading}
            className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketList;
