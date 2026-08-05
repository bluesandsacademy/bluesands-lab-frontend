"use client";
import type { BillingSubscription } from "@/services/globalAdminDashboardService";
import { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import TablePagination from "../TablePagination";

type SortKey =
  | "schoolName"
  | "studentsCovered"
  | "pricePerStudent"
  | "endsAt"
  | "active";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "schoolName", label: "School" },
  { key: "studentsCovered", label: "Students Covered" },
  { key: "pricePerStudent", label: "Price / Student" },
  { key: "endsAt", label: "Subscription Ends" },
  { key: "active", label: "Status" },
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

const formatNaira = (amount?: number) =>
  typeof amount === "number" && Number.isFinite(amount)
    ? `NGN ${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
    : "—";

const sortValue = (row: BillingSubscription, key: SortKey): string | number => {
  if (key === "active") return row.active ? 1 : 0;
  if (key === "endsAt") {
    const time = row.endsAt ? new Date(row.endsAt).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  if (key === "studentsCovered" || key === "pricePerStudent") {
    return typeof row[key] === "number" ? row[key] : 0;
  }
  return (row[key] ?? "").toString().toLowerCase();
};

interface SchoolTableProps {
  subscriptions: BillingSubscription[];
  isLoading?: boolean;
  search: string;
  statusFilter: string;
}

const SchoolTable = ({
  subscriptions,
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
    return subscriptions.filter((row) => {
      if (statusFilter === "Active" && !row.active) return false;
      if (statusFilter === "Inactive" && row.active) return false;
      if (!term) return true;
      return (
        (row.schoolName ?? "").toLowerCase().includes(term) ||
        (row.lastPaymentReference ?? "").toLowerCase().includes(term)
      );
    });
  }, [subscriptions, search, statusFilter]);

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
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // A narrowed result set can leave the current page out of range.
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
            <td className="p-2">Last Payment Ref</td>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={6}>
                Loading schools…
              </td>
            </tr>
          ) : !paginated.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={6}>
                No schools match this search
              </td>
            </tr>
          ) : (
            paginated.map((row) => (
              <tr className="text-xs border-b border-b-gray-200" key={row.id}>
                <td className="p-2">{row.schoolName || "—"}</td>
                <td className="p-2">{row.studentsCovered ?? "—"}</td>
                <td className="p-2">{formatNaira(row.pricePerStudent)}</td>
                <td className="p-2">{formatDate(row.endsAt)}</td>
                <td className="p-2">
                  <p
                    className={`p-1 px-1.5 rounded-3xl flex w-max ${
                      row.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {row.active ? "Active" : "Inactive"}
                  </p>
                </td>
                <td className="p-2 text-gray-500">
                  {row.lastPaymentReference || "—"}
                </td>
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
