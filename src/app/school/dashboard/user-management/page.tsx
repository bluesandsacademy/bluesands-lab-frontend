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
import {
  ClassEnrolmentModal,
  UserActionMenu,
  type EnrolmentMode,
} from "@/components/School/Dashboard/UserMgt/ClassEnrolmentModals";
import SchoolStudentTable from "@/components/School/Dashboard/UserMgt/StudentTable";
import SchoolTeacherTable from "@/components/School/Dashboard/UserMgt/TeacherTable";
import {
  exportUsers,
  getSchoolClasses,
  getSchoolStudents,
  getSchoolTeachers,
  type SchoolClass,
  type SchoolUser,
} from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaDownload, FaPlus, FaSpinner } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";

/** Counts registrations in the trailing 30 days. */
const countRecent = (users: SchoolUser[]) => {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return users.filter((user) => {
    const created = new Date(user.dateCreated).getTime();
    return !Number.isNaN(created) && created >= cutoff;
  }).length;
};

const SchoolUserManagementPage = () => {
  const filters = ["Teachers", "Students", "Classes"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [loading, setIsLoading] = useState(true);
  const { user, token } = useUser();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  const [teachers, setTeachers] = useState<SchoolUser[]>([]);
  const [students, setStudents] = useState<SchoolUser[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Two-step flow: the row menu picks a mode, then the class picker opens.
  const [menuUser, setMenuUser] = useState<SchoolUser | null>(null);
  const [enrolment, setEnrolment] = useState<{
    user: SchoolUser;
    mode: EnrolmentMode;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);

    // Settled so one failing list doesn't blank the other tabs.
    const [teachersRes, studentsRes, classesRes] = await Promise.allSettled([
      getSchoolTeachers(user.schoolId, token),
      getSchoolStudents(user.schoolId, token),
      getSchoolClasses(user.schoolId, token),
    ]);

    if (teachersRes.status === "fulfilled") setTeachers(teachersRes.value);
    if (studentsRes.status === "fulfilled") setStudents(studentsRes.value);
    if (classesRes.status === "fulfilled") setClasses(classesRes.value);

    const requests = [teachersRes, studentsRes, classesRes];
    const failed = requests.filter((r) => r.status === "rejected");
    if (failed.length) {
      console.error("School user management: some requests failed", failed);
      setError(
        failed.length === requests.length
          ? "Could not load users and classes. Please try again."
          : "Some data could not be loaded.",
      );
    }

    setIsLoading(false);
  }, [user, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Clearing the search between tabs avoids an empty table with no obvious cause.
  useEffect(() => {
    setSearch("");
  }, [activeFilter]);

  const stats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Students",
        value: students.length.toLocaleString("en-NG"),
        icon: "/images/icon/student_dark.svg",
      },
      {
        title: "Total Teachers",
        value: teachers.length.toLocaleString("en-NG"),
        icon: "/images/icon/active_teacher.svg",
      },
      {
        title: "New Students (30d)",
        value: countRecent(students).toLocaleString("en-NG"),
        icon: "/images/icon/clipboard.svg",
      },
      {
        title: "New Teachers (30d)",
        value: countRecent(teachers).toLocaleString("en-NG"),
        icon: "/images/icon/card_teacher.svg",
      },
    ],
    [students, teachers],
  );

  const handleExportUsers = async () => {
    if (!user?.schoolId) {
      toast.error("School ID not found. Please try again.");
      return;
    }
    setIsExporting(true);
    try {
      await exportUsers(user.schoolId);
      toast.success("Users list downloaded.");
    } catch {
      toast.error("Failed to export users. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Update the button onClick handler (modals)
  const handleAddClick = () => {
    setModalType(activeFilter); // Store which modal to show
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setModalType(""); // Clear modal type
    // The modal closes on a successful add, so pull the new user into the list.
    fetchUsers();
  };

  return (
    <div className="flex flex-col gap-6 mt-4 lg:mt-6 p-2 lg:p-4">
      <StatCards stats={stats} isLoading={loading} />

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={activeFilter === "Roles & Permissions"}
            className="bg-gray-100 p-2 outline-none disabled:cursor-not-allowed"
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
            onClick={handleExportUsers}
            disabled={isExporting}
            className={`flex gap-1 items-center bg-gray-200 text-blue-950 p-2 rounded-md text-xs lg:text-sm disabled:opacity-70 disabled:cursor-not-allowed ${
              activeFilter === "Roles & Permissions" && "hidden"
            }`}
          >
            {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            {isExporting ? "Exporting..." : "Export"}
          </button>
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
        <SchoolTeacherTable
          teachers={teachers}
          isLoading={loading}
          search={search}
          onOpenActions={setMenuUser}
        />
      ) : activeFilter === "Students" ? (
        <SchoolStudentTable
          students={students}
          isLoading={loading}
          search={search}
          onOpenActions={setMenuUser}
        />
      ) : activeFilter === "Classes" ? (
        <SchoolClassTable
          classes={classes}
          isLoading={loading}
          search={search}
        />
      ) 
      // : activeFilter === "Roles & Permissions" ? (
      //   <SchoolRolesContainer />
      // )
       : (
        ""
      )}

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => {
          setIsBulkUploadOpen(false);
          fetchUsers();
        }}
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

      {menuUser && (
        <UserActionMenu
          user={menuUser}
          onClose={() => setMenuUser(null)}
          onSelect={(mode) => {
            setEnrolment({ user: menuUser, mode });
            setMenuUser(null);
          }}
        />
      )}

      {enrolment && (
        <ClassEnrolmentModal
          user={enrolment.user}
          mode={enrolment.mode}
          // The active tab determines which role the enrolment is created with.
          role={activeFilter === "Teachers" ? "Teacher" : "Student"}
          classes={classes}
          isLoadingClasses={loading}
          onClose={() => setEnrolment(null)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default SchoolUserManagementPage;
