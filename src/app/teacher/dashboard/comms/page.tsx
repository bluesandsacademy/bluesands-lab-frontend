"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getTeacherCommunications,
  Communications,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0483E2", "#00B69B", "#F59E0B", "#EF4444"];

const TeacherCommsMetricPage = () => {
  const { token } = useUser();
  const [comms, setComms] = useState<Communications | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTeacherCommunications(token);
        setComms(data);
      } catch (err) {
        console.error("Failed to fetch communications data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const totalMessages =
    comms?.messagesTrend.reduce(
      (sum, m) => sum + m["teacher-student"] + m["student-teacher"],
      0,
    ) ?? 0;

  const statsConfig: StatCardData[] = [
    {
      title: "Total Messages",
      value: isLoading ? "—" : `${totalMessages}`,
      icon: "/images/icon/teacher/black-msg.svg",
    },
    {
      title: "Active Students",
      value: "—",
      icon: "/images/icon/teacher/avg-score.svg",
    },
    {
      title: "Forum Posts",
      value: "—",
      icon: "/images/icon/teacher/purple-msg.svg",
    },
    {
      title: "Response Rate",
      value: "—",
      icon: "/images/icon/teacher/monthly-avg.svg",
    },
  ];

  const chartSkeleton = (
    <div className="animate-pulse bg-gray-100 rounded-lg h-[300px] w-full" />
  );

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <StatCards stats={statsConfig} isLoading={isLoading} />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Messages Trend */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Messages Sent &amp; Received
          </h3>
          {isLoading ? (
            chartSkeleton
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comms?.messagesTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="teacher-student"
                  name="Teacher → Student"
                  stroke="#0483E2"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="student-teacher"
                  name="Student → Teacher"
                  stroke="#263238"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Message Types Donut */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Message Types</h3>
          {isLoading ? (
            chartSkeleton
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={comms?.messageTypes ?? []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  innerRadius={50}
                  dataKey="value"
                >
                  {(comms?.messageTypes ?? []).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Participation Trends */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Participation Trends</h3>
        {isLoading ? (
          chartSkeleton
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comms?.participationTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="activity"
                name="Activity"
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

export default TeacherCommsMetricPage;
