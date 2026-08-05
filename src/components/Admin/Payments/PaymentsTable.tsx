"use client";
import type { BillingPayment } from "@/services/globalAdminDashboardService";
import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

type SortKey =
  | "reference"
  | "schoolName"
  | "total"
  | "provider"
  | "status"
  | "dateCreated";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "reference", label: "ID" },
  { key: "schoolName", label: "Payer" },
  { key: "total", label: "Amount" },
  { key: "provider", label: "Gateway" },
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
    ? `${currency || "NGN"} ${amount.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`
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

interface PaymentsTableProps {
  payments: BillingPayment[];
  isLoading?: boolean;
  /** schoolId → subscription end date, used for the Next Payment column. */
  nextPaymentBySchool: Record<string, string>;
}

const PaymentsTable = ({
  payments,
  isLoading,
  nextPaymentBySchool,
}: PaymentsTableProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "dateCreated",
    direction: "desc",
  });

  const sorted = useMemo(() => {
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...payments].sort((a, b) => {
      const left = sortValue(a, sort.key);
      const right = sortValue(b, sort.key);
      if (left < right) return -1 * factor;
      if (left > right) return 1 * factor;
      return 0;
    });
  }, [payments, sort]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [payments]);

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
            <td className="p-2">Next Payment</td>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={7}>
                Loading payments…
              </td>
            </tr>
          ) : !paginated.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={7}>
                No payments recorded
              </td>
            </tr>
          ) : (
            paginated.map((row) => (
              <tr className="text-xs border-b border-b-gray-200" key={row.id}>
                <td className="p-2 text-gray-500 break-all">
                  {row.reference || "—"}
                </td>
                {/* Payments with the all-zero schoolId aren't tied to a school. */}
                <td className="p-2">{row.schoolName || "Individual"}</td>
                <td className="p-2">
                  <p>{formatAmount(row.total, row.currency)}</p>
                  {!!row.vat && (
                    <p className="text-gray-400">
                      incl. VAT {formatAmount(row.vat, row.currency)}
                    </p>
                  )}
                </td>
                <td className="p-2 capitalize">{row.provider || "—"}</td>
                <td className="p-2">
                  <p
                    className={`p-1 px-1.5 rounded-3xl flex w-max ${statusStyle(row.status)}`}
                  >
                    {row.status || "—"}
                  </p>
                </td>
                <td className="p-2">{formatDate(row.dateCreated)}</td>
                <td className="p-2">
                  {formatDate(nextPaymentBySchool[row.schoolId])}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-2 p-3 text-xs">
        <span className="text-gray-600">
          Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTable;
