"use client";

import ActiveAssignments from "@/components/Teacher/Experiments/ActiveAssignments";
import AssignExperiments from "@/components/Teacher/Experiments/AssignExperiments";
import StudentProgressTracking from "@/components/Teacher/Experiments/StudentProgressTracking";
import TeacherFilterButton from "@/components/Teacher/TeacherFilterButton";
import { useState } from "react";

const filters = ["Assign Experiments", "Active Assignments", "Progress Tracking"];

const TeacherExperimentMgtPage = () => {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <div className="bg-white rounded-md p-2 flex justify-between px-3">
        <div className="flex flex-col">
          <p className="text-base lg:text-lg font-semibold">
            Experiment Management
          </p>
          <p className="text-xs text-gray-500">
            Assign STEM experiments and track student progress
          </p>
        </div>
      </div>

      <TeacherFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      {activeFilter === "Assign Experiments" ? (
        <AssignExperiments />
      ) : activeFilter === "Active Assignments" ? (
        <ActiveAssignments />
      ) : (
        <StudentProgressTracking />
      )}
    </div>
  );
};

export default TeacherExperimentMgtPage;
