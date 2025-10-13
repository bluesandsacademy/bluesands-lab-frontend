"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import SchoolWelcomeBanner from "@/components/School/Dashboard/SchoolWelcomeBanner";
import SchoolWideTrend from "@/components/School/Dashboard/SchoolWideTrend";
import { getSchoolAdminDashboard } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";

const statsConfig: StatCardData[] = [
  {
    title: "Total Students",
    value: "0",
    icon: "/images/icon/student_blue.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Total Teachers",
    value: "0",
    icon: "/images/icon/card_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Experiments Conducted",
    value: "0",
    icon: "/images/icon/microscope.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Average Quiz Score",
    value: "0",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Students",
    value: "0",
    icon: "/images/icon/student_dark.svg",
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

const SchoolDashboardPage = () => {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useUser();
  const firstName = user?.fullName?.split(" ")[0];

  useEffect(() => {
  if (!user || !token) return;

  async function fetchStats() {
    setIsLoading(true);
    try {
      const data = await getSchoolAdminDashboard(token);

      const statsData: StatCardData[] = [
        {
          title: statsConfig[0].title,
          value: `${data.counts.students}`,
          icon: statsConfig[0].icon,
          trendIcon: statsConfig[0].trendIcon,
          percentageChange: statsConfig[0].percentageChange,
          timeFrame: statsConfig[0].timeFrame,
        },
        {
          title: statsConfig[1].title,
          value: `${data.counts.teachers}`,
          icon: statsConfig[1].icon,
          trendIcon: statsConfig[1].trendIcon,
          percentageChange: statsConfig[1].percentageChange,
          timeFrame: statsConfig[1].timeFrame,
        },
        {
          title: statsConfig[2].title,
          value: `${data.activity7d.experiments}`, 
          icon: statsConfig[2].icon,
          trendIcon: statsConfig[2].trendIcon,
          percentageChange: statsConfig[2].percentageChange,
          timeFrame: statsConfig[2].timeFrame,
        },
        {
          title: statsConfig[3].title,
          value: `${data.activity7d.quizzes}`,
          icon: statsConfig[3].icon,
          trendIcon: statsConfig[3].trendIcon,
          percentageChange: statsConfig[3].percentageChange,
          timeFrame: statsConfig[3].timeFrame,
        },
        {
          title: statsConfig[4].title,
          value: `${data.activity7d.activeUsers}`, 
          icon: "/images/icon/student_dark.svg",
          trendIcon: "/images/icon/trend_up.svg",
          percentageChange: "0%",
          timeFrame: "from last month",
        },
        {
          title: statsConfig[5].title,
          value: "0", // Wait for backend to provide this data
          icon: "/images/icon/active_teacher.svg",
          trendIcon: "/images/icon/trend_up.svg",
          percentageChange: "0%",
          timeFrame: "from last month",
        },
      ];

      setStats(statsData);
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
    <div className="p-4 space-y-4">
      <SchoolWelcomeBanner firstName={firstName || ""} />
      <StatCards stats={stats} />
      <div className=" flex flex-col md:flex-row items-center gap-6">
        <SchoolWideTrend />
        <div className="flex flex-col p-4 gap-4 w-full md:w-96 rounded-lg bg-white lg:py-14">
          <strong className="text-sm md:text-base text-gray-500">
            Subscription
          </strong>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Plan Type</p>
            <p className="text-green-400 text-xs md:text-sm">
              Active: renews in mont dd, yyyy
            </p>
            <p className="text-xs md:text-sm">Payment: cardtype card***num</p>
          </div>
          <button className="text-white bg-blue-950 rounded-md p-2 text-sm">
            Manage subscription
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 bg-white rounded-md p-3">
        <p className="text-blue-950 text-sm lg:text-base font-semibold">
          Recent Activities
        </p>
      </div>
    </div>
  );
};

export default SchoolDashboardPage;
