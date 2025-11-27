"use client";
import DisputeTable from "@/components/Admin/User-mgt/DisputeTable";
import UserTable from "@/components/Admin/User-mgt/UserTable";
import FilterButton from "@/services/FilterButton";
import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";

const AdminUserManagementPage = () => {
  const filters = ["All Users", "Disputes"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const userTableFilters = ["All Users", "Teachers", "Students"];
  const disputeTableFilters = ["All Statuses"];

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <FilterButton
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        filters={filters}
      />

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
            placeholder={
              activeFilter === "All Users"
                ? "Search User..."
                : "Search Disputes..."
            }
            className="text-sm rounded-md p-2 border border-gray-300"
          />
          <div className="flex items-center text-gray-500 rounded-md p-2 border border-gray-200">
            <FaFilter />
            <select name="filter" id="filter" className="">
              {activeFilter === "All Users"? userTableFilters.map((filter, index)=>(
                <option value="item" key={index}>{filter}</option>
              )): activeFilter === "Disputes"? disputeTableFilters.map((filter, index)=>(
                <option value="item" key={index}>{filter}</option>
              )): ""}
            </select>
          </div>
        </div>

        {/* <button className="flex gap-1 items-center text-white bg-bgBlue rounded-md text-xs lg:text-sm p-2">
          <FaPlus /> Add {activeFilter === "Schools" ? "School" : "User"}
        </button> */}
      </div>

      {activeFilter === "All Users" ? (
        <UserTable />
      ) : activeFilter === "Disputes" ? (
        <DisputeTable />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminUserManagementPage;
