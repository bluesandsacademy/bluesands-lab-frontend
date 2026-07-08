"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { getTeacherAttendance } from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TeacherReportAttendance = () => {
  const { token } = useUser();
  const [trends, setTrends] = useState<
    { month: string; late: number; present: number; absent: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getTeacherAttendance(token);
        setTrends(data.trends);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Derive stats from the most recent month with data
  const lastMonth = [...trends].reverse().find(
    (t) => t.present + t.absent + t.late > 0,
  );
  const totalLast = lastMonth
    ? lastMonth.present + lastMonth.absent + lastMonth.late
    : 0;
  const monthlyAvg =
    trends.length > 0
      ? Math.round(
          trends.reduce((s, t) => {
            const total = t.present + t.absent + t.late;
            return s + (total > 0 ? (t.present / total) * 100 : 0);
          }, 0) / trends.length,
        )
      : 0;

  const statsConfig: StatCardData[] = [
    {
      title: "Present (Last Month)",
      value: lastMonth ? `${lastMonth.present}/${totalLast}` : "—",
      icon: "/images/icon/teacher/person-in-bar.svg",
    },
    {
      title: "Absent (Last Month)",
      value: lastMonth ? `${lastMonth.absent}` : "—",
      icon: "/images/icon/teacher/purple-exc.svg",
    },
    {
      title: "Late (Last Month)",
      value: lastMonth ? `${lastMonth.late}` : "—",
      icon: "/images/icon/teacher/red-clock.svg",
    },
    {
      title: "Monthly Avg Attendance",
      value: `${monthlyAvg}%`,
      icon: "/images/icon/teacher/monthly-avg.svg",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <StatCards stats={statsConfig} isLoading={isLoading} />

      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow">
        <p className="text-sm font-semibold text-gray-600">
          Attendance Overview (12 months)
        </p>
        {isLoading ? (
          <div className="animate-pulse bg-gray-100 rounded-lg h-[300px]" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" name="Present" stackId="a" fill="#00B69B" />
              <Bar dataKey="late" name="Late" stackId="a" fill="#006FCC" />
              <Bar dataKey="absent" name="Absent" stackId="a" fill="#CC0000" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TeacherReportAttendance;
