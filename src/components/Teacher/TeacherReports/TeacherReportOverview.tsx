"use client";

import { getTeacherReports } from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from "recharts";

const TeacherReportOverview = () => {
  const { token } = useUser();
  const [subjectData, setSubjectData] = useState<
    { subject: string; average: number; attendance: number; lab_completion: number }[]
  >([]);
  const [attendanceTrend, setAttendanceTrend] = useState<
    { month: string; attendance: number }[]
  >([]);
  const [performanceTrend, setPerformanceTrend] = useState<
    { month: string; average: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getTeacherReports(token);
        setSubjectData(data.subjectData);
        setAttendanceTrend(data.attendanceTrend);
        setPerformanceTrend(data.performanceTrend);
      } catch (err) {
        console.error("Failed to fetch report overview:", err);
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
      {/* Subject performance bar chart */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Performance By Subject</h3>
        {isLoading ? (
          chartSkeleton
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" name="Avg Score" fill="#0483E2" />
              <Bar dataKey="attendance" name="Attendance" fill="#10B981" />
              <Bar dataKey="lab_completion" name="Lab Completion" fill="#263238" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Performance trend */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Performance Trend</h3>
        {isLoading ? (
          chartSkeleton
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
                stroke="#0483E2"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Attendance trend */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Attendance Trends</h3>
        {isLoading ? (
          chartSkeleton
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TeacherReportOverview;
