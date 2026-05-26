"use client";
import ReportTable from "@/components/Dashboard/ReportTable";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { getStudentLeaderboard } from "@/services/dashboard-service";
import FilterButton from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useState } from "react";

 interface LeaderboardResponse {
//   topStudents: [
//     {
//       userId: string;
//       name: string;
//       score: number;
//       rank: number;
//     }
//   ];
//   topTeachers: [
//     {
//       userId: string;
//       name: string;
//       activities: number;
//       rank: number;
//     }
//   ];
//   regionalCompare: [
//     {
//       schoolId: string;
//       schoolName: string;
//       score: number;
//       rank: number;
//     }
//   ];
 }

const DashboardLeaderboardPage = () => {
  const { user, token } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  const [LeaderboardData, setLeaderboardData] = useState<LeaderboardResponse[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStudentLeaderboard(token);
        setLeaderboardData(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, [user, token]);

  // Filter options
  const filters = ["Classmates", "Schoolmates", "Nationwide users"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  // Table configurations
  const tableConfig = {
    Classmates: {
      headings: ["Name", "Subject", "Simulation", "Percentage"],
      data: [
        // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "97%"},
        // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "95%"},
        // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "92%"},
        // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "90%"},
      ],
    },
    Schoolmates: {
      headings: ["Name", "Subject", "Simulation", "Percentage"],
      data: [
        // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "97%"},
        // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "95%"},
        // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "92%"},
        // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "90%"},
      ],
    },
    "Nationwide users": {
      headings: ["Name", "Subject", "Simulation", "Percentage"],
      data: [
        // {name: "Alex Chen", subject: "Physics", simulation:"Post Sim", percentage: "99%"},
        // {name: "Sarah Johnson", subject: "Chemistry", simulation:"Post Sim", percentage: "98%"},
        // {name: "Mike Rodriguez", subject: "Biology", simulation:"Pre Sim", percentage: "98%"},
        // {name: "Emma Wison", subject: "Mathematics", simulation:"Pre Sim", percentage: "97%"},
      ],
    },
  };

  // Get current table data based on active filter
  const getCurrentTableData = () => {
    return tableConfig[activeFilter as keyof typeof tableConfig];
  };

  const currentData = getCurrentTableData();

  return (
    <div className="p-4 space-y-4">
      <WelcomeBanner firstName={firstName || ""} />

      <div className="relative">
        <div className="blur-sm pointer-events-none select-none opacity-60">
          <h2 className="font-bold text-lg mb-2">Leaderboard</h2>

          <FilterButton
            filters={filters}
            onFilterChange={setActiveFilter}
            activeFilter={activeFilter}
          />

          <div className="mt-4">
            <ReportTable
              headings={currentData.headings}
              data={currentData.data}
              totalItems={currentData.data.length}
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-bgBlue text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardLeaderboardPage;
