"use client";
import type { TrendPoint } from "@/services/schoolAdminDashboardService";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const isValid = (point: TrendPoint) =>
  !!point &&
  typeof point.value === "number" &&
  !Number.isNaN(new Date(point.ts).getTime());

/** Merges both series on their timestamp so one x-axis serves both lines. */
function buildChartData(activeUsers: TrendPoint[], experiments: TrendPoint[]) {
  const buckets = new Map<
    string,
    { ts: number; activeUsers: number | null; experiments: number | null }
  >();

  const put = (
    points: TrendPoint[],
    key: "activeUsers" | "experiments",
  ) =>
    points.filter(isValid).forEach((point) => {
      const ts = new Date(point.ts).getTime();
      const bucket = buckets.get(point.ts) ?? {
        ts,
        activeUsers: null,
        experiments: null,
      };
      bucket[key] = point.value;
      buckets.set(point.ts, bucket);
    });

  put(activeUsers, "activeUsers");
  put(experiments, "experiments");

  const rows = [...buckets.values()].sort((a, b) => a.ts - b.ts);
  const months = new Set(rows.map((row) => format(row.ts, "yyyy-MM")));
  const monthly = months.size >= rows.length;

  return rows.map((row) => ({
    name: format(row.ts, monthly ? "MMM" : "d MMM"),
    activeUsers: row.activeUsers ?? 0,
    experiments: row.experiments ?? 0,
  }));
}

interface SchoolActivityTrendProps {
  activeUsers: TrendPoint[];
  experimentsRun: TrendPoint[];
  isLoading?: boolean;
}

export default function SchoolActivityTrend({
  activeUsers,
  experimentsRun,
  isLoading,
}: SchoolActivityTrendProps) {
  const chartData = useMemo(
    () => buildChartData(activeUsers ?? [], experimentsRun ?? []),
    [activeUsers, experimentsRun],
  );

  return (
    <div className="flex flex-col gap-3 bg-white rounded-md p-4">
      <p className="text-blue-950 text-sm lg:text-base font-semibold">
        Activity Trends
      </p>

      <div className="h-[240px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            Loading activity…
          </div>
        ) : !chartData.length ? (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No activity recorded yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="activeUsers"
                name="Active users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="experiments"
                name="Experiments run"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
