"use client";
import type { SchoolUser } from "@/services/schoolAdminDashboardService";
import SchoolUserTable from "./SchoolUserTable";

interface SchoolStudentTableProps {
  students: SchoolUser[];
  isLoading?: boolean;
  search?: string;
  onOpenActions?: (user: SchoolUser) => void;
}

const SchoolStudentTable = ({
  students,
  isLoading,
  search,
  onOpenActions,
}: SchoolStudentTableProps) => (
  <SchoolUserTable
    users={students}
    isLoading={isLoading}
    search={search}
    label="students"
    onOpenActions={onOpenActions}
  />
);

export default SchoolStudentTable;
