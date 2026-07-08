"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { CreateLearningSpaceModal } from "@/components/Teacher/LearningSpaces/CreateLearningSpace";
import { UseAppTour } from "@/hooks/UseAppTour";
import {
  getTeacherAnalyticsOverview,
  getTeacherAssignments,
  getTeacherClasses,
  AssignmentSubmission,
} from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";

interface ClassOption {
  id: string;
  name: string;
}

const TeacherClassManagementPage = () => {
  const { token } = useUser();
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [assignments, setAssignments] = useState<AssignmentSubmission[]>([]);
  const [statsConfig, setStatsConfig] = useState<StatCardData[]>([
    { title: "Total Students", value: "0", icon: "/images/icon/teacher/students.svg", percentageChange: " ", timeFrame: "across all classes" },
    { title: "Active Students", value: "0", icon: "/images/icon/teacher/active-students.svg", percentageChange: " ", timeFrame: "out of total enrolled" },
    { title: "Average Performance", value: "0", icon: "/images/icon/teacher/avg-score.svg", percentageChange: "0%", timeFrame: "from last month" },
    { title: "Active Assignments", value: "0", icon: "/images/icon/teacher/orange-quiz.svg", percentageChange: " ", timeFrame: "all classes" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const { startTour } = UseAppTour();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [overview, assignmentsData, classesData] = await Promise.all([
          getTeacherAnalyticsOverview(token),
          getTeacherAssignments(token),
          getTeacherClasses(token),
        ]);

        setStatsConfig([
          { title: "Total Students", value: `${overview.totalStudents}`, icon: "/images/icon/teacher/students.svg", percentageChange: " ", timeFrame: "across all classes" },
          { title: "Active Students", value: `${overview.activeStudentsThisWeek}`, icon: "/images/icon/teacher/active-students.svg", percentageChange: " ", timeFrame: "out of total enrolled" },
          { title: "Average Performance", value: `${overview.avgClassScore}%`, icon: "/images/icon/teacher/avg-score.svg", percentageChange: " ", timeFrame: "across all classes" },
          { title: "Active Assignments", value: `${overview.totalAssignments}`, icon: "/images/icon/teacher/orange-quiz.svg", percentageChange: " ", timeFrame: "all classes" },
        ]);

        setAssignments(assignmentsData.submissions);
        setClasses(classesData);
        if (classesData.length > 0) setSelectedClassId(classesData[0].id);
      } catch (err) {
        console.error("Failed to fetch class data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <>
      <div className="flex flex-col gap-4 p-2 lg:p-4">
        <div className="flex">
          <button
            onClick={() => startTour("teacherClassMgt")}
            className="border border-blue-900 rounded py-0.5 px-2 text-blue-900 text-sm"
          >
            View Page Tutorial
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 justify-between p-2 rounded-md bg-white">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <button
              onClick={() => router.push("/teacher/dashboard/classes/create-space")}
              className="create-ils bg-[#00B69B] w-fit text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5"
            >
              <CgNotes /> Create Learning Space
            </button>
            <Link href="/teacher/dashboard/classes/learning-space">
              <button className="view-ils bg-[#006FCC] text-xs lg:text-sm h-full p-2 rounded-md text-white flex items-center gap-1.5">
                <FaRegEdit /> My Learning Spaces
              </button>
            </Link>
          </div>

          <div className="flex gap-2 lg:gap-4 flex-col md:flex-row">
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-sm p-2 rounded border border-gray-100"
            >
              {classes.length === 0 ? (
                <option value="">No classes yet</option>
              ) : (
                classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>

            {selectedClass && (
              <button
                onClick={() => navigator.clipboard.writeText(selectedClass.id)}
                className="flex flex-col text-xs bg-blue-50 rounded-md p-1.5 items-start"
              >
                <p className="text-[7px]">CLASS CODE</p>
                <p className="italic flex items-center gap-1.5 text-bgBlue">
                  {selectedClass.name.substring(0, 6).toUpperCase()}{" "}
                  <IoCopyOutline />
                </p>
              </button>
            )}
          </div>
        </div>

        <div className="teacher-class-metrics">
          <StatCards stats={statsConfig} isLoading={isLoading} />
        </div>

        {/* Student list — per-class student API not yet available */}
        <div className="flex flex-col gap-2 teacher-view-students">
          <div className="flex justify-between items-end">
            <p className="text-sm font-semibold">Student List</p>
            <button className="bg-[#006FCC] text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5">
              <FaPlus /> Add Student
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-md text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <td className="p-2">Student Name</td>
                  <td className="p-2">Student Email</td>
                  <td className="p-2">Phone Number</td>
                  <td className="p-2">Date Joined</td>
                  <td className="p-2">Performance</td>
                  <td className="p-2">Status</td>
                  <td className="p-2">Action</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">
                    Select a class to view its students.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="flex flex-col gap-2 teacher-view-assignments">
          <p className="text-sm font-semibold">Recent Assignments</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-md text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <td className="p-2">Topic</td>
                  <td className="p-2">Type</td>
                  <td className="p-2">Due Date</td>
                  <td className="p-2">Turned In</td>
                  <td className="p-2">Avg Score</td>
                  <td className="p-2">Status</td>
                  <td className="p-2">Action</td>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100 animate-pulse">
                      {Array.from({ length: 7 }).map((__, j) => (
                        <td key={j} className="p-2">
                          <div className="h-3 bg-gray-100 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : assignments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-400">
                      No assignments yet.
                    </td>
                  </tr>
                ) : (
                  assignments.map((a) => (
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
                        {a.submitted}/{a.totalStudents} turned in
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            a.avgScore >= 70
                              ? "text-blue-600"
                              : a.avgScore >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {a.avgScore}%
                        </span>
                      </td>
                      <td className="p-2">
                        <span
                          className={`flex w-max p-0.5 px-2 items-center justify-center rounded-md capitalize ${
                            a.status === "active"
                              ? "bg-green-200 text-green-600"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button className="flex gap-1 items-center">
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
      </div>

      {isCreateSpaceOpen && (
        <CreateLearningSpaceModal
          isOpen={isCreateSpaceOpen}
          onClose={() => setIsCreateSpaceOpen(false)}
        />
      )}
    </>
  );
};

export default TeacherClassManagementPage;
