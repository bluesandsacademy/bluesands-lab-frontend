"use client";
import type { LabelValue } from "@/services/globalAdminDashboardService";

interface MostEngagedSubjectsTableProps {
  subjects: LabelValue[];
  isLoading?: boolean;
}

const MostEngagedSubjectsTable = ({
  subjects,
  isLoading,
}: MostEngagedSubjectsTableProps) => {
  const totalAttempts = subjects.reduce((sum, row) => sum + (row.value ?? 0), 0);

  return (
    <div className="flex flex-col overflow-x-auto gap-2">
      <p className="text-sm lg:text-base font-semibold">
        Highest Engagement Subjects
      </p>
      <table className="w-full bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Subject</td>
            <td className="p-2">Experiments Completed</td>
            <td className="p-2">Share</td>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={3}>
                Loading subjects…
              </td>
            </tr>
          ) : !subjects.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={3}>
                No subject activity recorded yet
              </td>
            </tr>
          ) : (
            subjects.map((row) => (
              <tr
                className="text-xs border-b border-b-gray-200"
                key={row.label}
              >
                <td className="p-2">{row.label || "—"}</td>
                <td className="p-2">
                  {(row.value ?? 0).toLocaleString("en-NG")}
                </td>
                <td className="p-2">
                  <p className="text-bgBlue">
                    {totalAttempts
                      ? `${Math.round(((row.value ?? 0) / totalAttempts) * 100)}%`
                      : "—"}
                  </p>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MostEngagedSubjectsTable;
