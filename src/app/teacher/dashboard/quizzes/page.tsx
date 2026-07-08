"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { AddQuizModal } from "@/components/Teacher/QuizAnalytics/AddQuizModal";
import TeacherQuizAnalytics from "@/components/Teacher/QuizAnalytics/TeacherQuizAnalytics";
import TeacherQuizSubmissions from "@/components/Teacher/QuizAnalytics/TeacherQuizSubmissions";
import TeacherFilterButton from "@/components/Teacher/TeacherFilterButton";
import {
  exportGradebook,
  getTeacherAssignments,
  getTeacherClasses,
  getTeacherFeedback,
} from "@/services/teacherDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { FaDownload, FaPlus, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const TeacherQuizzesPage = () => {
  const { token } = useUser();
  const filters = ["Analytics", "View Submissions"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [stats, setStats] = useState<StatCardData[]>([
    { title: "Quizzes Created", value: "0", icon: "/images/icon/teacher/green-quiz.svg" },
    { title: "Assignments Completion", value: "0%", icon: "/images/icon/teacher/bluewhite-check.svg" },
    { title: "Late Submissions", value: "—", icon: "/images/icon/teacher/purple-clipboard-warning.svg" },
    { title: "Feedback Given", value: "0", icon: "/images/icon/teacher/warning-chat.svg" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [assignmentsData, feedbackData, classesData] = await Promise.all([
          getTeacherAssignments(token),
          getTeacherFeedback(token),
          getTeacherClasses(token),
        ]);

        const subs = assignmentsData.submissions;
        const totalStudents = subs.reduce((s, a) => s + a.totalStudents, 0);
        const totalSubmitted = subs.reduce((s, a) => s + a.submitted, 0);
        const completionRate =
          totalStudents > 0
            ? Math.round((totalSubmitted / totalStudents) * 100)
            : 0;
        const totalFeedback = feedbackData.data.reduce(
          (s, d) => s + d.feedback,
          0,
        );

        setStats([
          { title: "Quizzes Created", value: `${subs.length}`, icon: "/images/icon/teacher/green-quiz.svg" },
          { title: "Assignments Completion", value: `${completionRate}%`, icon: "/images/icon/teacher/bluewhite-check.svg" },
          { title: "Late Submissions", value: "—", icon: "/images/icon/teacher/purple-clipboard-warning.svg", timeFrame: "not yet available" },
          { title: "Feedback Given", value: `${totalFeedback}`, icon: "/images/icon/teacher/warning-chat.svg" },
        ]);

        setClasses(classesData);
        if (classesData.length > 0) setSelectedClassId(classesData[0].id);
      } catch (err) {
        console.error("Failed to fetch quiz stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const handleExportGradebook = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class to export its gradebook.");
      return;
    }
    setIsExporting(true);
    try {
      await exportGradebook(selectedClassId);
      toast.success("Gradebook downloaded.");
    } catch {
      toast.error("Failed to export gradebook. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <StatCards stats={stats} isLoading={isLoading} />

      <div className="flex justify-end items-center gap-2 flex-wrap">
        {classes.length > 0 && (
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border border-gray-300 rounded-md p-1 px-2 text-xs lg:text-sm text-gray-700 bg-white"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleExportGradebook}
          disabled={isExporting}
          className="flex items-center gap-1 p-1 px-2 lg:p-2 text-xs lg:text-sm text-white bg-[#303C48] rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
          {isExporting ? "Exporting..." : "Export Gradebook"}
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1 p-1 px-2 lg:p-2 text-xs lg:text-sm text-white bg-[#303C48] rounded-md"
        >
          <FaPlus /> Create Quiz
        </button>
      </div>

      <TeacherFilterButton
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isAddModalOpen && (
        <AddQuizModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {activeFilter === "Analytics" ? (
        <TeacherQuizAnalytics />
      ) : (
        <TeacherQuizSubmissions />
      )}
    </div>
  );
};

export default TeacherQuizzesPage;
