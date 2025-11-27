"use client";
import PaymentTable from "@/components/Admin/Payments/PaymentsTable";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

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

const pieChartData = [
  { name: "individual", value: 230 },
  { name: "school", value: 35 },
];

const AdminPaymentsAndFinancePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const COLORS = ["#3B82F6", "#F59E0B"];

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <div className="flex self-end gap-1 lg:gap-2">
        <select
          name="currency"
          id="currency"
          className="text-xs lg:text-sm rounded-md border border-gray-300"
        >
          <option>Naira (₦)</option>
          <option>US Dollar ($)</option>
        </select>
        <button className="p-2 px-3 text-xs lg:text-sm bg-bgBlue text-white rounded-md">
          Export CSV
        </button>
      </div>
      <StatCards stats={statsConfig} isLoading={isLoading} />

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
        <div className="flex flex-col w-full lg:w-[65%]">
          <PaymentTable />
          {/* Donut Chart */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-4">
              Subscription Breakdown (Individual vs School)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-[35%] gap-2 lg:gap-4">
          {/* Payment Integrations */}
          <div className="flex flex-col bg-white rounded-md p-2 gap-2 lg:gap-3">
            <p className="text-sm lg:text-base font-semibold">
              Payment Integrations
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">Paystack</p>
                <p className="text-[.6rem] text-gray-500">
                  Live keys connected
                </p>
              </div>
              <p className="text-xs text-emerald-600">Active</p>
              <p className="text-xs font-semibold">Manage</p>
            </div>

            <button className="bg-bgBlue text-white rounded-md p-1 lg:p-2 text-xs lg:text-sm w-max">
              Add New Provider
            </button>
          </div>

          {/* Billing Sttings */}
          <div className="flex flex-col bg-white rounded-md p-2 gap-1 lg:gap-3">
            <p className="text-sm lg:text-base font-semibold">
              Billing Settings
            </p>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">Default Biling Currency</p>
                <p className="text-[.6rem] text-gray-500">
                  Set the currency used for invoices
                </p>
              </div>
              <div>
                <select
                  name="billingCurrency"
                  id="billingCurrency"
                  className="border border-gray-200 rounded-md text-xs p-2"
                >
                  <option value="">NGN-Naira</option>
                  <option value="">USD-Dollar</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsAndFinancePage;
