"use client";
import type { TrendPoint } from "@/services/schoolAdminDashboardService";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Bucket granularity isn't fixed by the API, so label by month when there's at
 * most one point per month and by day otherwise.
 */
function buildChartData(points: TrendPoint[]) {
  const valid = points.filter((point) => {
    if (!point) return false;
    const date = new Date(point.ts);
    return !Number.isNaN(date.getTime()) && typeof point.value === "number";
  });

  const months = new Set(
    valid.map((point) => format(new Date(point.ts), "yyyy-MM")),
  );
  const monthly = months.size >= valid.length;

  return valid
    .slice()
    .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime())
    .map((point) => ({
      name: format(new Date(point.ts), monthly ? "MMM" : "d MMM"),
      value: point.value,
    }));
}

interface SchoolWideTrendProps {
  points: TrendPoint[];
  isLoading?: boolean;
  title?: string;
  /** Appended to the delta badge, e.g. "pts". */
  unit?: string;
}

export default function SchoolWideTrend({
  points,
  isLoading,
  title = "School-wide Performance Trends",
  unit = "pts",
}: SchoolWideTrendProps) {
  const chartData = useMemo(() => buildChartData(points ?? []), [points]);

  // Real movement across the series, replacing the old static "(+5) in 2021".
  const delta = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    return {
      change: Math.round((last - first) * 100) / 100,
      from: chartData[0].name,
    };
  }, [chartData]);

  return (
    <div className="w-full h-[280px] md:h-[320px] lg:h-[300px] col-span-1 md:col-span-2 xl:col-span-3 bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm lg:text-base font-semibold text-blue-950 mb-1">
          {title}
        </h2>
        {isLoading ? (
          <span className="text-sm text-gray-400">Loading…</span>
        ) : delta ? (
          <span
            className={`text-sm font-medium ${
              delta.change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {delta.change >= 0 ? "+" : ""}
            {delta.change} {unit} since {delta.from}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Not enough data yet</span>
        )}
      </div>

      <div className="h-[200px] md:h-[240px] lg:h-[220px]">
        {!isLoading && !chartData.length ? (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No trend data recorded yet
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
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="value"
                name="Average score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
