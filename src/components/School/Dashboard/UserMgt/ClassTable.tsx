"use client";
import TablePagination from "@/components/Admin/TablePagination";
import type { SchoolClass } from "@/services/schoolAdminDashboardService";
import { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

type SortKey = "name" | "subject" | "students" | "myRole" | "createdAt";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Class Name" },
  { key: "subject", label: "Subject" },
  { key: "students", label: "No of Students" },
  { key: "myRole", label: "Your Role" },
  { key: "createdAt", label: "Created" },
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

const sortValue = (row: SchoolClass, key: SortKey): string | number => {
  if (key === "students")
    return typeof row.students === "number" ? row.students : 0;
  if (key === "createdAt") {
    const time = row.createdAt ? new Date(row.createdAt).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  return (row[key] ?? "").toString().toLowerCase();
};

interface SchoolClassTableProps {
  classes: SchoolClass[];
  isLoading?: boolean;
  /** Filters class name and subject. */
  search?: string;
}

const SchoolClassTable = ({
  classes,
  isLoading,
  search = "",
}: SchoolClassTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return classes;
    return classes.filter(
      (row) =>
        (row.name ?? "").toLowerCase().includes(term) ||
        (row.subject ?? "").toLowerCase().includes(term),
    );
  }, [classes, search]);

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
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={5}>
                Loading classes…
              </td>
            </tr>
          ) : !paginated.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={5}>
                {search.trim()
                  ? "No classes match this search"
                  : "No classes yet"}
              </td>
            </tr>
          ) : (
            paginated.map((row) => (
              <tr className="text-xs border-b border-b-gray-200" key={row.id}>
                <td className="p-2 font-medium text-gray-900">
                  {row.name || "—"}
                </td>
                <td className="p-2">{row.subject || "—"}</td>
                <td className="p-2">
                  {typeof row.students === "number"
                    ? row.students.toLocaleString("en-NG")
                    : "—"}
                </td>
                <td className="p-2">{row.myRole || "—"}</td>
                <td className="p-2">{formatDate(row.createdAt)}</td>
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
        label="classes"
      />
    </div>
  );
};

export default SchoolClassTable;
