"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import SchoolFilterButton from "@/components/School/Dashboard/SchoolFilterButton";
import SchoolClassTable from "@/components/School/Dashboard/UserMgt/ClassTable";
import SchoolRolesContainer from "@/components/School/Dashboard/UserMgt/SchoolRolesContainer";
import {
  AddClassModal,
  AddRoleModal,
  AddStudentModal,
  AddTeacherModal,
  BulkUploadModal,
} from "@/components/School/Dashboard/UserMgt/SchoolUserManagementModals";
import SchoolStudentTable from "@/components/School/Dashboard/UserMgt/StudentTable";
import SchoolTeacherTable from "@/components/School/Dashboard/UserMgt/TeacherTable";
import { getSchoolAdminDashboard } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";

const statsConfig: StatCardData[] = [
  {
    title: "Active Students",
    value: "0",
    icon: "/images/icon/student_dark.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Teachers",
    value: "0",
    icon: "/images/icon/active_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "New Registrations",
    value: "0",
    icon: "/images/icon/clipboard.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "New Teachers",
    value: "0",
    icon: "/images/icon/card_teacher.svg",
    trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
];

const SchoolUserManagementPage = () => {
  const filters = ["Teachers", "Students", "Classes", "Roles & Permissions"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [loading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCardData[]>([]);
  const { user, token } = useUser();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>("");

  useEffect(() => {
    if (!user || !token) return;

    async function fetchStats() {
      setIsLoading(true);
      try {
        const data = await getSchoolAdminDashboard(token);

        const statsData: StatCardData[] = [
          {
            title: statsConfig[0].title,
            value: `${data.activity7d.activeUsers}`,
            icon: statsConfig[0].icon,
            trendIcon: statsConfig[0].trendIcon,
            percentageChange: statsConfig[0].percentageChange,
            timeFrame: statsConfig[0].timeFrame,
          },
          {
            title: statsConfig[1].title,
            value: `${data.counts.teachers}`,
            icon: statsConfig[1].icon,
            trendIcon: statsConfig[1].trendIcon,
            percentageChange: statsConfig[1].percentageChange,
            timeFrame: statsConfig[1].timeFrame,
          },
          {
            title: statsConfig[2].title,
            value: "0", // Waiting for backend data
            icon: statsConfig[2].icon,
            trendIcon: statsConfig[2].trendIcon,
            percentageChange: statsConfig[2].percentageChange,
            timeFrame: statsConfig[2].timeFrame,
          },
          {
            title: statsConfig[3].title,
            value: "0", //waiting for backend data
            icon: statsConfig[3].icon,
            trendIcon: statsConfig[3].trendIcon,
            percentageChange: statsConfig[3].percentageChange,
            timeFrame: statsConfig[3].timeFrame,
          },
        ];

        setStats(statsData);
      } catch (err) {
        console.error("Error fetching stats:", err);

        const fallbackStats: StatCardData[] = statsConfig.map((stat) => ({
          title: stat.title,
          value: "0",
          icon: stat.icon,
          trendIcon: stat.trendIcon,
          percentageChange: stat.percentageChange,
          timeFrame: stat.timeFrame,
        }));

        setStats(fallbackStats);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [user, token]);

  // Update the button onClick handler (modals)
  const handleAddClick = () => {
    setModalType(activeFilter); // Store which modal to show
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setModalType(""); // Clear modal type
  };

  return (
    <div className="flex flex-col gap-6 mt-4 lg:mt-6 p-2 lg:p-4">
      <StatCards stats={stats} />
      <SchoolFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      <div
        className={`p-2 flex rounded-md lg:rounded-lg bg-white  ${
          activeFilter === "Roles & Permissions"
            ? "justify-end"
            : "justify-between"
        }`}
      >
        <div
          className={`flex gap-2 items-center bg-gray-100 border border-gray-200 text-xs md:text-sm px-3 rounded-md  ${
            activeFilter === "Roles & Permissions" && "hidden"
          }`}
        >
          <IoSearch className="text-gray-400 text-lg" />
          <input
            type="text"
            className="bg-gray-100 p-2 outline-none"
            placeholder={
              activeFilter === "Teachers"
                ? "Search Teachers"
                : activeFilter === "Students"
                ? "Search Students"
                : activeFilter === "Classes"
                ? "Search Classes"
                : ""
            }
          />
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={() => setIsBulkUploadOpen(true)}
            className={`flex gap-1 items-center bg-gray-200 text-blue-950 p-2 rounded-md text-xs lg:text-sm  ${
              activeFilter === "Roles & Permissions" && "hidden"
            }`}
          >
            <FiUpload /> bulk upload
          </button>
          <button
            onClick={handleAddClick}
            className="flex gap-1 items-center bg-blue-950 text-white p-2 rounded-md text-xs lg:text-sm"
          >
            <FaPlus />
            {activeFilter === "Teachers"
              ? "Add Teacher"
              : activeFilter === "Students"
              ? "Add Student"
              : activeFilter === "Classes"
              ? "Add Class"
              : activeFilter === "Roles & Permissions"
              ? "Create Role"
              : ""}
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
        <SchoolRolesContainer />
      ) : (
        ""
      )}

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        userType={activeFilter}
      />

      {modalType === "Teachers" && (
        <AddTeacherModal isOpen={isAddModalOpen} onClose={handleCloseModal} />
      )}

      {modalType === "Students" && (
        <AddStudentModal isOpen={isAddModalOpen} onClose={handleCloseModal} />
      )}

      {modalType === "Classes" && (
        <AddClassModal isOpen={isAddModalOpen} onClose={handleCloseModal} />
      )}

      {modalType === "Roles & Permissions" && (
        <AddRoleModal isOpen={isAddModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SchoolUserManagementPage;
