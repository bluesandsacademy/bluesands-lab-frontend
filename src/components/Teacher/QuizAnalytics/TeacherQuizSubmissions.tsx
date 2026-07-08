"use client";

import {
  getTeacherAssignments,
  AssignmentSubmission,
} from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { RiExportFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";

const TeacherQuizSubmissions = () => {
  const { token } = useUser();
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [filtered, setFiltered] = useState<AssignmentSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getTeacherAssignments(token);
        setSubmissions(data.submissions);
        setFiltered(data.submissions);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    setFiltered(
      submissions.filter((s) =>
        s.title.toLowerCase().includes(q.toLowerCase()),
      ),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row justify-between items-center p-2 rounded-md bg-white gap-2">
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            className="border border-gray-200 rounded-md text-xs p-2 focus:ring-0"
            placeholder="Search assignment by name"
          />
          <button className="flex items-center gap-1 text-xs lg:text-sm border border-gray-100 rounded-md p-2 shadow-sm">
            <FaFilter /> Filter
          </button>
        </div>
        <button className="flex items-center gap-1 p-1 px-2 lg:p-2 text-xs lg:text-sm text-white bg-[#303C48] rounded-md">
          <RiExportFill /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-md text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <td className="p-2">Title</td>
              <td className="p-2">Type</td>
              <td className="p-2">Due Date</td>
              <td className="p-2">Submitted</td>
              <td className="p-2">Graded</td>
              <td className="p-2">Avg Score</td>
              <td className="p-2">Status</td>
              <td className="p-2">Action</td>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 animate-pulse">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="p-2">
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-400">
                  {search ? "No matching assignments." : "No submissions yet."}
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
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
                    {a.submitted}/{a.totalStudents}
                  </td>
                  <td className="p-2">{a.graded}</td>
                  <td className="p-2">
                    <span
                      className={`p-1.5 rounded-full text-white w-max inline-block ${
                        a.avgScore >= 70
                          ? "bg-teal-600"
                          : a.avgScore >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    >
                      {a.avgScore}%
                    </span>
                  </td>
                  <td className="p-2">
                    <span
                      className={`font-medium ${a.status === "active" ? "text-teal-600" : "text-gray-500"}`}
                    >
                      {a.status}
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
    </div>
  );
};

export default TeacherQuizSubmissions;
