"use client";

import {
  getTeacherAssignments,
  getTeacherFeedback,
  AssignmentSubmission,
} from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { RiExportFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from "recharts";

const TeacherQuizAnalytics = () => {
  const { token } = useUser();
  const [assignmentData, setAssignmentData] = useState<
    { month: string; created: number; submitted: number }[]
  >([]);
  const [feedbackData, setFeedbackData] = useState<
    { month: string; feedback: number }[]
  >([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [assignments, feedback] = await Promise.all([
          getTeacherAssignments(token),
          getTeacherFeedback(token),
        ]);
        setAssignmentData(assignments.data);
        setSubmissions(assignments.submissions);
        setFeedbackData(feedback.data);
      } catch (err) {
        console.error("Failed to fetch quiz analytics:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const chartSkeleton = (
    <div className="animate-pulse bg-gray-100 rounded-lg h-[300px] w-full" />
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1 p-1 px-2 lg:p-2 text-xs lg:text-sm text-white bg-[#303C48] rounded-md">
          <RiExportFill />
          Export
        </button>
      </div>

      {/* Assignments table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-md text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <td className="p-2">Title</td>
              <td className="p-2">Type</td>
              <td className="p-2">Due Date</td>
              <td className="p-2">Status</td>
              <td className="p-2">Submissions</td>
              <td className="p-2">Graded</td>
              <td className="p-2">Avg Score</td>
              <td className="p-2">Action</td>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 animate-pulse">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="p-2">
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-400">
                  No assignments yet.
                </td>
              </tr>
            ) : (
              submissions.map((a) => (
                <tr
                  key={a.assignmentId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-2 font-medium text-gray-800">{a.title}</td>
                  <td className="p-2 capitalize">{a.type}</td>
                  <td className="p-2">
                    {a.dueAt ? new Date(a.dueAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-2">
                    <span
                      className={`text-xs font-medium ${a.status === "active" ? "text-green-600" : "text-gray-500"}`}
                    >
                      {a.status}
                    </span>
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
                    <button>
                      <SlOptionsVertical />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-semibold text-gray-600 mb-4">
            Assignments Created vs Submitted
          </p>
          {isLoading ? (
            chartSkeleton
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assignmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="created" name="Created" fill="#006FCC" />
                <Bar dataKey="submitted" name="Submitted" fill="#00B69B" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Feedback Timeline</h3>
          {isLoading ? (
            chartSkeleton
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feedbackData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="feedback"
                  name="Feedback"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizAnalytics;
