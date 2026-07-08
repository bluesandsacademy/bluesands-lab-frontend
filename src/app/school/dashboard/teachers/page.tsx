"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { getSchoolAdminTeacherActivity } from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statsConfig: StatCardData[] = [
  {
    title: "Total Assignments",
    value: "0",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Average Feedback Time",
    value: "0",
    icon: "/images/icon/stopwatch.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Average Engagement Score",
    value: "0",
    icon: "/images/icon/total_payments.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Teachers",
    value: "0",
    icon: "/images/icon/active_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

interface TeacherActivityResponse {
  assignmentsCreated: [
    {
      teacherId: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
      teacherName: "string";
      assignments: 0;
    }
  ];
  avgFeedbackTurnaround: "string";
  engagementScores: [
    {
      teacherId: "3fa85f64-5717-4562-b3fc-2c963f66afa6";
      teacherName: "string";
      score: 0;
    }
  ];
}

const SchoolTeacherActivityPage = () => {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [activityData, setActivityData] = useState<TeacherActivityResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useUser();

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  const barChartData = [
    { teacher: "Chike", assignments: 10 },
    { teacher: "Bob", assignments: 30 },
    { teacher: "Mary", assignments: 51 },
    { teacher: "Becky", assignments: 23 },
    { teacher: "May", assignments: 5 },
    { teacher: "Joan", assignments: 0 },
    { teacher: "Uzor", assignments: 14 },
    { teacher: "Blossom", assignments: 6 },
    { teacher: "Kunle", assignments: 20 },
    { teacher: "Obi", assignments: 10 },
    { teacher: "Kola", assignments: 43 },
    { teacher: "Hassan", assignments: 20 },
  ];

  const pieChartData = [
    { name: "Excellent", value: 231 },
    { name: "Good", value: 175 },
    { name: "Needs Attention", value: 175 },
  ];

  useEffect(() => {
    if (!user || !token) return;

    async function fetchStats() {
      setIsLoading(true);
      try {
        const data = await getSchoolAdminTeacherActivity(token);

        const statsData: StatCardData[] = [
          {
            title: statsConfig[0].title,
            value: `${
              data.assignmentsCreated.assignments
                ? data.assignmentsCreated.assignments
                : "0"
            }`,
            icon: statsConfig[0].icon,
            trendIcon: statsConfig[0].trendIcon,
            percentageChange: statsConfig[0].percentageChange,
            timeFrame: statsConfig[0].timeFrame,
          },
          {
            title: statsConfig[1].title,
            value: `${data.avgFeedbackTurnaround ? data.avgFeedbackTurnaround : "0"}`,
            icon: statsConfig[1].icon,
            trendIcon: statsConfig[1].trendIcon,
            percentageChange: statsConfig[1].percentageChange,
            timeFrame: statsConfig[1].timeFrame,
          },
          {
            title: statsConfig[2].title,
            value: `${
              data.engagementScores.score ? data.engagementScores.score : "0"
            }`,
            icon: statsConfig[2].icon,
            trendIcon: statsConfig[2].trendIcon,
            percentageChange: statsConfig[2].percentageChange,
            timeFrame: statsConfig[2].timeFrame,
          },
          {
            title: statsConfig[3].title,
            value: data.engagementScores.length,
            icon: statsConfig[3].icon,
            trendIcon: statsConfig[3].trendIcon,
            percentageChange: statsConfig[3].percentageChange,
            timeFrame: statsConfig[3].timeFrame,
          },
        ];

        setStats(statsData);
        setActivityData(data);
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
      <StatCards stats={stats} isLoading={isLoading} />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Bar Chart */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Assignment Created By Teachers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData?.assignmentsCreated}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="teacherName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {/* <Bar dataKey="average_score" fill="#0483E2" />
            <Bar dataKey="attendance" fill="#10B981" /> */}
              <Bar dataKey="assignments" fill="#003A6C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Engagement Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData?.engagementScores}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ teacherName, percent }: any) =>
                  `${teacherName} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                innerRadius={50}
                fill="#8884d8"
                dataKey="score"
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

      <p className="text-sm font-semibold">Individual Teacher Performance</p>
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Teacher</td>
            <td className="p-2">Subject</td>
            <td className="p-2">Assignments Created</td>
            <td className="p-2">AVG Feedback Time</td>
            <td className="p-2">Engagement Score</td>
            <td className="p-2">Status</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Mary</td>
            <td className="p-2">Mathematics</td>
            <td className="p-2">18</td>
            <td className="p-2">1 day(s)</td>
            <td className="p-2">9.1/10</td>
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

export default SchoolTeacherActivityPage;
