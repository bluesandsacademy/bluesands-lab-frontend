"use client";
import type { GlobalUser } from "@/services/globalAdminDashboardService";
import { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import TablePagination from "../TablePagination";

type SortKey = "schoolName" | "fullName" | "email" | "isActive" | "dateCreated";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "schoolName", label: "School" },
  { key: "fullName", label: "School Admin" },
  { key: "email", label: "Email" },
  { key: "isActive", label: "Status" },
  { key: "dateCreated", label: "Created" },
];

const PLACEHOLDER = "-";

const formatDate = (value?: string) => {
  if (!value) return PLACEHOLDER;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isSchoolAdmin = (user: GlobalUser) =>
  user.roleName?.replace(/\s+/g, "").toLowerCase() === "schooladmin";

const sortValue = (user: GlobalUser, key: SortKey): string | number => {
  if (key === "isActive") return user.isActive ? 1 : 0;
  if (key === "dateCreated") {
    const time = user.dateCreated ? new Date(user.dateCreated).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  return (user[key] ?? "").toString().toLowerCase();
};

interface SchoolTableProps {
  users: GlobalUser[];
  isLoading?: boolean;
  search: string;
  statusFilter: string;
}

const SchoolTable = ({
  users,
  isLoading,
  search,
  statusFilter,
}: SchoolTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "schoolName",
    direction: "asc",
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      if (!isSchoolAdmin(user)) return false;
      if (statusFilter === "Active" && !user.isActive) return false;
      if (statusFilter === "Inactive" && user.isActive) return false;
      if (!term) return true;

      return (
        (user.schoolName ?? "").toLowerCase().includes(term) ||
        (user.fullName ?? "").toLowerCase().includes(term) ||
        (user.email ?? "").toLowerCase().includes(term)
      );
    });
  }, [users, search, statusFilter]);

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

  const total = sorted.length;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize]);

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

  return (
    <div className="flex flex-col overflow-x-auto">
      <table className="w-full bg-white rounded-md">
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
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={5}>
                Loading schools...
              </td>
            </tr>
          ) : !paginated.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={5}>
                No schools match this search
              </td>
            </tr>
          ) : (
            paginated.map((user) => (
              <tr className="text-xs border-b border-b-gray-200" key={user.id}>
                <td className="p-2">{user.schoolName || PLACEHOLDER}</td>
                <td className="p-2">{user.fullName || PLACEHOLDER}</td>
                <td className="p-2 text-gray-500">{user.email || PLACEHOLDER}</td>
                <td className="p-2">
                  <p
                    className={`p-1 px-1.5 rounded-3xl flex w-max ${
                      user.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </p>
                </td>
                <td className="p-2">{formatDate(user.dateCreated)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
        label="schools"
      />
    </div>
  );
};

export default SchoolTable;
