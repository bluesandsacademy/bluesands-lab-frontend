import { getQuizPerformance } from "@/services/dashboard-service";
import { format } from "date-fns";
import { useEffect, useState } from "react";
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

export default function QuizPerformance() {
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getQuizPerformance();
        setQuizData(res);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    }
    fetchData();
  }, []);

  // Group by month
  const monthlyScores: Record<string, number[]> = {};

  quizData.forEach(({ date, score }) => {
    const month = format(new Date(date), "MMM"); // "Apr", "May", etc.

    if (!monthlyScores[month]) {
      monthlyScores[month] = [];
    }
    monthlyScores[month].push(score);
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Average and format
  const chartData = months.map((month) => {
    const scores = monthlyScores[month] || [];
    const avg = scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0;
    return { name: month, value: avg };
  });

  return (
    <div className="w-full h-[300px] col-span-3 space-y-3 bg-white rounded-2xl p-5">
      <div>
        <h2 className="text-left text-md font-normal">Quiz performance</h2>
        <span className="text-green-500">(+5) more in 2021</span>
      </div>
      <ResponsiveContainer className="w-full p-0 m-0">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" tick={{ fill: "#333" }} />
          <YAxis tick={{ fill: "#333" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
