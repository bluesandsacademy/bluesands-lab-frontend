import { useEffect, useState } from "react";
import TeacherExperimentCard from "./TeacherExperimentCard";
import { getPhetSimulations } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";
import { FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";

interface ExperimentResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  topic: string;
  description: string;
  learningGoals: string;
  lowGradeLevel: string;
  mainTopics: string;
  physics: boolean;
  chemistry: boolean;
  biology: boolean;
  math: boolean;
  earthSpace: boolean;
  keywords: string;
}

const AssignExperiments = () => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [fetchFilters, setFetchFilters] = useState({
    physics: "",
    chemistry: "",
    biology: "",
    math: "",
    earthSpace: "",
    gradeLevel: "",
    search: "",
  });
  const [experimentData, setExperimentData] = useState<ExperimentResponse[]>(
    []
  );
  const { token } = useUser();

  useEffect(() => {
    async function fetchExperiments() {
      setLoading(true);
      try {
        const data = await getPhetSimulations(token, {
          ...fetchFilters,
          page,
          pageSize,
        });
        setExperimentData(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error("Error fetching experiments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiments();
  }, [token, fetchFilters, page, pageSize]);

  const handleFetchFilterChange = (e: any) => {
    setFetchFilters({ ...fetchFilters, [e.target.name]: e.target.value });
    setPage(1); // Reset to page 1 when filters change
  };

  // Handle CourseFilter changes (Physics, Chemistry, Biology, Math, All Experiments)
  const handleCourseFilterChange = (e: any) => {
    setFetchFilters({
      ...fetchFilters,
      physics: e.target.value === "physics" ? "true" : "",
      chemistry: e.target.value === "chemistry" ? "true" : "",
      biology: e.target.value === "biology" ? "true" : "",
      math: e.target.value === "math" ? "true" : "",
      earthSpace: e.target.value === "earthSpace" ? "true" : "",
    });
    setPage(1);
    
  };

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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex p-2">
        <form className="flex flex-row-reverse justify-between w-full items-center">
          <input
            className="p-2 text-xs lg:text-sm rounded-md border border-gray-200"
            type="text"
            name="search"
            value={fetchFilters.search}
            onChange={handleFetchFilterChange}
            placeholder="Search experiments..."
          />

          <div className="flex gap-2 items-center text-xs lg:text-sm p-2 rounded-md border border-gray-200 bg-white text-gray-500">
            <FaFilter className="text-gray-600" />
            <select name="subject" onChange={handleCourseFilterChange}>
              <option value="">All Subjects</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="math">Math</option>
              <option value="earthSpace">Earth & Space</option>
            </select>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-3">
        {experimentData.map((lab) => (
          <TeacherExperimentCard
            key={lab.id}
            title={lab.title}
            gradeLevel={lab.lowGradeLevel}
          />
        ))}
      </div>

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

export default AssignExperiments;
