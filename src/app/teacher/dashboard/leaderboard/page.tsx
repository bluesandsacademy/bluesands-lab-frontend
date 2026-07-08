"use client";

import { useUser } from "@/services/UserContext";
import {
  getTeacherLeaderboard,
  LeaderboardEntry,
} from "@/services/teacherDashboardService";
import { useEffect, useState } from "react";
import { FaDownload, FaMedal } from "react-icons/fa";

const rankColors: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

const TeacherLeaderboardPage = () => {
  const { token } = useUser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getTeacherLeaderboard(token);
        setEntries(data.entries);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, [token]);

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      {/* Header */}
      <div className="flex justify-between p-2 md:p-3 bg-white rounded-md">
        <div>
          <p className="font-semibold text-blue-950 lg:text-lg">Leaderboard</p>
          <p className="text-xs text-slate-500">
            Top performing students across your classes
          </p>
        </div>
        <button className="flex items-center gap-1 rounded-md p-2 px-3 text-xs md:text-sm text-white bg-blue-950">
          <FaDownload />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500">
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-left">Avg Score</th>
              <th className="p-3 text-left">Experiments</th>
              <th className="p-3 text-left">Badges</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 animate-pulse">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="p-3">
                      <div className="h-4 bg-gray-100 rounded w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-sm text-gray-400"
                >
                  No leaderboard data yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.userId}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    <span
                      className={`flex items-center gap-1 font-semibold ${rankColors[entry.rank] ?? "text-gray-700"}`}
                    >
                      {entry.rank <= 3 && <FaMedal className="text-xs" />}
                      {entry.rank}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {entry.studentName}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.avgScore >= 70
                          ? "bg-green-100 text-green-700"
                          : entry.avgScore >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {entry.avgScore}%
                    </span>
                  </td>
                  <td className="p-3 text-gray-600">
                    {entry.experimentsCompleted}
                  </td>
                  <td className="p-3 text-gray-600">{entry.badges}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherLeaderboardPage;
