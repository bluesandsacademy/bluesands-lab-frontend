"use client";
import type { BillingPayment } from "@/services/globalAdminDashboardService";
import { useEffect, useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";

type SortKey =
  | "schoolName"
  | "reference"
  | "provider"
  | "total"
  | "status"
  | "dateCreated";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "schoolName", label: "School" },
  { key: "reference", label: "Reference" },
  { key: "provider", label: "Provider" },
  { key: "total", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "dateCreated", label: "Date" },
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

const formatAmount = (amount?: number, currency?: string) =>
  typeof amount === "number" && Number.isFinite(amount)
    ? `${currency || "NGN"} ${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
    : "—";

const statusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-600";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
    case "cancelled":
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const sortValue = (row: BillingPayment, key: SortKey): string | number => {
  if (key === "total") return typeof row.total === "number" ? row.total : 0;
  if (key === "dateCreated") {
    const time = row.dateCreated ? new Date(row.dateCreated).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  return (row[key] ?? "").toString().toLowerCase();
};

interface PaymentTableProps {
  payments: BillingPayment[];
  isLoading?: boolean;
  search: string;
  statusFilter: string;
}

const PaymentTable = ({
  payments,
  isLoading,
  search,
  statusFilter,
}: PaymentTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "dateCreated",
    direction: "desc",
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return payments.filter((row) => {
      // Provider/status casing is inconsistent in the API, so compare lowercased.
      if (
        statusFilter !== "All Statuses" &&
        row.status?.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }
      if (!term) return true;
      return (
        (row.schoolName ?? "").toLowerCase().includes(term) ||
        (row.reference ?? "").toLowerCase().includes(term) ||
        (row.provider ?? "").toLowerCase().includes(term)
      );
    });
  }, [payments, search, statusFilter]);

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

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize]);

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
              <td className="p-4 text-center text-gray-400" colSpan={6}>
                Loading payments…
              </td>
            </tr>
          ) : !paginated.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={6}>
                No payments match this search
              </td>
            </tr>
          ) : (
            paginated.map((row) => (
              <tr className="text-xs border-b border-b-gray-200" key={row.id}>
                {/* Payments not tied to a school come back with an empty name. */}
                <td className="p-2">{row.schoolName || "Individual"}</td>
                <td className="p-2 text-gray-500 break-all">
                  {row.reference || "—"}
                </td>
                <td className="p-2 capitalize">{row.provider || "—"}</td>
                <td className="p-2">
                  <p>{formatAmount(row.total, row.currency)}</p>
                  {!!row.vat && (
                    <p className="text-gray-400">
                      incl. VAT {formatAmount(row.vat, row.currency)}
                    </p>
                  )}
                </td>
                <td className="p-2">
                  <p
                    className={`p-1 px-1.5 rounded-3xl flex w-max ${statusStyle(row.status)}`}
                  >
                    {row.status || "—"}
                  </p>
                </td>
                <td className="p-2">{formatDate(row.dateCreated)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 mt-6">
        <div className="text-sm text-gray-600">
          Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} results
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="paymentPageSize" className="text-sm text-gray-600">
            Show:
          </label>
          <select
            id="paymentPageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="p-2 text-sm rounded-md border border-gray-200"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
