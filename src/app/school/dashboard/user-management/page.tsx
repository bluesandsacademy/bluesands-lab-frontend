"use client";
import StatCards from "@/components/Dashboard/StatCards";
import SchoolFilterButton from "@/components/School/Dashboard/SchoolFilterButton";
import SchoolClassTable from "@/components/School/Dashboard/UserMgt/ClassTable";
import SchoolStudentTable from "@/components/School/Dashboard/UserMgt/StudentTable";
import SchoolTeacherTable from "@/components/School/Dashboard/UserMgt/TeacherTable";
import { schoolUserMgtStats } from "@/lib/data";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

const SchoolUserManagementPage = () => {
  const filters = ["Teachers", "Students", "Classes", "Roles & Permissions"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  return (
    <div className="flex flex-col gap-6 mt-4 lg:mt-6 p-2 lg:p-4">
      <StatCards stats={schoolUserMgtStats} />
      <SchoolFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      <div className={`p-2 flex justify-between rounded-md lg:rounded-lg bg-white ${activeFilter === "Roles & Permissions" && "hidden"}`}>
        <div className="flex gap-2 items-center bg-gray-100 border border-gray-200 text-xs md:text-sm px-3 rounded-md">
          <IoSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            className="bg-gray-100 p-2"
            placeholder={activeFilter === "Teachers"? "Search Teachers": activeFilter === "Students"? "Search Students": activeFilter === "Classes"? "Search Classes":""}
          />
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <button className="bg-gray-200 text-blue-950 p-2 rounded-md text-xs md:text-sm">
            bulk upload
          </button>
          <button className="bg-blue-950 text-white p-2 rounded-md text-xs md:text-sm">
            {activeFilter === "Teachers"? "Add Teacher": activeFilter === "Students"? "Add Student": activeFilter === "Classes"? "Add Class":""}
          </button>
        </div>
      </div>
      {activeFilter === "Teachers" ? (
        <SchoolTeacherTable />
      ) : activeFilter === "Students" ? (
        <SchoolStudentTable />
      ) : activeFilter === "Classes" ? (
        <SchoolClassTable />
      ) : activeFilter === "Roles & Permissions" ? (
        ""
      ) : (
        ""
      )}
    </div>
  );
};

export default SchoolUserManagementPage;
