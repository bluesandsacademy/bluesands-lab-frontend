import page from "@/app/page";
import { globalSchoolsData } from "@/lib/schoolsdata";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SchoolTable = () => {
  const [total, setTotal] = useState(globalSchoolsData.length);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

     const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to page 1 when page size changes
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (page <= 3) {
        endPage = maxPagesToShow;
      } else if (page >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const paginatedData = globalSchoolsData.slice(
  (page - 1) * pageSize,
  page * pageSize
);

  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">School</td>
            <td className="p-2">Teachers</td>
            <td className="p-2">Students</td>
            <td className="p-2">Admin</td>
            <td className="p-2">Subscription</td>
            <td className="p-2">Status</td>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((school, index) => (
            <tr className="text-xs border-b border-b-gray-200" key={index}>
              <td className="p-2">{school.name}</td>
              <td className="p-2">{school.teachers}</td>
              <td className="p-2">{school.students}</td>
              <td className="p-2">-</td>
              <td className="p-2">
                <p className="p-1 px-1.5 rounded-3xl bg-blue-100 text-blue-600 flex w-max">
                  Basic
                </p>
              </td>
              <td className="p-2">
                <p className="p-1 px-1.5 rounded-3xl bg-green-100 text-green-600 flex w-max">
                  Active
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 mt-6">
              {/* Results Info */}
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, total)} of {total} results
              </div>
      
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-600">
                  Show:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="p-2 text-sm rounded-md border border-gray-200"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
      
              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft />
                </button>
      
                {/* First Page */}
                {page > 3 && totalPages > 5 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                    >
                      1
                    </button>
                    <span className="px-2">...</span>
                  </>
                )}
      
                {/* Page Numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border ${
                      pageNum === page
                        ? "bg-[#303C48] text-white border-[#303C48]"
                        : "border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
      
                {/* Last Page */}
                {page < totalPages - 2 && totalPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
      
                {/* Next Button */}
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

export default SchoolTable;
