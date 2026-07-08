"use client";
import { StatCardData } from "@/components/Dashboard/StatCards";
import { getSchoolAdminSystemMetrics } from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { RiErrorWarningFill } from "react-icons/ri";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
} from "recharts";

interface StemMetricsResponse {
  peakUsageTimes: [
    {
      hour: number;
      count: number;
    }
  ];
  deviceBreakdown: [
    {
      name: string;
      count: number;
    }
  ];
  browserBreakdown: [
    {
      name: string;
      count: number;
    }
  ];
  downtimeOrErrorEvents: [
    {
      date: string;
      count: number;
    }
  ];
}

const SchoolSystemMetricsPage = () => {
  const [metricsData, setMetricsData] = useState<StemMetricsResponse>();
 // const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useUser();

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#00B69B"];

  const lineChartData = [
    { time: "00:00", usage: 0 },
    { time: "02:00", usage: 0 },
    { time: "04:00", usage: 0 },
    { time: "06:00", usage: 0 },
    { time: "08:00", usage: 0 },
    { time: "10:00", usage: 0 },
    { time: "12:00", usage: 0 },
    { time: "14:00", usage: 0 },
    { time: "16:00", usage: 0 },
    { time: "18:00", usage: 0 },
    { time: "20:00", usage: 0 },
    { time: "22:00", usage: 0 },
  ];

  const deviceUsageChartData = [
    { name: "desktop", value: 400 },
    { name: "mobile", value: 100 },
    { name: "tablet", value: 200 },
  ];

  const browserUsageChartData = [
    { name: "chrome", value: 600 },
    { name: "edge", value: 200 },
    { name: "safari", value: 100 },
    { name: "others", value: 50 },
  ];

  const barChartData = [
    { month: "Jan", downtime: 0 },
    { month: "Feb", downtime: 0 },
    { month: "Mar", downtime: 0 },
    { month: "Apr", downtime: 0 },
    { month: "May", downtime: 0 },
    { month: "Jun", downtime: 0 },
    { month: "Jul", downtime: 0 },
    { month: "Aug", downtime: 0 },
    { month: "Sep", downtime: 0 },
    { month: "Oct", downtime: 0 },
    { month: "Nov", downtime: 0 },
    { month: "Dec", downtime: 0 },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getSchoolAdminSystemMetrics(token);
        setMetricsData(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, [user, token]);

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      {/* Card Container */}
      <div className="flex flex-wrap gap-4 justify-center ">
        {/* Cards */}
        <div className="flex flex-col justify-between p-4 rounded-md bg-green-100 h-32 w-60">
          <div className="flex justify-between ">
            <div className="flex flex-col justify-between text-teal-500">
              <p className="text-xs">System Uptime</p>
              <p className="text-lg">0%</p>
            </div>
            <div className="bg-teal-500 text-white rounded-md p-3 text-lg">
              <FaRegClock />
            </div>
          </div>
          <p className="text-xs text-teal-500">Last Downtime:</p>
        </div>

        <div className="flex flex-col justify-between p-4 rounded-md bg-blue-100 h-32 w-60">
          <div className="flex justify-between ">
            <div className="flex flex-col justify-between text-blue-500">
              <p className="text-xs">Average Respond Time</p>
              <p className="text-lg">0 ms</p>
            </div>
            <div className="bg-blue-500 text-white rounded-md p-3 text-lg">
              <FaRegClock />
            </div>
          </div>
          <p className="text-xs text-blue-500">Within acceptable range</p>
        </div>

        <div className="flex flex-col justify-between p-4 rounded-md bg-green-100 h-32 w-60">
          <div className="flex justify-between ">
            <div className="flex flex-col justify-between text-teal-500">
              <p className="text-xs">Error Rate</p>
              <p className="text-lg">0%</p>
            </div>
            <div className="bg-teal-500 text-white rounded-md p-3 text-lg">
              <RiErrorWarningFill />
            </div>
          </div>
          <p className="text-xs text-teal-500">Very low error rate</p>
        </div>

        <div className="flex flex-col justify-between p-4 rounded-md bg-green-100 h-32 w-60">
          <div className="flex justify-between ">
            <div className="flex flex-col justify-between text-teal-500">
              <p className="text-xs">Active Servers</p>
              <p className="text-lg">0/0</p>
            </div>
            <div className="bg-teal-500 text-white rounded-md p-3 text-lg">
              <FaCircleCheck />
            </div>
          </div>
          <p className="text-xs text-teal-500">All servers operational</p>
        </div>
      </div>

      {/* Line Chart and Donut Chart Side by Side */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Line Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Peak Usage Time </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsData?.peakUsageTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#003A6C"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart (Pie Chart with hole) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Device Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metricsData?.deviceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="count"
              >
                {deviceUsageChartData.map((entry, index) => (
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

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Bar chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Downtime History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData?.downtimeOrErrorEvents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="red" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart (Pie Chart with hole) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Browser Usage Stats</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metricsData?.browserBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="count"
              >
                {browserUsageChartData.map((entry, index) => (
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

      <p className="text-sm font-semibold">Recent Error Reports</p>
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Error Type</td>
            <td className="p-2">Time</td>
            <td className="p-2">Severity</td>
            <td className="p-2">Status</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">API Timeout</td>
            <td className="p-2">3 Hours Ago</td>
            <td className="p-2">
              <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                {" "}
                Low
              </p>
            </td>
            <td className="p-2">Resolved</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SchoolSystemMetricsPage;
