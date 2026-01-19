"use client"
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import React, { useState } from "react";

const statsConfig: StatCardData[] = [
  {
    title: "Total Reports Generated",
    value: "0",
    icon: "/images/icon/report.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Data Points",
    value: "0",
    icon: "/images/icon/teacher/monthly-avg.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

const AdminReportPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex">
          <StatCards stats={statsConfig} isLoading={isLoading} />
        </div>

      </div>

      <div></div>
    </div>
  );
};

export default AdminReportPage;
