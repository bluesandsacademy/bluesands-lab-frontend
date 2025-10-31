"use client";
import EngagementTable from "@/components/Admin/Experiment-Content/EngagementTable";
import ExperimentTable from "@/components/Admin/Experiment-Content/ExperimentTable";
import QuizTable from "@/components/Admin/Experiment-Content/QuizTable";
import FilterButton from "@/services/FilterButton";
import { useState } from "react";
import { FaFilter, FaPlus } from "react-icons/fa";

const AdminExperimentsPage = () => {
  const filters = ["Experiments", "Subject & Quizzes", "Engagement"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const tableFilters = ["All Subjects", "Physics", "Chemistry", "Biology"];
  const engagementFilters = ["All Time", "Last 30 Days"];
  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <FilterButton
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        filters={filters}
      />

      <div
        className={`flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-end md:items-center p-4 rounded-md bg-white  ${
          activeFilter === "Engagement" && "hidden"
        }`}
      >
        <div className="flex text-xs md:text-sm gap-4 items-center">
          <input
            type="search"
            name="search"
            id=""
            placeholder={`Search ${activeFilter}`}
            className="text-xs lg:text-sm rounded-md p-2 border border-gray-300"
          />
          <div className="flex items-center text-gray-500 rounded-md p-2 border border-gray-200">
            <FaFilter />
            <select name="filter" id="filter">
              {tableFilters.map((filter, index) => (
                <option value="item" key={index}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="flex gap-1 items-center text-white bg-bgBlue rounded-md text-xs lg:text-sm p-2">
          <FaPlus /> Add Experiment
        </button>
      </div>

      {activeFilter === "Engagement" && (
        <div className="flex justify-end gap-2">
          <select name="engagementFilter" id="engagementFilter" className="text-xs lg:text-sm rounded-md border border-gray-200 p-2">
            {engagementFilters.map((filter, index) => (
              <option key={index} value="">
                {filter}
              </option>
            ))}
          </select>
          <button className="text-xs lg:text-sm border border-gray-200 rounded-md p-2">Export</button>
        </div>
      )}

      {activeFilter === "Experiments" ? (
        <ExperimentTable />
      ) : activeFilter === "Subject & Quizzes" ? (
        <QuizTable />
      ) : activeFilter === "Engagement" ? (
        <EngagementTable />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminExperimentsPage;
