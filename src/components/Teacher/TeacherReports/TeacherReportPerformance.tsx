"use client";

import { getTeacherReports } from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
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

const TeacherReportPerformance = () => {
  const { token } = useUser();
  const [performanceTrend, setPerformanceTrend] = useState<
    { month: string; average: number }[]
  >([]);
  const [subjectData, setSubjectData] = useState<
    { subject: string; average: number; attendance: number; lab_completion: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getTeacherReports(token);
        setPerformanceTrend(data.performanceTrend);
        setSubjectData(data.subjectData);
      } catch (err) {
        console.error("Failed to fetch performance report:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div className="flex flex-col gap-4">
      {/* Performance trend line chart */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Performance Trends</h3>
        {isLoading ? (
          <div className="animate-pulse bg-gray-100 rounded-lg h-[300px]" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                name="Avg Score"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Subject performance table */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Subject Performance Details</p>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-md text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <td className="p-2">Subject</td>
                <td className="p-2">Average Score</td>
                <td className="p-2">Attendance</td>
                <td className="p-2">Lab Completion</td>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <td key={j} className="p-2">
                        <div className="h-3 bg-gray-100 rounded w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : subjectData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">
                    No subject data yet.
                  </td>
                </tr>
              ) : (
                subjectData.map((s) => (
                  <tr key={s.subject} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 font-medium text-gray-800">{s.subject}</td>
                    <td className="p-2">
                      <span
                        className={`bg-green-100 w-max px-2 py-0.5 rounded-full font-medium ${
                          s.average >= 70
                            ? "text-green-600"
                            : s.average >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {s.average}%
                      </span>
                    </td>
                    <td className="p-2">{s.attendance}%</td>
                    <td className="p-2">{s.lab_completion}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherReportPerformance;
