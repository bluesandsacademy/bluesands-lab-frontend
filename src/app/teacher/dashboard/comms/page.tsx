"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
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

const TeacherCommsMetricPage = () => {
  const COLORS = ["#0483E2", "#00B69B", "#F59E0B", "#EF4444"];

  const lineChartData = [
    { month: "Jan", "teacher-student": 0, "student-teacher": 0 },
    { month: "Feb", "teacher-student": 0, "student-teacher": 0 },
    { month: "Mar", "teacher-student": 0, "student-teacher": 0 },
    { month: "Apr", "teacher-student": 0, "student-teacher": 0 },
    { month: "May", "teacher-student": 0, "student-teacher": 0 },
    { month: "Jun", "teacher-student": 0, "student-teacher": 0 },
  ];

  const lineChartTrendData = [
    { month: "Jan", activity: 0 },
    { month: "Feb", activity: 0 },
    { month: "Mar", activity: 0 },
    { month: "Apr", activity: 0 },
    { month: "May", activity: 0 },
    { month: "Jun", activity: 0 },
    { month: "Jul", activity: 0 },
    { month: "Aug", activity: 0 },
    { month: "Sep", activity: 0 },
    { month: "Oct", activity: 0 },
    { month: "Nov", activity: 0 },
    { month: "Dec", activity: 0 },
  ];

  const pieChartData = [
    { name: "Announcements", value: 400 },
    { name: "Assignments", value: 200 },
    { name: "Questions", value: 100 },
    { name: "Feedbacks", value: 50 },
  ];

  const statsConfig: StatCardData[] = [
    {
      title: "Total Messages",
      value: "294",
      icon: "/images/icon/teacher/black-msg.svg",
      //trendIcon: "/images/icon/trend_up.svg",
      //   percentageChange: " ",
      //   timeFrame: "across all classes",
    },
    {
      title: "Active Students",
      value: "3",
      icon: "/images/icon/teacher/avg-score.svg",
      // trendIcon: "/images/icon/trend_up.svg",
      //   percentageChange: "0%",
      //   timeFrame: "from last month",
    },
    {
      title: "Forum Post",
      value: "0",
      icon: "/images/icon/teacher/purple-msg.svg",
      // trendIcon: "/images/icon/trend_up.svg",
      //   percentageChange: " ",
      //   timeFrame: "average rate",
    },
    {
      title: "Response Rate",
      value: "0",
      icon: "/images/icon/teacher/monthly-avg.svg",
      //trendIcon: "/images/icon/trend_up.svg",
      //   percentageChange: " ",
      //   timeFrame: "All classes",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <StatCards stats={statsConfig} />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Line Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Messages Sent & Received
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="teacher-student"
                stroke="#0483E2"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="student-teacher"
                stroke="#263238"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Meaasages Types</h3>
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

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Participation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2 lg:w-[49%]">
          <p className="text-sm font-semibold text-gray-600">
            Discussion Forum Activity
          </p>
          <div
            className="flex flex-col
                 overflow-x-scroll"
          >
            <table className="bg-white rounded-md">
              <thead>
                <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                  <td className="p-2">Subject Name</td>
                  <td className="p-2">No of Posts</td>
                  <td className="p-2">Replies</td>
                  <td className="p-2">Participation Rate</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs border-b border-b-gray-200">
                  <td className="p-2">Chemistry</td>
                  <td className="p-2"> 312</td>
                  <td className="p-2">76</td>
                  <td className="p-2 text-blue-600">76%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCommsMetricPage;
