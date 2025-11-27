"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { AddQuizModal } from "@/components/Teacher/QuizAnalytics/AddQuizModal";
import TeacherQuizAnalytics from "@/components/Teacher/QuizAnalytics/TeacherQuizAnalytics";
import TeacherQuizSubmissions from "@/components/Teacher/QuizAnalytics/TeacherQuizSubmissions";
import TeacherFilterButton from "@/components/Teacher/TeacherFilterButton";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";

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
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "average late submission rate",
  },
  {
    title: "Feedback Given",
    value: "0",
    icon: "/images/icon/teacher/warning-chat.svg",
    //trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "Total Feedback Given",
  },
];

const TeacherQuizzesPage = () => {
  const filters = ["Analytics", "View Submissions"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <StatCards stats={statsConfig} />
      <div className="flex justify-end">
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1 p-1 px-2 lg:p-2 text-xs lg:text-sm text-white bg-[#303C48] rounded-md "
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
      {
        isAddModalOpen && <AddQuizModal isOpen={isAddModalOpen} onClose={handleCloseModal}/>
      }
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
