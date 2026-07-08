"use client";

import { useUser } from "@/services/UserContext";
import {
  getTeacherAnalyticsOverview,
  getTeacherAverageScores,
  getTeacherClassImprovement,
  TeacherAnalyticsOverview,
  AverageScores,
  ClassImprovement,
} from "@/services/teacherDashboardService";
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
  BarChart,
  Bar,
} from "recharts";

const TeacherPerformanceMetricsPage = () => {
  const { token } = useUser();
  const [overview, setOverview] = useState<TeacherAnalyticsOverview | null>(
    null,
  );
  const [avgScores, setAvgScores] = useState<AverageScores["subjects"]>([]);
  const [improvement, setImprovement] = useState<
    ClassImprovement["trends"]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [overviewData, scoresData, improvementData] = await Promise.all([
          getTeacherAnalyticsOverview(token),
          getTeacherAverageScores(token),
          getTeacherClassImprovement(token),
        ]);
        setOverview(overviewData);
        setAvgScores(scoresData.subjects);
        setImprovement(improvementData.trends);
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const chartSkeleton = (
    <div className="animate-pulse bg-gray-100 rounded-lg h-[300px] w-full" />
  );

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      {/* Charts row */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-3">
        {/* Average Scores by Subject — grouped bar */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Average Scores by Subject</h3>
          {isLoading ? (
            chartSkeleton
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" name="Avg Score" fill="#0483E2" />
                <Bar dataKey="attendance" name="Attendance" fill="#10B981" />
                <Bar
                  dataKey="lab_completion"
                  name="Lab Completion"
                  fill="#263238"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Class Improvement Trends — line chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Class Improvement Trends
          </h3>
          {isLoading ? (
            chartSkeleton
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={improvement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  name="Avg Score"
                  stroke="#0483E2"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="lab_completion"
                  name="Lab Completion"
                  stroke="#263238"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Student tables */}
      <div className="flex flex-col w-full lg:flex-row gap-3">
        {/* Top Performing */}
        <div className="flex flex-col gap-2 lg:w-[49%]">
          <p className="text-sm font-semibold">Top Performing Students</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-md text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <td className="p-2">Student Name</td>
                  <td className="p-2">Class</td>
                  <td className="p-2">Experiments</td>
                  <td className="p-2">Avg Score</td>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 animate-pulse"
                    >
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className="p-2">
                          <div className="h-3 bg-gray-100 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : overview?.topPerforming.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-400"
                    >
                      No data yet.
                    </td>
                  </tr>
                ) : (
                  overview?.topPerforming.map((s) => (
                    <tr
                      key={s.userId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-2 font-medium text-gray-800">
                        {s.studentName}
                      </td>
                      <td className="p-2 text-gray-600">{s.classroomName}</td>
                      <td className="p-2 text-gray-600">
                        {s.experimentsCompleted}
                      </td>
                      <td className="p-2">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                          {s.avgScore}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* At Risk */}
        <div className="flex flex-col gap-2 lg:w-[49%]">
          <p className="text-sm font-semibold text-red-700">
            At Risk Students
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-md text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <td className="p-2">Student Name</td>
                  <td className="p-2">Class</td>
                  <td className="p-2">Avg Score</td>
                  <td className="p-2">Reason</td>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 animate-pulse"
                    >
                      {Array.from({ length: 4 }).map((__, j) => (
                        <td key={j} className="p-2">
                          <div className="h-3 bg-gray-100 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : overview?.atRisk.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-400"
                    >
                      No at-risk students.
                    </td>
                  </tr>
                ) : (
                  overview?.atRisk.map((s) => (
                    <tr
                      key={s.userId}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="p-2 font-medium text-gray-800">
                        {s.studentName}
                      </td>
                      <td className="p-2 text-gray-600">{s.classroomName}</td>
                      <td className="p-2">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                          {s.avgScore}%
                        </span>
                      </td>
                      <td className="p-2 text-gray-500">{s.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPerformanceMetricsPage;
