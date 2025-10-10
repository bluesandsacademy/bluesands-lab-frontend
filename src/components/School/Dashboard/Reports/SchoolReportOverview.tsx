import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import React from "react";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const statsConfig: StatCardData[] = [
  {
    title: "Average Score",
    value: "0",
    icon: "/images/icon/active_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Total Students",
    value: "0",
    icon: "/images/icon/student_dark.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Attendance Rate",
    value: "0",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Classes",
    value: "0",
    icon: "/images/icon/card_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

const SchoolReportOverview = () => {
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#00B69B"];

  const lineChartData = [
    { month: "Jan", average: 0, attendance: 0 },
    { month: "Feb", average: 0, attendance: 0 },
    { month: "Mar", average: 0, attendance: 0 },
    { month: "Apr", average: 0, attendance: 0 },
    { month: "May", average: 0, attendance: 0 },
    { month: "Jun", average: 0, attendance: 0 },
    { month: "Jul", average: 0, attendance: 0 },
    { month: "Aug", average: 0, attendance: 0 },
    { month: "Sep", average: 0, attendance: 0 },
    { month: "Oct", average: 0, attendance: 0 },
    { month: "Nov", average: 0, attendance: 0 },
    { month: "Dec", average: 0, attendance: 0 },
  ];

  const pieChartData = [
    { name: "Biology", value: 400 },
    { name: "math", value: 100 },
    { name: "Chemistry", value: 200 },
    { name: "physics", value: 200 },
  ];

  return (
    <div className=" flex flex-col gap-4">
      <StatCards stats={statsConfig} />

      <div className="flex flex-col lg:flex-row gap-4">
              {/* Line Chart */}
              <div className="flex-1 bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold mb-4">School Performance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#003A6C"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#263238"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
      
              {/* Donut Chart (Pie Chart with hole) */}
              <div className="flex-1 bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold mb-4">
                  Subject Distribution
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

export default SchoolReportOverview;
