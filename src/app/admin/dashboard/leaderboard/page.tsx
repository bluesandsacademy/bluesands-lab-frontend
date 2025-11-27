"use client";

import SchoolLeaderboardTable from "@/components/Admin/Leaderboard/SchoolLeaderboardTable";
import StudentLeaderboardTable from "@/components/Admin/Leaderboard/StudentLeaderboardTable";
import TeacherLeaderboardTable from "@/components/Admin/Leaderboard/TeacherLeaderboardTable";
import FilterButton from "@/services/FilterButton";
import { useState } from "react";
import { FaFilter, FaUpload } from "react-icons/fa";

const AdminLeaderboardPage = () => {
  const filters = ["Students", "Teachers", "Schools"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const tableFilters = ["This week", "This month", "All time"];
  const topChievers: any[] = [
    // { name: "First Name", school: "First Schhol", score: "982" },
    // { name: "Second Name", school: "Second School", score: "979" },
    // { name: "Third Name", school: "Third Schhol", score: "975" },
  ];
  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <div
        className={`flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-end md:items-center p-4 rounded-md bg-white  ${
          activeFilter === "Payments" && "hidden"
        }`}
      >
        <div className="flex text-xs md:text-sm gap-4 items-center">
          <input
            type="search"
            name="search"
            id=""
            placeholder="Search Students, Schools and Teachers"
            className="text-xs lg:text-sm rounded-md p-2 border border-gray-300"
          />
          <div className="flex items-center text-gray-500 rounded-md p-2 border border-gray-200">
            <FaFilter />
            <select name="filter" id="filter" className="">
              {tableFilters.map((filter, index) => (
                <option value="item" key={index}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="flex gap-1 items-center text-white bg-bgBlue rounded-md text-xs lg:text-sm p-2">
          <FaUpload /> Export
        </button>
      </div>
      <FilterButton
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        filters={filters}
      />

      <div className="bg-white rounded-md p-3 lg:p-6 flex flex-col gap-4">
        <p className="text-gray-500 lg:text-lg">Top 3 Achievers</p>
        <div className="flex flex-col justify-between md:flex-row flex-wrap gap-4">
          {topChievers.map((user, index) => (
            // Top Achiever Card
            <div key={index} className="flex border border-gray-300 rounded-md p-2 gap-3 lg:gap-6 items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex justify-center items-center bg-blue-100 text-blue-600 text-semibold rounded-full w-10 h-10">
                  <p className="text-lg lg:text-xl">{index + 1}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-lg lg:text-xl font-semibold">
                    {user.name}
                  </p>{" "}
                  <p className="text-sm lg:text-base">{user.school}</p>
                </div>
              </div>
              <div className="flex flex-col ">
                <p className="text-[0.65rem]">Score</p>
                <p className="text-lg lg:text-xl font-bold">{user.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeFilter === "Students" ? (
        <StudentLeaderboardTable />
      ) : activeFilter === "Teachers" ? (
        <TeacherLeaderboardTable />
      ) : activeFilter === "Schools" ? (
        <SchoolLeaderboardTable />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminLeaderboardPage;
