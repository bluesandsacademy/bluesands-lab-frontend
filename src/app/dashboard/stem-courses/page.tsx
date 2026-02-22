"use client";
import ExperimentCard from "@/components/Dashboard/Experiments/ExperimentCards";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import LearningSpace from "@/components/LearningSpace/LearningSpace";
import { useUser } from "@/services/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSolidEraser } from "react-icons/bi";
import { FaChevronRight } from "react-icons/fa";
import { IoMdStar } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";


interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: [];
}

const DashboardStemCoursesPage = () => {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  const description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates suscipit molestiae quos hic quod maiores, nihil nemo similique expedita provident neque possimus ea corrupti deserunt, accusantium quo soluta illum amet facere? Corrupti sunt consequuntur facilis, ab fuga, culpa id, fugiat quis aut nulla ratione eius? Fuga numquam magni quidem unde.";
  const truncatedDesc = description.split(" ").slice(0, 15).join(" ") + "...";

  const courseStats: StatCardData[] = [
    {
      title: "Stem Courses",
      value: "0",
      icon: "/images/icon/grad.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Course Experiments",
      value: "0",
      icon: "/images/icon/beaker_01.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Hours Spent",
      value: "0",
      icon: "/images/icon/stopwatch.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Average Grade",
      value: "0",
      icon: "/images/icon/chart.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
  ];
 
  const [isShowingPop, setIsShowingPop] = useState<boolean>(false);  
const [lesson, setLesson] = useState<Lesson | null>();
useEffect(() => {
   import("../../../components/LearningSpace/lessonData.json").then((mod) => setLesson(mod.default as Lesson));
  }, []);

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        Loading lesson...
      </div>
    );
  }



  const showSpacePopUp = () => {
    setIsShowingPop(true)
  }

  return (
    <div className="m-1">
      <WelcomeBanner firstName={firstName ? firstName : ""} />
      <StatCards stats={courseStats} />
      <div className="m-4 mt-6 lg:mt-12 flex flex-col md:flex-row flex-wrap gap-5">
        {/* <p className="text-sm lg:text-base font-semibold lg:ml-4">STEM Courses Coming Soon...</p>
        <div className="rounded-md overflow-hidden flex flex-col w-56 bg-white">
          <div className=" bg-blue-300 text-slate-700 py-16 w-full rounded-md flex items-center justify-center">
            {" "}
            Example Course
          </div>
          <div className="p-2 flex flex-col gap-3">
            <div className="flex justify-between text-xs items-center">
              <p className="p-0.5 px-1 bg-blue-200 rounded text-blue-600">
                Dummy Course
              </p>
              <strong className="text-blue-600">Price</strong>
            </div>
            <p className=" text-xs">
              {description.length < 16 ? description : truncatedDesc}
            </p>
            <div className="flex justify-between text-xs md:text-sm">
              <strong className="flex items-center">
                <IoMdStar className="text-bgBlue" />
                5.0
              </strong>
              <p>
                <strong>500k+ </strong>Students
              </p>
            </div>
            <div className="flex justify-between text-xs">
              <Link href="/dashboard/stem-courses/overview">
                <button className="p-1 px-3 rounded-md bg-bgBlue text-white flex gap-1">
                  <LuNotebookPen />
                  Enroll
                </button>
              </Link>

              <button className="p-1 px-3 rounded-md flex bg-blue-50 text-blue-600 hover:bg-blue-100 gap-1">
                <BiSolidEraser /> UnEnroll
              </button>
            </div>
          </div>
        </div> */}
        
         {/* // availableSpaces < 1 ? <p>No spaces available<p/> : <p>Available Spaces</p> */}
         <p className="font-semibold lg:text-lg">Available Learning Spaces</p>
        

         {/* Experiments Grid */}
      {/* {!loading && lesson.length > 0 && (
        <>
          <div className="flex flex-wrap gap-4 m-4">
            {lesson.map((lab) => (
              <ExperimentCard
                key={lab.id}
                lab={{
                  title: lab.title,
                  url: lab.runnableResource,
                  description: lab.description,
                }}
              />
            ))}
          </div> */}

              <ExperimentCard
                key={lesson.id}
                lab={{
                  title: lesson.title,
                  url: "",
                  description: lesson.subtitle,
                }}
              />

              <button className="p-2 bg-slate-800 text-white rounded-md" onClick={showSpacePopUp}>Start Space</button>

          {
            isShowingPop && <LearningSpace lessonId="lesson-001" popup onClose={() => setIsShowingPop(false)} />
          }

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 mt-6">
            {/* Results Info */}
            {/* <div className="text-sm text-gray-600">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
            </div> */}

            {/* Page Size Selector */}
            {/* <div className="flex items-center gap-2">
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
            </div> */}

            {/* Page Navigation */}
             <div className="flex items-center gap-2"> 
              {/* Previous Button */}
              {/* <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft />
              </button> */}

              {/* First Page */}
              {/* {page > 3 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    1
                  </button>
                  <span className="px-2">...</span>
                </>
              )} */}

              {/* Page Numbers */}
              {/* {getPageNumbers().map((pageNum) => (
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
              ))} */}

              {/* Last Page */}
              {/* {page < totalPages - 2 && totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                </>
              )} */}

              {/* Next Button */}
              {/* <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight />
              </button> */}
            </div>
          </div>
        {/* </> */}
      {/* )} */}

      {/* Empty State */}
      {/* {!loading && experimentData.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <p className="text-lg font-medium">No experiments found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      )} */}
      </div>
    </div>

  );
};

export default DashboardStemCoursesPage;
