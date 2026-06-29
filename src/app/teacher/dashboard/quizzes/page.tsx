"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { AddQuizModal } from "@/components/Teacher/QuizAnalytics/AddQuizModal";
import TeacherQuizAnalytics from "@/components/Teacher/QuizAnalytics/TeacherQuizAnalytics";
import TeacherQuizSubmissions from "@/components/Teacher/QuizAnalytics/TeacherQuizSubmissions";
import TeacherFilterButton from "@/components/Teacher/TeacherFilterButton";
import {
  exportGradebook,
  getTeacherClasses,
} from "@/services/teacherDashboardService";
import { useEffect, useState } from "react";
import { FaDownload, FaPlus, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const statsConfig: StatCardData[] = [
  {
    title: "Quizzes Created",
    value: "294",
    icon: "/images/icon/teacher/green-quiz.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "from last month",
  },
  {
    title: "Assignments Completion",
    value: "83%",
    icon: "/images/icon/teacher/bluewhite-check.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Late Submissions",
    value: "0",
    icon: "/images/icon/teacher/purple-clipboard-warning.svg",
    percentageChange: " ",
    timeFrame: "average late submission rate",
  },
  {
    title: "Feedback Given",
    value: "0",
    icon: "/images/icon/teacher/warning-chat.svg",
    percentageChange: " ",
    timeFrame: "Total Feedback Given",
  },
];

const TeacherQuizzesPage = () => {
  const filters = ["Analytics", "View Submissions"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");

  useEffect(() => {
    getTeacherClasses()
      .then((data) => {
        setClasses(data);
        if (data.length > 0) setSelectedClassId(data[0].id);
      })
      .catch(() => {
        // Classes endpoint unavailable — teacher can still use other features
      });
  }, []);

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
      <StatCards stats={statsConfig} />

      <div className="flex justify-end items-center gap-2 flex-wrap">
        {/* Class selector for gradebook export */}
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
          <FaPlus />
          Create Quiz
        </button>
      </div>

      <TeacherFilterButton
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {isAddModalOpen && (
        <AddQuizModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      )}

      {activeFilter === "Analytics" ? (
        <TeacherQuizAnalytics />
      ) : activeFilter === "View Submissions" ? (
        <TeacherQuizSubmissions />
      ) : (
        <TeacherQuizAnalytics />
      )}
    </div>
  );
};

export default TeacherQuizzesPage;
