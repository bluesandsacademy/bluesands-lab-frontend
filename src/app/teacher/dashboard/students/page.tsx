"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { exportEngagement } from "@/services/teacherDashboardService";
import { useState } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { toast } from "react-toastify";

const statsConfig: StatCardData[] = [
  {
    title: "Active Students",
    value: "0",
    icon: "/images/icon/teacher/students.svg",
    percentageChange: " ",
    timeFrame: "of 450 total",
  },
  {
    title: "Average Time Spent",
    value: "0",
    icon: "/images/icon/teacher/avg-score.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Lab Experiments",
    value: "0",
    icon: "/images/icon/teacher/purple-lab.svg",
    percentageChange: " ",
    timeFrame: "total attempts this month",
  },
  {
    title: "Lesson Completion",
    value: "0",
    icon: "/images/icon/teacher/orange-quiz.svg",
    percentageChange: " ",
    timeFrame: "Average completion rate",
  },
];

const TeacherStudentEngagePage = () => {
  const [isExporting, setIsExporting] = useState(false);

  const lineChartData = [
    { day: "Mon", time: 0 },
    { day: "Tue", time: 0 },
    { day: "Wed", time: 0 },
    { day: "Thu", time: 0 },
    { day: "Fri", time: 0 },
    { day: "Sat", time: 0 },
    { day: "Sun", time: 0 },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportEngagement();
      toast.success("Engagement report downloaded.");
    } catch {
      toast.error("Failed to export engagement report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <div className="flex justify-between p-2 md:p-3 bg-white rounded-md">
        <div>
          <p className="font-semibold text-[#303C48] lg:text-lg">
            Student Engagement Analytics
          </p>
          <p className="text-xs text-slate-500">
            Monitor student activity, progress and lab engagements
          </p>
        </div>
        <div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-1 rounded-md p-2 px-3 text-xs md:text-sm text-white bg-[#303C48] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      <StatCards stats={statsConfig} />

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Daily Time Spent (Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="time"
                stroke="#003A6C"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentEngagePage;
