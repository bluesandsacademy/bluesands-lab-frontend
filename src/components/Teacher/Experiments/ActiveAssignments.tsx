"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getTeacherAssignments,
  AssignmentSubmission,
} from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";

const ActiveAssignments = () => {
  const { token } = useUser();
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getTeacherAssignments(token);
        setSubmissions(data.submissions);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const totalStudents = submissions.reduce((s, a) => s + a.totalStudents, 0);
  const totalSubmitted = submissions.reduce((s, a) => s + a.submitted, 0);
  const avgScore =
    submissions.length > 0
      ? Math.round(
          submissions.reduce((s, a) => s + a.avgScore, 0) / submissions.length,
        )
      : 0;
  const completionRate =
    totalStudents > 0
      ? Math.round((totalSubmitted / totalStudents) * 100)
      : 0;

  const statsConfig: StatCardData[] = [
    {
      title: "Total Assignments",
      value: `${submissions.length}`,
      icon: "/images/icon/teacher/students.svg",
    },
    {
      title: "Students Assigned",
      value: `${totalStudents}`,
      icon: "/images/icon/teacher/avg-score.svg",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: "/images/icon/teacher/purple-lab.svg",
    },
    {
      title: "Average Score",
      value: `${avgScore}%`,
      icon: "/images/icon/teacher/orange-quiz.svg",
    },
  ];

  return (
    <div className="flex flex-col gap-3 lg:gap-6">
      <StatCards stats={statsConfig} isLoading={isLoading} />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Active Assignments</p>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-md text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <td className="p-2">Assignment</td>
                <td className="p-2">Type</td>
                <td className="p-2">Due Date</td>
                <td className="p-2">Turned In</td>
                <td className="p-2">Graded</td>
                <td className="p-2">Avg Score</td>
                <td className="p-2">Status</td>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="p-2">
                        <div className="h-3 bg-gray-100 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    No active assignments.
                  </td>
                </tr>
              ) : (
                submissions.map((a) => (
                  <tr
                    key={a.assignmentId}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-2 font-medium text-gray-800">{a.title}</td>
                    <td className="p-2">
                      <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full capitalize">
                        {a.type}
                      </span>
                    </td>
                    <td className="p-2">
                      {a.dueAt
                        ? new Date(a.dueAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="p-2">
                      {a.submitted}/{a.totalStudents}
                    </td>
                    <td className="p-2">{a.graded}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          a.avgScore >= 70
                            ? "bg-green-100 text-green-700"
                            : a.avgScore >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {a.avgScore}%
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-md capitalize ${
                          a.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveAssignments;
