"use client";
import {
  getGlobalUsers,
  type GlobalUser,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useCallback, useEffect, useState } from "react";
import TablePagination from "../TablePagination";
import UserTable from "./UserTable";

const DEFAULT_PAGE_SIZE = 20;

/** Dropdown label → the `role` query value the API filters on. */
export const ROLE_FILTERS: { label: string; value?: string }[] = [
  { label: "All Users", value: undefined },
  { label: "Students", value: "Student" },
  { label: "Teachers", value: "Teacher" },
  { label: "School Admins", value: "SchoolAdmin" },
  { label: "Global Admins", value: "GlobalAdmin" },
];

export const roleValueFor = (label: string) =>
  ROLE_FILTERS.find((r) => r.label === label)?.value;

interface UsersPanelProps {
  /** Raw search text; debounced here so keystrokes don't each cost a request. */
  search: string;
  /** The API `role` value, or undefined for all roles. */
  role?: string;
}

const UsersPanel = ({ search, role }: UsersPanelProps) => {
  const { user, token } = useUser();

  const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [users, setUsers] = useState<GlobalUser[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // A narrowed result set has fewer pages; page 7 of the old query is meaningless.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, pageSize]);

  const fetchUsers = useCallback(async () => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await getGlobalUsers(
        {
          page,
          pageSize,
          ...(debouncedSearch && { q: debouncedSearch }),
          ...(role && { role }),
        },
        token,
      );
      setUsers(result.items ?? []);
      setTotal(typeof result.total === "number" ? result.total : 0);
    } catch (err) {
      console.error("Failed to load users", err);
      setError("Could not load users. Please try again.");
      setUsers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, token, page, pageSize, debouncedSearch, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <UserTable users={users} isLoading={isLoading} onUserChanged={fetchUsers} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
        label="users"
      />
    </div>
  );
};

export default UsersPanel;
