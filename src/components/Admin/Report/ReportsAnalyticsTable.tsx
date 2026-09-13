"use client";
import type { LabelValue } from "@/services/globalAdminDashboardService";

interface ReportsAnalyticsTableProps {
  analytics: LabelValue[];
  isLoading?: boolean;
}

const ReportsAnalyticsTable = ({
  analytics,
  isLoading,
}: ReportsAnalyticsTableProps) => {
  const totalAttempts = analytics.reduce(
    (sum, row) => sum + (row.value ?? 0),
    0,
  );

  return (
    <div className="flex flex-col overflow-x-auto gap-2">
      <p className="text-sm lg:text-base font-semibold">
        Reports And Analytics
      </p>
      <table className="w-full bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Month-Year</td>
            <td className="p-2">Students Signups</td>
            <td className="p-2">Active Students</td>
            <td className="p-2">Students Starting/Completing</td>
            <td className="p-2">Teachers Reached</td>
            <td className="p-2">Experiments Conducted</td>
            <td className="p-2">Learner Retention Rate</td>
            <td className="p-2">K12 Schools</td>
            <td className="p-2">Effectiveness</td>
            <td className="p-2">Student Engagement</td>
            <td className="p-2">Teachers creating ILS</td>
            <td className="p-2">ILS Created</td>
            <td className="p-2">ILS in Drafts</td>
            <td className="p-2">Student Perform. Pre-Deployment</td>
            <td className="p-2">Student Perform. Post-Deployment</td>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={3}>
                Loading Analytics…
              </td>
            </tr>
          ) : !analytics.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={3}>
                No activity recorded yet
              </td>
            </tr>
          ) : (
            analytics.map((row) => (
              <tr
                className="text-xs border-b border-b-gray-200"
                key={row.label}
              >
                <td className="p-2">{row.label || "—"}</td>
                <td className="p-2">
                  {(row.value ?? 0).toLocaleString("en-NG")}
                </td>
                {/* <td className="p-2">
                  <p className="text-bgBlue">
                    {totalAttempts
                      ? `${Math.round(((row.value ?? 0) / totalAttempts) * 100)}%`
                      : "—"}
                  </p>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsAnalyticsTable;
