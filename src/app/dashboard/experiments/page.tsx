"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import CourseFilter from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { LuClock3 } from "react-icons/lu";

export default function DashboardExperimentsPage() {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  const filters = ["All Experiments", "Physics", "Chemistry", "Biology"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates suscipit molestiae quos hic quod maiores, nihil nemo similique expedita provident neque possimus ea corrupti deserunt, accusantium quo soluta illum amet facere? Corrupti sunt consequuntur facilis, ab fuga, culpa id, fugiat quis aut nulla ratione eius? Fuga numquam magni quidem unde.";
  const truncatedDesc = description.split(" ").slice(0, 15).join(" ") + "...";

  //  The function to filter courses
  //  const filteredCourses =
  // activeFilter === "All Experiments"
  //   ? courseData
  //   : courseData.filter((course) => course.subject === activeFilter);

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
      value: "0",
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
      <CourseFilter
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex flex-wrap gap-4 m-4">
        <div className="flex flex-col gap-2 rounded overflow-hidden w-80 bg-white">
          <div className="flex items-center justify-center w-full py-12 bg-black text-white">
            Example Experiment
          </div>
          <div className="flex flex-col gap-2 px-2">
            <p className="text-xs md:text-sm font-semibold">Example</p>
            <p className="text-xs">
              {description.length < 16 ? description : truncatedDesc}
            </p>
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  {" "}
                  <LuClock3 className="text-blue-600" /> 00:00
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  {" "}
                  <IoMdCalendar className="text-blue-600" /> dd-mm-yyyy
                </p>
              </div>
              <p className="text-xs md:text-sm flex items-center gap-2">
                {" "}
                <FaQuestionCircle className="text-blue-600" /> Unattempt
              </p>
            </div>
            {/* <Link href={"/dashboard/experiments/overview"}> */}
            <button className="bg-bgBlue text-white w-full p-2 rounded-md text-sm">
              Go to lab
            </button>
            {/* </Link>                        */}
          </div>
        </div>
      </div>
    </div>
  );
}
