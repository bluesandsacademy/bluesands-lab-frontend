"use client";
import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { Stat } from "@/lib/data";
import { useUser } from "@/services/UserContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SchoolPerformanceAnalyticsPage = () => {
  const { user } = useUser();
  const stats: Stat[] = [
    {
      title: "Overall Average Score",
      percentage: "90%",
      icon: "/images/icon/active_teacher.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Total Students",
      percentage: "75%",
      icon: "/images/icon/student_dark.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Pass Rates",
      percentage: "85%",
      icon: "/images/icon/total_payments.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Subjects Tracked",
      percentage: "20 Attempts",
      icon: "/images/icon/clipboard.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
  ];

  const COLORS = ["#00B69B", "#CC0000"];

  const lineChartData = [
    { month: "Jan", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Feb", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Mar", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Apr", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "May", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Jun", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Jul", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Aug", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Sep", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Oct", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Nov", attendance: 0, lab_completion: 0, quiz_score: 0 },
    { month: "Dec", attendance: 0, lab_completion: 0, quiz_score: 0 },
  ];

  const pieChartData = [
    { name: "pass", value: 231 },
    { name: "fail", value: 175 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <StatCards stats={stats} />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Line Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Performance Trends </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#0483E2"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="lab_completion"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="quiz_score"
                stroke="#003A6C"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Pass vs Fail Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-sm font-semibold">School-wide Performance Analysis</p>
        <table className="bg-white rounded-md">
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Subject</td>
            <td className="p-2">Average Score</td>
            <td className="p-2">Pass Rate</td>
            <td className="p-2">Student</td>
            <td className="p-2">Trend</td>
            <td className="p-2">Status</td>
          </tr>
          <tbody>
            <tr className="text-xs border-b border-b-gray-200">
              <td className="p-2">Biology</td>
              <td className="p-2">85.2%</td>
              <td className="p-2">89%</td>
              <td className="p-2">243</td>
              <td className="p-2 text-green-600">Improving</td>
              <td className="p-2">
                <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                  {" "}
                  Excellent
                </p>
              </td>
              <td className="p-2">
                <button className=" flex gap-1 items-center">
                  {/* <SlOptionsVertical /> */}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
    </div>
  );
};

export default SchoolPerformanceAnalyticsPage;
