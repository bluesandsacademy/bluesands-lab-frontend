"use client";
import TablePagination from "@/components/Admin/TablePagination";
import { normalizeCountry } from "@/services/globalAdminDashboardService";
import type { SchoolUser } from "@/services/schoolAdminDashboardService";
import { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";

type SortKey =
  | "fullName"
  | "email"
  | "phone"
  | "country"
  | "dateCreated"
  | "isEmailVerified";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "fullName", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "country", label: "Country" },
  { key: "dateCreated", label: "Joined" },
  { key: "isEmailVerified", label: "Status" },
];

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sortValue = (user: SchoolUser, key: SortKey): string | number => {
  if (key === "isEmailVerified") return user.isEmailVerified ? 1 : 0;
  if (key === "dateCreated") {
    const time = user.dateCreated ? new Date(user.dateCreated).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  if (key === "country") return normalizeCountry(user.country ?? "").toLowerCase();
  return (user[key] ?? "").toString().toLowerCase();
};

interface SchoolUserTableProps {
  users: SchoolUser[];
  isLoading?: boolean;
  /** Filters name, email and phone. */
  search?: string;
  /** Used in the empty state, e.g. "teachers". */
  label?: string;
  /** Opens the row's class-enrolment menu. */
  onOpenActions?: (user: SchoolUser) => void;
}

const SchoolUserTable = ({
  users,
  isLoading,
  search = "",
  label = "users",
  onOpenActions,
}: SchoolUserTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "fullName",
    direction: "asc",
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        (user.fullName ?? "").toLowerCase().includes(term) ||
        (user.email ?? "").toLowerCase().includes(term) ||
        (user.phone ?? "").toLowerCase().includes(term),
    );
  }, [users, search]);

  const sorted = useMemo(() => {
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const left = sortValue(a, sort.key);
      const right = sortValue(b, sort.key);
      if (left < right) return -1 * factor;
      if (left > right) return 1 * factor;
      return 0;
    });
  }, [filtered, sort]);

  // A narrowed result set can leave the current page out of range.
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sort.key !== column) return <FaSort className="text-gray-300" />;
    return sort.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const colSpan = COLUMNS.length + (onOpenActions ? 1 : 0);

  return (
    <div className="flex flex-col overflow-x-auto bg-white rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            {COLUMNS.map((column) => (
              <td key={column.key} className="p-2">
                <button
                  onClick={() => toggleSort(column.key)}
                  className="flex items-center gap-1 hover:text-gray-800"
                >
                  {column.label}
                  <SortIcon column={column.key} />
                </button>
              </td>
            ))}
            {onOpenActions && <td className="p-2">Action</td>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={colSpan}>
                Loading {label}…
              </td>
            </tr>
          ) : !paginated.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={colSpan}>
                {search.trim()
                  ? `No ${label} match this search`
                  : `No ${label} yet`}
              </td>
            </tr>
          ) : (
            paginated.map((user) => (
              <tr className="text-xs border-b border-b-gray-200" key={user.id}>
                <td className="p-2 font-medium text-gray-900">
                  {user.fullName || "—"}
                </td>
                <td className="p-2 break-all">{user.email || "—"}</td>
                {/* Phone is absent on most records. */}
                <td className="p-2">{user.phone || "—"}</td>
                <td className="p-2">
                  {user.country ? normalizeCountry(user.country) : "—"}
                </td>
                <td className="p-2">{formatDate(user.dateCreated)}</td>
                <td className="p-2">
                  <p
                    className={`flex w-max p-0.5 px-2 items-center justify-center rounded-md ${
                      user.isEmailVerified
                        ? "bg-green-200 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.isEmailVerified ? "Verified" : "Unverified"}
                  </p>
                </td>
                {onOpenActions && (
                  <td className="p-2">
                    <button
                      onClick={() => onOpenActions(user)}
                      aria-label={`Actions for ${user.fullName || user.email}`}
                      className="flex gap-1 items-center p-1 rounded hover:bg-gray-100"
                    >
                      <SlOptionsVertical />
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={sorted.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
        label={label}
      />
    </div>
  );
};

export default SchoolUserTable;
