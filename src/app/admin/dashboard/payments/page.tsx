"use client"
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import React, { useState } from "react";


const statsConfig: StatCardData[] = [
  {
    title: "Total Revenue (NGN)",
    value: "0",
    icon: "/images/icon/admin/green_naira.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Total Revenue (USD)",
    value: "0",
    icon: "/images/icon/admin/blue_dollar.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Subscriptions",
    value: "0",
    icon: "/images/icon/admin/red_alarm.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Monthly Recurring Revenue",
    value: "0",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

const AdminPaymentsAndFinancePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <div className="flex self-end gap-1 lg:gap-2">
        <select name="currency" id="currency" className="text-xs lg:text-sm rounded-md border border-gray-300">
          <option>Naira (N)</option>
          <option>US Dollar ($)</option>
        </select>
        <button className="p-2 px-3 text-xs lg:text-sm bg-bgBlue text-white rounded-md">Export CSV</button>
      </div>
      <StatCards stats={statsConfig} isLoading={isLoading} />
    </div>
  );
};

export default AdminPaymentsAndFinancePage;
