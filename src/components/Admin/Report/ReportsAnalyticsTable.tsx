"use client";
import type { GlobalAnalyticsData, LabelValue } from "@/services/globalAdminDashboardService";

interface ReportsAnalyticsTableProps {
  analytics: GlobalAnalyticsData[];
  isLoading?: boolean;
}

const ReportsAnalyticsTable = ({
  analytics,
  isLoading,
}: ReportsAnalyticsTableProps) => {

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
                key={row.id}
              >
                <td className="p-2">{row.reportDate || "-"}</td>
                <td className="p-2">{row.newStudentsCount || "-"}</td>
                <td className="p-2">{row.monthlyActiveStudents || "-"}</td>
                <td className="p-2">{row.completedExperimentsCount || "-"}</td>
                <td className="p-2">{row.newTeachersReached || "-"}</td>
                <td className="p-2">{row.virtualExperimentsConducted || "-"}</td>
                <td className="p-2">{row.monthlyRetentionRate || "-"}</td>
                <td className="p-2">{row.newK12SchoolsReached || "-"}</td>
                <td className="p-2">{row.teacherFeedbackEffectiveness || "-"}</td>
                <td className="p-2">{row.teacherFeedbackLessonPlanning || "-"}</td>
                <td className="p-2">{row.teachersCreatingIlsCount || "-"}</td>
                <td className="p-2">{row.ilsCreatedCount || "-"}</td>
                <td className="p-2">{row.ilsInDraftCount || "-"}</td>
                <td className="p-2">{row.studentPerformancePrior || "-"}</td>
                <td className="p-2">{row.studentPerformanceFollowing || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsAnalyticsTable;
