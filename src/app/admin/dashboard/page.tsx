"use client"
import StatCards from "@/components/Dashboard/StatCards";
import {
  AdminGeneralMetricStats,
  AdminLearningMetricStats,
  AdminUserOverviewStats,
} from "@/lib/data";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Sample data for charts
const lineChartData = [
  { month: "Jan", users: 720, schools: 40 },
  { month: "Feb", users: 800, schools: 60 },
  { month: "Mar", users: 700, schools: 44 },
  { month: "Apr", users: 500, schools: 30 },
  // { month: "May", users: 0, schools: 0 },
  // { month: "Jun", users: 150, schools: 0 },
  // { month: "Jul", users: 350, schools: 15 },
  // { month: "Aug", users: 428, schools: 15 },
  // { month: "Sep", users: 125, schools: 14 },
  // { month: "Oct", users: 200, schools: 32 },
  // { month: "Nov", users: 350, schools: 36 },
  // { month: "Dec", users: 100, schools: 8 },
];

const pieChartData = [
  { name: "Male Students", value: 722 },
  { name: "Female Students", value: 531 },
  // { name: "Others", value: 100 },
];

const barChartData = [
  { month: "Jan", revenue: 4550350 },
  { month: "Feb", revenue: 5810900 },
  { month: "Mar", revenue: 5000000 },
  { month: "Apr", revenue: 4150000 },
  // { month: "May", revenue: 0 },
  // { month: "Jun", revenue: 2690000 },
  // { month: "Jul", revenue: 2950000 },
  // { month: "Aug", revenue: 3680000 },
  // { month: "Sep", revenue: 4440000 },
  // { month: "Oct", revenue: 5650000 },
  // { month: "Nov", revenue: 0 },
  // { month: "Dec", revenue: 0 },
];

// const userDemographics = [
//   { country: "Nigeria", population: 0 },
//   { country: "Ghana", population: 0 },
//   { country: "Camerooon", population: 0 },
//   { country: "Benin", population: 0 },
//   { country: "South Africa", population: 0 },
//   { country: "Uganda", population: 0 },
// ];

const COLORS = ["#3b82f6", "#ec4899", "#f59e0b"];

const Page = () => {
  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-xs">General metrics</p>
        <StatCards stats={AdminGeneralMetricStats} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">Learning metrics</p>
        <StatCards stats={AdminLearningMetricStats} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">User Status Overview</p>
        <StatCards stats={AdminUserOverviewStats} />
      </div>

      {/* User Growth and user status charts */}
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
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="schools"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            User Status Distribution
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

      {/* Revenue Growth and User Demographics */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bar Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Revenue Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Demographics */}
       {/* <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow">
          <p className="text-sm font-semibold">User Demographics</p>
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
             {userDemographics.map((demo, index) => (
              <div
                key={index}
                className="bg-blue-400 rounded-md w-20 h-14 flex flex-col items-center justify-center text-xs"
              >
                <p className="text-blue-900 font-semibold">{demo.country}</p>
                <p className="text-white">{demo.population}</p>
              </div>
            ))} 
          </div> 
        </div> */}
      </div>
    </div>
  );
};

export default Page;
