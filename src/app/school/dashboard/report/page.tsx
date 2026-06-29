"use client";
import SchoolReportClassAnalytics from "@/components/School/Dashboard/Reports/SchoolReportClassAnalytics";
import SchoolReportExports from "@/components/School/Dashboard/Reports/SchoolReportExports";
import SchoolReportOverview from "@/components/School/Dashboard/Reports/SchoolReportOverview";
import SchoolReportTeacherComparison from "@/components/School/Dashboard/Reports/SchoolReportTeacherComparison";
import SchoolFilterButton from "@/components/School/Dashboard/SchoolFilterButton";
import { exportActivity } from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useState } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const SchoolReportAnalyticsPage = () => {
  const filters = ["Overview", "Class Analytics", "Teacher Comparison", "Report & Export"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useUser();

  const handleExport = async () => {
    if (!user?.schoolId) {
      toast.error("School ID not found. Please try again.");
      return;
    }
    setIsExporting(true);
    try {
      await exportActivity(user.schoolId);
      toast.success("Activity report downloaded.");
    } catch {
      toast.error("Failed to export activity report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <div className="flex justify-between p-2 md:p-3 bg-white rounded-md">
        <div>
          <p className="font-semibold lg:text-lg">Reports & Analytics</p>
          <p className="text-xs">
            Complete performance analytics and reporting for educational institution
          </p>
        </div>
        <div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1 rounded-md p-2 px-3 text-xs md:text-sm text-white bg-blue-950 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>
      <SchoolFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      {activeFilter === "Overview" ? (
        <SchoolReportOverview />
      ) : activeFilter === "Class Analytics" ? (
        <SchoolReportClassAnalytics />
      ) : activeFilter === "Teacher Comparison" ? (
        <SchoolReportTeacherComparison />
      ) : activeFilter === "Report & Export" ? (
        <SchoolReportExports />
      ) : (
        <SchoolReportOverview />
      )}
    </div>
  );
};

export default SchoolReportAnalyticsPage;
