"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const MAX_PAGES_SHOWN = 5;

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  /** Disables navigation while a fetch is in flight. */
  isLoading?: boolean;
  /** Noun used in the results line, e.g. "users". */
  label?: string;
}

const TablePagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  isLoading,
  label = "results",
}: TablePaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // A sliding window around the current page, clamped to the ends.
  const pageNumbers = () => {
    const pages: number[] = [];
    if (totalPages <= MAX_PAGES_SHOWN) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, page + 2);
    if (page <= 3) endPage = MAX_PAGES_SHOWN;
    else if (page >= totalPages - 2) startPage = totalPages - MAX_PAGES_SHOWN + 1;

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
      <div className="text-sm text-gray-600">
        Showing {total === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
        {Math.min(page * pageSize, total)} of {total.toLocaleString("en-NG")}{" "}
        {label}
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="tablePageSize" className="text-sm text-gray-600">
          Show:
        </label>
        <select
          id="tablePageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isLoading}
          className="p-2 text-sm rounded-md border border-gray-200"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || isLoading}
          aria-label="Previous page"
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>

        {page > 3 && totalPages > MAX_PAGES_SHOWN && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              disabled={isLoading}
              className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
            >
              1
            </button>
            <span className="px-2">...</span>
          </>
        )}

        {pageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md border ${
              pageNum === page
                ? "bg-[#303C48] text-white border-[#303C48]"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {page < totalPages - 2 && totalPages > MAX_PAGES_SHOWN && (
          <>
            <span className="px-2">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={isLoading}
              className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
          aria-label="Next page"
          className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
