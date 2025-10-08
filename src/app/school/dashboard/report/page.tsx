"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import SchoolFilterButton from "@/components/School/Dashboard/SchoolFilterButton";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

const statsConfig: StatCardData[] = [
  {
    title: "Average Score",
    value: "0",
    icon: "/images/icon/active_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Total Students",
    value: "0",
    icon: "/images/icon/student_dark.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Attendance Rate",
    value: "0",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Classes",
    value: "0",
    icon: "/images/icon/card_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

const SchoolReportAnalyticsPage = () => {
  const filters = [
    "Overview",
    "Class Analytics",
    "Teacher Comparison",
    "Report & Export",
  ];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <div className="flex justify-between p-2 md:p-3 bg-white rounded-md">
        <div>
          <p className="font-semibold lg:text-lg">Reports & Analytics</p>
          <p className="text-xs">
            Complete performance analytics and reporting for educational
            institution
          </p>
        </div>
        <div>
          <button className="flex items-center gap-1 rounded-md p-2 px-3 text-xs md:text-sm text-white bg-blue-950  ">
            <FaDownload />
            Export
          </button>
        </div>
      </div>
      <SchoolFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      <StatCards stats={statsConfig} />
    </div>
  );
};

export default SchoolReportAnalyticsPage;
