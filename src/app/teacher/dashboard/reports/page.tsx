"use client";
import TeacherFilterButton from "@/components/Teacher/TeacherFilterButton";
import TeacherReportAttendance from "@/components/Teacher/TeacherReports/TeacherReportAttendance";
import TeacherReportIndividual from "@/components/Teacher/TeacherReports/TeacherReportIndividual";
import TeacherReportOverview from "@/components/Teacher/TeacherReports/TeacherReportOverview";
import TeacherReportPerformance from "@/components/Teacher/TeacherReports/TeacherReportPerformance";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";

const TeacherReportsPage = () => {
  const filters = ["Overview", "Performance", "Attendance", "Individual"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <div className="flex justify-between p-2 md:p-3 bg-white rounded-md">
        <div>
          <p className="font-semibold text-[#303C48] lg:text-lg">
            Reports & Analytics
          </p>
          <p className="text-xs text-slate-500">
            Track student performance and attendance insights
          </p>
        </div>
        <div>
          <button className="flex items-center gap-1 rounded-md p-2 px-3 text-xs md:text-sm text-white bg-[#303C48]  ">
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      <TeacherFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      {activeFilter === "Overview" ? (
        <TeacherReportOverview />
      ) : activeFilter === "Performance" ? (
        <TeacherReportPerformance />
      ) : activeFilter === "Attendance" ? (
        <TeacherReportAttendance />
      ) : activeFilter === "Individual" ? (
        <TeacherReportIndividual />
      ) : (
        <TeacherReportOverview />
      )}
    </div>
  );
};

export default TeacherReportsPage;
