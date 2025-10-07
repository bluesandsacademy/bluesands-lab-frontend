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

const SchoolLabPage = () => {
  const { user } = useUser();
  const stats: Stat[] = [
    {
      title: "Total Experiment",
      percentage: "90%",
      icon: "/images/icon/beaker_01.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Average Completion Rate",
      percentage: "75%",
      icon: "/images/icon/chart.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Resource Usage",
      percentage: "85%",
      icon: "/images/icon/clipboard.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Active Users",
      percentage: "20 Attempts",
      icon: "/images/icon/calendar.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
  ];

  const COLORS = ["#003A6C", "#00B69B", ];

  const lineChartData = [
    { month: "Jan", loginCount: 0, },
    { month: "Feb", loginCount: 0, },
    { month: "Mar", loginCount: 0, },
    { month: "Apr", loginCount: 0, },
    { month: "May", loginCount: 0, },
    { month: "Jun", loginCount: 0, },
    { month: "Jul", loginCount: 0, },
    { month: "Aug", loginCount: 0, },
    { month: "Sep", loginCount: 0, },
    { month: "Oct", loginCount: 0, },
    { month: "Nov", loginCount: 0, },
    { month: "Dec", loginCount: 0, },
  ];

  const pieChartData = [
    { name: "remaining", value: 400 },
    { name: "completed", value: 100 },
  ];

  const barChartData = [
    { subject: "Math", average_score: 50, attendance: 56, lab_completion: 90 },
    { subject: "Physics", average_score: 63, attendance: 40, lab_completion: 80 },
    { subject: "Chemistry", average_score: 30, attendance: 60, lab_completion: 90 },
    { subject: "Biology", average_score: 70, attendance: 43, lab_completion: 75 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <StatCards stats={stats} />
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Course / Module Popularity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="average_score" fill="#0483E2" />
            <Bar dataKey="attendance" fill="#10B981" />
            <Bar dataKey="lab_completion" fill="#003A6C" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart and Donut Chart Side by Side */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Line Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">User Growth </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="loginCount"
                stroke="#003A6C"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart (Pie Chart with hole) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Experiments Completion Rate
          </h3>
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
    </div>
  );
};

export default SchoolLabPage;
