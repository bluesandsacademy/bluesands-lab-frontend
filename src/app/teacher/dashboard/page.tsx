"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import TeacherWelcomeBanner from "@/components/Teacher/TeacherWelcomeBanner";
import {
  getTeacherDashboard,
  getTeacherAnalyticsOverview,
  getTeacherPerformanceTrends,
  TeacherAnalyticsOverview,
} from "@/services/teacherDashboardService";
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

const statsTemplate: StatCardData[] = [
  { title: "Total Students", value: "0", icon: "/images/icon/teacher/students.svg", percentageChange: " ", timeFrame: "across all classes" },
  { title: "Average Score", value: "0", icon: "/images/icon/teacher/avg-score.svg", percentageChange: " ", timeFrame: "across all classes" },
  { title: "Lab Completion", value: "0", icon: "/images/icon/teacher/purple-lab.svg", percentageChange: " ", timeFrame: "average rate" },
  { title: "Pending to Grade", value: "0", icon: "/images/icon/teacher/orange-quiz.svg", percentageChange: " ", timeFrame: "assignments" },
  { title: "Active Students", value: "0", icon: "/images/icon/teacher/active-students.svg", percentageChange: " ", timeFrame: "this week" },
  { title: "Total Classes", value: "0", icon: "/images/icon/teacher/physics.svg", percentageChange: " ", timeFrame: "assigned to you" },
  { title: "Total ILS Created", value: "0", icon: "/images/icon/teacher/vr-headset-stemlabs.png", percentageChange: " ", timeFrame: "across all classes" },
];

function getFirstName(fullName: string | undefined): string {
  if (!fullName) return "";
  const startsWithTitle =
    fullName.startsWith("Mr") ||
    fullName.startsWith("Ms") ||
    fullName.startsWith("Mrs") ||
    fullName.startsWith("Miss");
  return startsWithTitle ? fullName.split(" ")[1] : fullName.split(" ")[0];
}

const TeacherDashboardOverviewPage = () => {
  const { user, token } = useUser();
  const firstName = getFirstName(user?.fullName);

  const [stats, setStats] = useState<StatCardData[]>(statsTemplate);
  const [overview, setOverview] = useState<TeacherAnalyticsOverview | null>(null);
  const [trendData, setTrendData] = useState<{ month: string; average: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [dashboard, analyticsOverview, trends] = await Promise.all([
          getTeacherDashboard(token),
          getTeacherAnalyticsOverview(token),
          getTeacherPerformanceTrends(token),
        ]);

        setStats([
          { ...statsTemplate[0], value: `${analyticsOverview.totalStudents}` },
          { ...statsTemplate[1], value: `${analyticsOverview.avgClassScore}%` },
          { ...statsTemplate[2], value: `${analyticsOverview.experimentsCompleted}` },
          { ...statsTemplate[3], value: `${analyticsOverview.pendingToGrade}` },
          { ...statsTemplate[4], value: `${analyticsOverview.activeStudentsThisWeek}` },
          { ...statsTemplate[5], value: `${analyticsOverview.totalClasses}` },
          { ...statsTemplate[6], value: `${dashboard.totalIlsCreated}` },
        ]);

        setOverview(analyticsOverview);
        setTrendData(trends.trends);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setStats(statsTemplate);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token]);

  return (
    <div className="p-4 space-y-4">
      <TeacherWelcomeBanner firstName={firstName} />
      <StatCards stats={stats} isLoading={isLoading} />

      {/* Performance Trend */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 bg-white p-4 rounded-lg shadow w-full">
          <h3 className="text-sm font-semibold mb-4">Performance Trends</h3>
          {isLoading ? (
            <div className="animate-pulse bg-gray-100 rounded-lg h-[300px]" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  name="Avg Score"
                  stroke="#003A6C"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom tables */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:justify-between">
        <div className="flex flex-col gap-3 bg-white rounded-md p-3 w-full md:w-96">
          <p className="text-blue-950 text-sm lg:text-base font-semibold">
            Recent Activity (7 days)
          </p>
          <p className="text-xs text-gray-400">
            Activity data shown in the stat cards above.
          </p>
        </div>

        {/* Top Performing */}
        <div className="flex flex-col p-3 gap-3 flex-1 min-w-64 rounded-lg bg-white">
          <strong className="text-sm text-gray-700">Top Performing Students</strong>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          ) : overview?.topPerforming.length === 0 ? (
            <p className="text-xs text-gray-400">No data yet.</p>
          ) : (
            <table className="text-xs w-full">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <td className="pb-1">Name</td>
                  <td className="pb-1">Class</td>
                  <td className="pb-1">Score</td>
                </tr>
              </thead>
              <tbody>
                {overview?.topPerforming.map((s) => (
                  <tr key={s.userId} className="border-b border-gray-50">
                    <td className="py-1.5 font-medium">{s.studentName}</td>
                    <td className="py-1.5 text-gray-500">{s.classroomName}</td>
                    <td className="py-1.5">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {s.avgScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* At Risk */}
        <div className="flex flex-col p-3 gap-3 flex-1 min-w-64 rounded-lg bg-white">
          <strong className="text-sm text-red-700">At-Risk Students</strong>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          ) : overview?.atRisk.length === 0 ? (
            <p className="text-xs text-gray-400">No at-risk students.</p>
          ) : (
            <table className="text-xs w-full">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <td className="pb-1">Name</td>
                  <td className="pb-1">Score</td>
                  <td className="pb-1">Reason</td>
                </tr>
              </thead>
              <tbody>
                {overview?.atRisk.map((s) => (
                  <tr key={s.userId} className="border-b border-gray-50">
                    <td className="py-1.5 font-medium">{s.studentName}</td>
                    <td className="py-1.5">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        {s.avgScore}%
                      </span>
                    </td>
                    <td className="py-1.5 text-gray-500">{s.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardOverviewPage;
