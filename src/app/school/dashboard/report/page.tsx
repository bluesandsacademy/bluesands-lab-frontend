"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import SchoolReportClassAnalytics from "@/components/School/Dashboard/Reports/SchoolReportClassAnalytics";
import SchoolReportExports from "@/components/School/Dashboard/Reports/SchoolReportExports";
import SchoolReportOverview from "@/components/School/Dashboard/Reports/SchoolReportOverview";
import SchoolReportTeacherComparison from "@/components/School/Dashboard/Reports/SchoolReportTeacherComparison";
import SchoolFilterButton from "@/components/School/Dashboard/SchoolFilterButton";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";

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

      {activeFilter === "Overview" ? <SchoolReportOverview/>: activeFilter === "Class Analytics" ? <SchoolReportClassAnalytics/>: activeFilter === "Teacher Comparison" ? <SchoolReportTeacherComparison/>:activeFilter === "Report & Export" ? <SchoolReportExports/> : <SchoolReportOverview/>  }
    </div>
  );
};

export default SchoolReportAnalyticsPage;
