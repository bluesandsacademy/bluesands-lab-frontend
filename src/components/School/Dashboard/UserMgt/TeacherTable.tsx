"use client";
import type { SchoolUser } from "@/services/schoolAdminDashboardService";
import SchoolUserTable from "./SchoolUserTable";

interface SchoolTeacherTableProps {
  teachers: SchoolUser[];
  isLoading?: boolean;
  search?: string;
  onOpenActions?: (user: SchoolUser) => void;
}

const SchoolTeacherTable = ({
  teachers,
  isLoading,
  search,
  onOpenActions,
}: SchoolTeacherTableProps) => (
  <SchoolUserTable
    users={teachers}
    isLoading={isLoading}
    search={search}
    label="teachers"
    onOpenActions={onOpenActions}
  />
);

export default SchoolTeacherTable;
