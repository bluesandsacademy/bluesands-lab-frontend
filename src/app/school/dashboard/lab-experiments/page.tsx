"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { getSchoolAdminExperiments } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
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

interface ExperimentResponse {
  experimentsTotal: number;
  completionRates: [
    {
      classroomId: string;
      className: string;
      completionPercent: number;
      participants: number;
    }
  ];
  resourceUsagePercent: number;
  coursePopularity: [
    {
      courseOrModule: string;
      views: number;
    }
  ];
}

const statsConfig: StatCardData[] = [
  {
    title: "Total Experiment",
    value: "0",
    icon: "/images/icon/beaker_01.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Average Completion Rate",
    value: "0%",
    icon: "/images/icon/chart.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Resource Usage",
    value: "0%",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Users",
    value: "1",
    icon: "/images/icon/calendar.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

const SchoolLabPage = () => {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [experimentData, setExperimentData] = useState<ExperimentResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useUser();

  const COLORS = ["#003A6C", "#00B69B"];

  const lineChartData = [
    { month: "Jan", loginCount: 0 },
    { month: "Feb", loginCount: 0 },
    { month: "Mar", loginCount: 0 },
    { month: "Apr", loginCount: 0 },
    { month: "May", loginCount: 0 },
    { month: "Jun", loginCount: 0 },
    { month: "Jul", loginCount: 0 },
    { month: "Aug", loginCount: 0 },
    { month: "Sep", loginCount: 0 },
    { month: "Oct", loginCount: 0 },
    { month: "Nov", loginCount: 0 },
    { month: "Dec", loginCount: 0 },
  ];

  const pieChartData = [
    // { name: "remaining", value: 400 },
    // { name: "completed", value: 100 },
    { name: "remaining", value: 0 },
    { name: "completed", value: 0 },
  ];

  const barChartData = [
    { subject: "Math", average_score: 0, attendance: 0, lab_completion: 0 },
    {
      subject: "Physics",
      average_score: 0,
      attendance: 0,
      lab_completion: 0,
    },
    {
      subject: "Chemistry",
      average_score: 0,
      attendance: 0,
      lab_completion: 0,
    },
    {
      subject: "Biology",
      average_score: 0,
      attendance: 0,
      lab_completion: 0,
    },
  ];

  useEffect(() => {
    if (!user || !token) return;

    async function fetchStats() {
      setIsLoading(true);
      try {
        const data = await getSchoolAdminExperiments(token);

        const statsData: StatCardData[] = [
          {
            title: statsConfig[0].title,
            value: `${data.experimentsTotal}`,
            icon: statsConfig[0].icon,
            trendIcon: statsConfig[0].trendIcon,
            percentageChange: statsConfig[0].percentageChange,
            timeFrame: statsConfig[0].timeFrame,
          },
          {
            title: statsConfig[1].title,
            value: `${
              data.completionRates.completionPercent
                ? data.completionRates.completionPercent
                : "0"
            }`,
            icon: statsConfig[1].icon,
            trendIcon: statsConfig[1].trendIcon,
            percentageChange: statsConfig[1].percentageChange,
            timeFrame: statsConfig[1].timeFrame,
          },
          {
            title: statsConfig[2].title,
            value: `${data.resourceUsagePercent}`,
            icon: statsConfig[2].icon,
            trendIcon: statsConfig[2].trendIcon,
            percentageChange: statsConfig[2].percentageChange,
            timeFrame: statsConfig[2].timeFrame,
          },
          {
            title: statsConfig[3].title,
            value: `${
              data.completionRates.participants
                ? data.completionRates.participants
                : "0"
            }`,
            icon: statsConfig[3].icon,
            trendIcon: statsConfig[3].trendIcon,
            percentageChange: statsConfig[3].percentageChange,
            timeFrame: statsConfig[3].timeFrame,
          },
        ];

        setStats(statsData);
        setExperimentData(data);
      } catch (err) {
        console.error("Error fetching stats:", err);

        const fallbackStats: StatCardData[] = statsConfig.map((stat) => ({
          title: stat.title,
          value: "0",
          icon: stat.icon,
          trendIcon: stat.trendIcon,
          percentageChange: stat.percentageChange,
          timeFrame: stat.timeFrame,
        }));

        setStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user, token]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <StatCards stats={stats} isLoading={isLoading}/>
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">
          Course / Module Popularity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={experimentData?.coursePopularity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="courseOrModule" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="average_score" fill="#0483E2" />
            <Bar dataKey="attendance" fill="#10B981" />
            <Bar dataKey="lab_completion" fill="#003A6C" /> */}
            <Bar dataKey="views" fill="#10B981" />
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
