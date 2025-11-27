// "use client";

// import ExperimentCard from "@/components/Dashboard/Experiments/ExperimentCards";
// import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
// import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
// import { getPhetSimulations } from "@/services/dashboard-service";
// import CourseFilter from "@/services/FilterButton";
// import { useUser } from "@/services/UserContext";
// import { useRouter } from "next/navigation";
// import { SetStateAction, useEffect, useState } from "react";
// import { FaFilter } from "react-icons/fa";

// // interface ExperimentResponse {
// //   launchId: string;
// //   subject: string;
// //   experimentName: string;
// //   mode: string;
// //   lastStep: number;
// //   startedAt: string;
// //   endedAt: string;
// // }

// interface ExperimentResponse {
//   id: string;
//   title: string;
//   simulationUrl: string;
//   thumbnailUrl: string;
//   topic: string;
//   description: string;
//   learningGoals: string;
//   gradeLevel: string;
//   standards: string;
//   keywords: string;
// }

// const statsConfig: StatCardData[] = [
//   {
//     title: "Average Grade",
//     value: "0%",
//     icon: "/images/icon/grad.svg",
//     trendIcon: "/images/icon/trend_up.svg",
//     percentageChange: "0%",
//     timeFrame: "from last month",
//   },
//   {
//     title: "Number of Experiments",
//     value: "0",
//     icon: "/images/icon/test-tube.svg",
//     trendIcon: "/images/icon/trend_up.svg",
//     percentageChange: "0%",
//     timeFrame: "from last month",
//   },
//   {
//     title: "Number of Attempts",
//     value: "0",
//     icon: "/images/icon/clipboard.svg",
//     trendIcon: "/images/icon/trend_up.svg",
//     percentageChange: "0%",
//     timeFrame: "from last month",
//   },
//   {
//     title: "Pre-Experiment Assessments",
//     value: "0",
//     icon: "/images/icon/beaker_01.svg",
//     trendIcon: "/images/icon/trend_up.svg",
//     percentageChange: "0%",
//     timeFrame: "from last month",
//   },
//   {
//     title: "Post-Experiment Assessments",
//     value: "0",
//     icon: "/images/icon/microscope.svg",
//     trendIcon: "/images/icon/trend_up.svg",
//     percentageChange: "0%",
//     timeFrame: "from last month",
//   },
// ];

// export default function DashboardExperimentsPage() {
//   const [experimentData, setExperimentData] = useState<ExperimentResponse[]>(
//     []
//   );
//   const { user, token } = useUser();
//   const firstName = user?.fullName?.split(" ")[0];
//   const filters = [
//     "All Experiments",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "Math",
//   ];
//   const [activeFilter, setActiveFilter] = useState(filters[0]);
//   const [classFilter, setClassFilter] = useState("allClasses");
//   const [fetchFilters, setFetchFilters] = useState({
//     topic: "",
//     gradeLevel: "",
//     search: "",
//   });
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(20);
//   const router = useRouter();

//   const description =
//     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates suscipit molestiae quos hic quod maiores, nihil nemo similique expedita provident neque possimus ea corrupti deserunt, accusantium quo soluta illum amet facere? Corrupti sunt consequuntur facilis, ab fuga, culpa id, fugiat quis aut nulla ratione eius? Fuga numquam magni quidem unde.";
//   const truncatedDesc = description.split(" ").slice(0, 15).join(" ") + "...";

//   //  The function to filter courses
//   //  const filteredCourses =
//   // activeFilter === "All Experiments"
//   //   ? courseData
//   //   : courseData.filter((course) => course.subject === activeFilter);

//   const handleFilterChange = (e: any) => {
//     setClassFilter(e.target.value);
//   };

//   useEffect(() => {
//     async function fetchExperiments() {
//       try {
//         const data = await getPhetSimulations(token, {
//           ...fetchFilters,
//           page,
//           pageSize,
//         });
//         setExperimentData(data.items);
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       }
//     }
//     fetchExperiments();
//   }, [user, token, fetchFilters, page, pageSize]);

//   const handleFetchFilterChange = (e: any) => {
//     setFetchFilters({ ...fetchFilters, [e.target.name]: e.target.value });
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const filteredSimulations = experimentData.filter((lab) => {
//     const subjectMatch =
//       activeFilter === "All Experiments" || lab.topic === activeFilter;
//     const classMatch =
//       classFilter === "allClasses" || lab.gradeLevel === classFilter;
//     return subjectMatch && classMatch;
//   });

//   const expStats: StatCardData[] = [
//     {
//       title: "Average Grade",
//       value: "0%",
//       icon: "/images/icon/grad.svg",
//       trendIcon: "/images/icon/trend_up.svg",
//       percentageChange: "0%",
//       timeFrame: "from last month",
//     },
//     {
//       title: "Number of Experiments",
//       value: `${experimentData.length}`,
//       icon: "/images/icon/test-tube.svg",
//       trendIcon: "/images/icon/trend_up.svg",
//       percentageChange: "0%",
//       timeFrame: "from last month",
//     },
//     {
//       title: "Number of Attempts",
//       value: "0",
//       icon: "/images/icon/clipboard.svg",
//       trendIcon: "/images/icon/trend_up.svg",
//       percentageChange: "0%",
//       timeFrame: "from last month",
//     },
//     {
//       title: "Pre-Experiment Assessments",
//       value: "0",
//       icon: "/images/icon/beaker_01.svg",
//       trendIcon: "/images/icon/trend_up.svg",
//       percentageChange: "0%",
//       timeFrame: "from last month",
//     },
//     {
//       title: "Post-Experiment Assessments",
//       value: "0",
//       icon: "/images/icon/microscope.svg",
//       trendIcon: "/images/icon/trend_up.svg",
//       percentageChange: "0%",
//       timeFrame: "from last month",
//     },
//   ];

//   return (
//     <div className="m-1">
//       <WelcomeBanner firstName={firstName ? firstName : ""} />
//       <StatCards stats={expStats} />
//       <div className="flex flex-wrap justify-end p-2">
//         {/* <div className="flex gap-2 items-center text-xs lg:text-sm p-2 rounded-md border border-gray-200 bg-white text-gray-500">
//           <FaFilter className="text-gray-600" />
//           <select
//             name="classFilter"
//             id="classFilter"
//             onChange={handleFilterChange}
//           >
//             <option value="allClasses">All Classes</option>
//             <option value="ss1">SS 1</option>
//             <option value="ss2">SS 2</option>
//             <option value="ss3">SS 3</option>
//           </select>
//         </div> */}

//         <form className="flex flex-wrap gap-3 items-center">
//           <input
//             className="p-2 text-xs lg:text-sm rounded-md border border-gray-200"
//             type="text"
//             name="search"
//             value={fetchFilters.search}
//             onChange={handleFetchFilterChange}
//             placeholder="Search Experiments"
//           />

//           <div className="flex gap-2 items-center text-xs lg:text-sm px-2 rounded-md border border-gray-200 bg-white text-gray-500">
//             <FaFilter className="text-gray-600" />
//             <select
//               name="topic"
//               value={fetchFilters.topic}
//               onChange={handleFetchFilterChange}
//               className="py-2"
//             >
//               <option value="">All Subjects</option>
//               <option value="Math">Math</option>
//               <option value="Physics">Physics</option>
//               <option value="Chemistry">Chemistry</option>
//               <option value="Biology">Biology</option>
//             </select>
//           </div>

//           <div className="flex gap-2 items-center text-xs lg:text-sm px-2 rounded-md border border-gray-200 bg-white text-gray-500">
//             <FaFilter className="text-gray-600" />
//             <select
//               name="gradeLevel"
//               value={fetchFilters.gradeLevel}
//               onChange={handleFetchFilterChange}
//               className="py-2"
//             >
//               <option value="">All Grade Levels</option>
//               <option value="Elementary">Elementary</option>
//               <option value="Middle-school">Middle School</option>
//               <option value="High-school">High School</option>
//               <option value="University">University</option>
//             </select>
//           </div>
//         </form>
//       </div>
//       {/* <CourseFilter
//         filters={filters}
//         activeFilter={activeFilter}
//         onFilterChange={setActiveFilter}
//       /> */}

//       <div className="flex flex-wrap gap-4 m-4">
//         {filteredSimulations.map((lab) => (
//           <ExperimentCard
//             key={lab.id}
//             lab={{
//               title: lab.title,
//               url: lab.simulationUrl,
//               description: lab.description,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import ExperimentCard from "@/components/Dashboard/Experiments/ExperimentCards";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { getPhetSimulations } from "@/services/dashboard-service";
import CourseFilter from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ExperimentResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  runnableResource: string;
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

export default function DashboardExperimentsPage() {
  const [experimentData, setExperimentData] = useState<ExperimentResponse[]>([]);
  const { user, token } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  
  const filters = ["All Experiments", "Physics", "Chemistry", "Biology", "Math", "Earth & Space"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  
  const [fetchFilters, setFetchFilters] = useState({
    physics: "",
    chemistry: "",
    biology: "",
    math: "",
    earthSpace: "",
    gradeLevel: "",
    search: "",
  });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
  const handleCourseFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setFetchFilters({
      ...fetchFilters,
      physics: filter === "Physics" ? "true" : "",
      chemistry: filter === "Chemistry" ? "true" : "",
      biology: filter === "Biology" ? "true" : "",
      math: filter === "Math" ? "true" : "",
      earthSpace: filter === "Earth & Space" ? "true" : "",
    });
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const expStats: StatCardData[] = [
    {
      title: "Average Grade",
      value: "0%",
      icon: "/images/icon/grad.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Number of Experiments",
      value: `${total}`,
      icon: "/images/icon/test-tube.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Number of Attempts",
      value: "0",
      icon: "/images/icon/clipboard.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Pre-Experiment Assessments",
      value: "0",
      icon: "/images/icon/beaker_01.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Post-Experiment Assessments",
      value: "0",
      icon: "/images/icon/microscope.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
  ];

  return (
    <div className="m-1">
      <WelcomeBanner firstName={firstName ? firstName : ""} />
      <StatCards stats={expStats} />
      
      <div className="flex justify-end p-2">
        <form className="flex gap-3 items-center">
          <input
            className="p-2 text-xs lg:text-sm rounded-md border border-gray-200"
            type="text"
            name="search"
            value={fetchFilters.search}
            onChange={handleFetchFilterChange}
            placeholder="Search experiments..."
          />

          {/* <div className="flex gap-2 items-center text-xs lg:text-sm p-2 rounded-md border border-gray-200 bg-white text-gray-500">
            <FaFilter className="text-gray-600" />
            <select
              name="gradeLevel"
              value={fetchFilters.gradeLevel}
              onChange={handleFetchFilterChange}
            >
              <option value="">All Grade Levels</option>
              <option value="Elementary">Elementary</option>
              <option value="Middle-school">Middle School</option>
              <option value="High-school">High School</option>
              <option value="University">University</option>
            </select>
          </div> */}
        </form>
      </div>

      {/* CourseFilter handles topic filtering */}
      <CourseFilter
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={handleCourseFilterChange}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Experiments Grid */}
      {!loading && experimentData.length > 0 && (
        <>
          <div className="flex flex-wrap gap-4 m-4">
            {experimentData.map((lab) => (
              <ExperimentCard
                key={lab.id}
                lab={{
                  title: lab.title,
                  url: lab.runnableResource,
                  description: lab.description,
                }}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 mt-6">
            {/* Results Info */}
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
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
                      ? "bg-blue-600 text-white border-blue-600"
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
        </>
      )}

      {/* Empty State */}
      {!loading && experimentData.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <p className="text-lg font-medium">No experiments found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}