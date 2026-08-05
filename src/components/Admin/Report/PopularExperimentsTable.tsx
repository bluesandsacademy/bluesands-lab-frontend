"use client";
import type { LabelValue } from "@/services/globalAdminDashboardService";

interface PopularExperimentsTableProps {
  experiments: LabelValue[];
  isLoading?: boolean;
}

const PopularExperimentsTable = ({
  experiments,
  isLoading,
}: PopularExperimentsTableProps) => {
  const totalAttempts = experiments.reduce(
    (sum, row) => sum + (row.value ?? 0),
    0,
  );

  return (
    <div className="flex flex-col overflow-x-auto gap-2">
      <p className="text-sm lg:text-base font-semibold">
        Most Popular Experiments
      </p>
      <table className="w-full bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Experiment Name</td>
            <td className="p-2">Attempts</td>
            <td className="p-2">Share</td>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={3}>
                Loading experiments…
              </td>
            </tr>
          ) : !experiments.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={3}>
                No experiment activity recorded yet
              </td>
            </tr>
          ) : (
            experiments.map((row) => (
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

export default PopularExperimentsTable;
