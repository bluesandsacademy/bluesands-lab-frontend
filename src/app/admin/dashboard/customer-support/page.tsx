"use client";
import NewTicketModal from "@/components/Admin/Support/NewTicketModal";
import TicketFilters, {
  EMPTY_FILTERS,
  type TicketFilterState,
} from "@/components/Admin/Support/TicketFilters";
import TicketList from "@/components/Admin/Support/TicketList";
import TicketPreview from "@/components/Admin/Support/TicketPreview";
import {
  ALL_PRIORITIES,
  ALL_SCHOOLS,
  ALL_STATUSES,
  EMPTY_GUID,
} from "@/components/Admin/Support/supportHelpers";
import {
  getAllGlobalBillingSubscriptions,
  getGlobalTicket,
  getGlobalTickets,
  getGlobalUser,
  getGlobalUsers,
  type GlobalTicket,
  type GlobalUser,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;
/** Keeps requester lookups bounded on a large ticket page. */
const MAX_REQUESTER_LOOKUPS = 25;

const GlobalAdminSupportPage = () => {
  const { user, token } = useUser();

  const [draftFilters, setDraftFilters] =
    useState<TicketFilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<TicketFilterState>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const [tickets, setTickets] = useState<GlobalTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<GlobalTicket | null>(
    null,
  );
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);

  const [schoolNames, setSchoolNames] = useState<Record<string, string>>({});
  const [requesterLabels, setRequesterLabels] = useState<
    Record<string, string>
  >({});
  const [assignees, setAssignees] = useState<GlobalUser[]>([]);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const fetchTickets = useCallback(async () => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await getGlobalTickets(
        {
          page,
          pageSize: PAGE_SIZE,
          ...(appliedFilters.search && { q: appliedFilters.search }),
          ...(appliedFilters.status !== ALL_STATUSES && {
            status: appliedFilters.status,
          }),
          ...(appliedFilters.priority !== ALL_PRIORITIES && {
            priority: appliedFilters.priority,
          }),
          ...(appliedFilters.schoolId !== ALL_SCHOOLS && {
            schoolId: appliedFilters.schoolId,
          }),
        },
        token,
      );
      setTickets(result.items ?? []);
      setTotal(typeof result.total === "number" ? result.total : 0);
    } catch (err) {
      console.error("Failed to load tickets", err);
      setError("Could not load tickets. Please try again.");
      setTickets([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, token, page, appliedFilters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Schools come from subscriptions — there's no global schools endpoint yet.
  useEffect(() => {
    if (!user || !token) return;

    let cancelled = false;
    (async () => {
      const [subsRes, adminsRes] = await Promise.allSettled([
        getAllGlobalBillingSubscriptions(token),
        getGlobalUsers({ role: "GlobalAdmin", pageSize: 50 }, token),
      ]);
      if (cancelled) return;

      if (subsRes.status === "fulfilled") {
        const names: Record<string, string> = {};
        subsRes.value.forEach((sub) => {
          if (sub.schoolId && sub.schoolId !== EMPTY_GUID && sub.schoolName) {
            names[sub.schoolId] = sub.schoolName;
          }
        });
        setSchoolNames(names);
      }
      if (adminsRes.status === "fulfilled") {
        setAssignees(adminsRes.value.items ?? []);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, token]);

  // `createdByUserId` is an id; resolve it to "Name · Role" for the list meta.
  useEffect(() => {
    if (!token || !tickets.length) return;

    const unresolved = [
      ...new Set(tickets.map((t) => t.createdByUserId).filter(Boolean)),
    ]
      .filter((id): id is string => !!id && !requesterLabels[id])
      .slice(0, MAX_REQUESTER_LOOKUPS);

    if (!unresolved.length) return;

    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled(
        unresolved.map((id) => getGlobalUser(id, token)),
      );
      if (cancelled) return;

      const resolved: Record<string, string> = {};
      results.forEach((result, index) => {
        const id = unresolved[index];
        if (result.status === "fulfilled" && result.value) {
          const { fullName, email, roleName } = result.value;
          resolved[id] = [fullName || email, roleName]
            .filter(Boolean)
            .join(" · ");
        }
      });
      if (Object.keys(resolved).length) {
        setRequesterLabels((current) => ({ ...current, ...resolved }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tickets, token, requesterLabels]);

  const schools = useMemo(
    () =>
      Object.entries(schoolNames)
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [schoolNames],
  );

  /** The list rows may be summaries; refetch by id for the full record. */
  const handleSelectTicket = useCallback(
    async (ticket: GlobalTicket) => {
      setSelectedTicket(ticket);
      if (!token) return;

      setIsLoadingTicket(true);
      try {
        const detail = await getGlobalTicket(ticket.id, token);
        setSelectedTicket(detail ?? ticket);
      } catch (err) {
        console.error("Failed to load ticket detail", err);
        // Keep the list row on screen rather than blanking the panel.
      } finally {
        setIsLoadingTicket(false);
      }
    },
    [token],
  );

  const handleTicketChanged = useCallback(() => {
    fetchTickets();
    if (selectedTicket) handleSelectTicket(selectedTicket);
  }, [fetchTickets, selectedTicket, handleSelectTicket]);

  const handleTicketDeleted = useCallback(() => {
    setSelectedTicket(null);
    fetchTickets();
  }, [fetchTickets]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-2 md:p-3 lg:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1.4fr)] gap-3 lg:gap-4 items-start">
        <TicketFilters
          value={draftFilters}
          onChange={setDraftFilters}
          onApply={() => {
            setPage(1);
            setAppliedFilters(draftFilters);
          }}
          onClear={() => {
            setPage(1);
            setDraftFilters(EMPTY_FILTERS);
            setAppliedFilters(EMPTY_FILTERS);
          }}
          schools={schools}
          isLoading={isLoading}
        />

        <TicketList
          tickets={tickets}
          total={total}
          isLoading={isLoading}
          error={error}
          selectedId={selectedTicket?.id}
          onSelect={handleSelectTicket}
          schoolNames={schoolNames}
          requesterLabels={requesterLabels}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onNewTicket={() => setIsNewTicketOpen(true)}
        />

        <TicketPreview
          ticket={selectedTicket}
          isLoading={isLoadingTicket && !selectedTicket}
          schoolNames={schoolNames}
          requesterLabels={requesterLabels}
          assignees={assignees}
          onTicketChanged={handleTicketChanged}
          onTicketDeleted={handleTicketDeleted}
        />
      </div>

      {isNewTicketOpen && (
        <NewTicketModal
          schools={schools}
          onClose={() => setIsNewTicketOpen(false)}
          onCreated={fetchTickets}
        />
      )}
    </div>
  );
};

export default GlobalAdminSupportPage;
