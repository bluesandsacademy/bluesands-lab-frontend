"use client";
import DisputeTable from "@/components/Admin/User-mgt/DisputeTable";
import UsersPanel, {
  ROLE_FILTERS,
  roleValueFor,
} from "@/components/Admin/User-mgt/UsersPanel";
import FilterButton from "@/services/FilterButton";
import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";

const AdminUserManagementPage = () => {
  const filters = ["All Users", "Disputes"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const disputeTableFilters = ["All Statuses"];

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(ROLE_FILTERS[0].label);

  const isUsersTab = activeFilter === "All Users";

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <FilterButton
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        filters={filters}
      />

      <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-end md:items-center p-4 rounded-md bg-white">
        <div className="flex text-xs md:text-sm gap-4 items-center">
          <input
            type="search"
            name="search"
            value={isUsersTab ? search : ""}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!isUsersTab}
            placeholder={
              isUsersTab ? "Search by name or email..." : "Search Disputes..."
            }
            className="text-sm rounded-md p-2 border border-gray-300 disabled:bg-gray-50"
          />
          <div className="flex items-center text-gray-500 rounded-md p-2 border border-gray-200">
            <FaFilter />
            {isUsersTab ? (
              <select
                name="filter"
                id="filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {ROLE_FILTERS.map((filter) => (
                  <option value={filter.label} key={filter.label}>
                    {filter.label}
                  </option>
                ))}
              </select>
            ) : (
              <select name="filter" id="filter">
                {disputeTableFilters.map((filter, index) => (
                  <option value="item" key={index}>
                    {filter}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {isUsersTab ? (
        <UsersPanel search={search} role={roleValueFor(roleFilter)} />
      ) : activeFilter === "Disputes" ? (
        <DisputeTable />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminUserManagementPage;
