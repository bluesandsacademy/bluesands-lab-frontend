"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import SchoolWideTrend from "@/components/School/Dashboard/SchoolWideTrend";
import TeacherWelcomeBanner from "@/components/Teacher/TeacherWelcomeBanner";
import { useUser } from "@/services/UserContext";
import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const statsConfig: StatCardData[] = [
  {
    title: "Total Students",
    value: "0",
    icon: "/images/icon/teacher/students.svg",
    //trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "across all classes",
  },
  {
    title: "Average Score",
    value: "0",
    icon: "/images/icon/teacher/avg-score.svg",
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Lab Completion",
    value: "0",
    icon: "/images/icon/teacher/purple-lab.svg",
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "average rate",
  },
  {
    title: "Quiz Average",
    value: "0",
    icon: "/images/icon/teacher/orange-quiz.svg",
    //trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "All classes",
  },
  {
    title: "Active Students",
    value: "0",
    icon: "/images/icon/teacher/active-students.svg",
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "out of total enrolled",
  },
  {
    title: "Most Attempted Lab",
    value: "Lab",
    icon: "/images/icon/teacher/physics.svg",
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "0 attempts",
  },
];

const TeacherDashboardOverviewPage = () => {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useUser();
  const firstName = user?.fullName?.split(" ")[0];

  const lineChartData = [
    { month: "Jan", average: 0 },
    { month: "Feb", average: 0 },
    { month: "Mar", average: 0 },
    { month: "Apr", average: 0 },
    { month: "May", average: 0 },
    { month: "Jun", average: 0 },
    { month: "Jul", average: 0 },
    { month: "Aug", average: 0 },
    { month: "Sep", average: 0 },
    { month: "Oct", average: 0 },
    { month: "Nov", average: 0 },
    { month: "Dec", average: 0 },
  ];

  //   useEffect(() => {
  //   if (!user || !token) return;

  //   async function fetchStats() {
  //     setIsLoading(true);
  //     try {
  //       const data = await getSchoolAdminDashboard(token);

  //       const statsData: StatCardData[] = [
  //         {
  //           title: statsConfig[0].title,
  //           value: `${data.counts.students}`,
  //           icon: statsConfig[0].icon,
  //           trendIcon: statsConfig[0].trendIcon,
  //           percentageChange: statsConfig[0].percentageChange,
  //           timeFrame: statsConfig[0].timeFrame,
  //         },
  //         {
  //           title: statsConfig[1].title,
  //           value: `${data.counts.teachers}`,
  //           icon: statsConfig[1].icon,
  //           trendIcon: statsConfig[1].trendIcon,
  //           percentageChange: statsConfig[1].percentageChange,
  //           timeFrame: statsConfig[1].timeFrame,
  //         },
  //         {
  //           title: statsConfig[2].title,
  //           value: `${data.activity7d.experiments}`,
  //           icon: statsConfig[2].icon,
  //           trendIcon: statsConfig[2].trendIcon,
  //           percentageChange: statsConfig[2].percentageChange,
  //           timeFrame: statsConfig[2].timeFrame,
  //         },
  //         {
  //           title: statsConfig[3].title,
  //           value: `${data.activity7d.quizzes}`,
  //           icon: statsConfig[3].icon,
  //           trendIcon: statsConfig[3].trendIcon,
  //           percentageChange: statsConfig[3].percentageChange,
  //           timeFrame: statsConfig[3].timeFrame,
  //         },
  //         {
  //           title: statsConfig[4].title,
  //           value: `${data.activity7d.activeUsers}`,
  //           icon: "/images/icon/student_dark.svg",
  //           trendIcon: "/images/icon/trend_up.svg",
  //           percentageChange: "0%",
  //           timeFrame: "from last month",
  //         },
  //         {
  //           title: statsConfig[5].title,
  //           value: "0", // Wait for backend to provide this data
  //           icon: "/images/icon/active_teacher.svg",
  //           trendIcon: "/images/icon/trend_up.svg",
  //           percentageChange: "0%",
  //           timeFrame: "from last month",
  //         },
  //       ];

  //       setStats(statsData);
  //     } catch (err) {
  //       console.error("Error fetching stats:", err);

  //       const fallbackStats: StatCardData[] = statsConfig.map((stat) => ({
  //         title: stat.title,
  //         value: "0",
  //         icon: stat.icon,
  //         trendIcon: stat.trendIcon,
  //         percentageChange: stat.percentageChange,
  //         timeFrame: stat.timeFrame,
  //       }));

  //       setStats(fallbackStats);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchStats();
  // }, [user, token]);

  return (
    <div className="p-4 space-y-4">
      <TeacherWelcomeBanner firstName={firstName || ""} />
      <StatCards stats={statsConfig} />

      {/* Line chart */}
      <div className=" flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Performance Trends</h3>
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:justify-between">
        <div className="flex flex-col gap-3 bg-white rounded-md p-3 w-full md:w-96">
          <p className="text-blue-950 text-sm lg:text-base font-semibold">
            Recent Activities
          </p>
        </div>

        <div className="flex flex-col p-2 gap-4 w-full md:w-96 rounded-lg bg-white ">
          <strong className="text-sm md:text-base text-gray-500">
            Top Performing Students
          </strong>
        </div>

        <div className="flex flex-col p-2 gap-4 w-full md:w-96 rounded-lg bg-white">
          <strong className="text-sm md:text-base text-gray-500">
            Struggling Students
          </strong>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardOverviewPage;
