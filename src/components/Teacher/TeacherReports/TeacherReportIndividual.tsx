"use client";

import {
  getTeacherLeaderboard,
  LeaderboardEntry,
} from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";

const TeacherReportIndividual = () => {
  const { token } = useUser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getTeacherLeaderboard(token);
        setEntries(data.entries);
      } catch (err) {
        console.error("Failed to fetch student list:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">Individual Student Performance</p>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-md text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <td className="p-2">Rank</td>
              <td className="p-2">Student Name</td>
              <td className="p-2">Avg Score</td>
              <td className="p-2">Experiments</td>
              <td className="p-2">Badges</td>
              <td className="p-2">Action</td>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 animate-pulse">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="p-2">
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  No student data yet.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.userId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-2 font-semibold text-gray-600">
                    #{entry.rank}
                  </td>
                  <td className="p-2 font-medium text-gray-800">
                    {entry.studentName}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium w-max inline-block ${
                        entry.avgScore >= 70
                          ? "bg-green-100 text-green-600"
                          : entry.avgScore >= 50
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {entry.avgScore}%
                    </span>
                  </td>
                  <td className="p-2">{entry.experimentsCompleted}</td>
                  <td className="p-2">{entry.badges}</td>
                  <td className="p-2 text-blue-600">
                    <a href={`/teacher/dashboard/students?id=${entry.userId}`}>
                      View Profile
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherReportIndividual;
