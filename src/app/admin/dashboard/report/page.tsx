"use client";
import ExportReportsPanel from "@/components/Admin/Report/ExportReportsPanel";
import MostEngagedSubjectsTable from "@/components/Admin/Report/MostEngagedSubjectsTable";
import PopularExperimentsTable from "@/components/Admin/Report/PopularExperimentsTable";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getGlobalDashboardInsights,
  getGlobalDashboardTotals,
  type GlobalDashboardInsights,
  type GlobalDashboardTotals,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useMemo, useState } from "react";

const PLACEHOLDER = "—";

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const formatCount = (value?: number | null) =>
  isNumber(value) ? value.toLocaleString("en-NG") : PLACEHOLDER;

const AdminReportPage = () => {
  const { user, token } = useUser();

  const [totals, setTotals] = useState<GlobalDashboardTotals | null>(null);
  const [insights, setInsights] = useState<GlobalDashboardInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchReportData(authToken: string) {
      setIsLoading(true);
      setError(null);

      const [totalsRes, insightsRes] = await Promise.allSettled([
        getGlobalDashboardTotals(authToken),
        getGlobalDashboardInsights(authToken),
      ]);

      if (totalsRes.status === "fulfilled") setTotals(totalsRes.value);
      if (insightsRes.status === "fulfilled") setInsights(insightsRes.value);

      const failed = [totalsRes, insightsRes].filter(
        (r) => r.status === "rejected",
      );
      if (failed.length) {
        console.error("Reports page: some requests failed", failed);
        setError(
          failed.length === 2
            ? "Could not load report data. Please try again."
            : "Some report metrics could not be loaded.",
        );
      }

      setIsLoading(false);
    }

    fetchReportData(token);
  }, [user, token]);

  const stats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Experiment Attempts",
        value: formatCount(totals?.totalExperimentAttempts),
        icon: "/images/icon/report.svg",
      },
      {
        title: "Total Quiz Attempts",
        value: formatCount(totals?.totalQuizAttempts),
        icon: "/images/icon/teacher/monthly-avg.svg",
      },
    ],
    [totals],
  );

  const topExperiments = useMemo(
    () => (insights?.topExperiments ?? []).filter((row) => row?.label),
    [insights],
  );

  const topSubjects = useMemo(
    () =>
      (insights?.topSubjects ?? [])
        .filter((row) => row?.label && isNumber(row.value) && row.value > 0)
        .slice(0, 10),
    [insights],
  );

  /**
   * Derived from the metrics endpoints rather than a narrative service — every
   * line below is a restatement of a real number, not a generated suggestion.
   */
  const keyFindings = useMemo(() => {
    const findings: string[] = [];

    const topExperiment = topExperiments[0];
    if (topExperiment) {
      findings.push(
        `"${topExperiment.label}" is the most attempted experiment with ${formatCount(topExperiment.value)} attempt(s).`,
      );
    }

    const topSubject = topSubjects[0];
    if (topSubject) {
      findings.push(
        `${topSubject.label} leads subject engagement with ${formatCount(topSubject.value)} completed experiment(s).`,
      );
    }

    const busiest = (insights?.peakUsage ?? []).reduce(
      (peak, bucket) =>
        bucket && isNumber(bucket.count) && bucket.count > (peak?.count ?? 0)
          ? bucket
          : peak,
      null as { hour: number; count: number } | null,
    );
    if (busiest && busiest.count > 0) {
      findings.push(
        `Peak platform usage happens around ${String(busiest.hour).padStart(2, "0")}:00 with ${formatCount(busiest.count)} session(s).`,
      );
    }

    if (isNumber(totals?.activeUsers30d) && isNumber(totals?.totalUsers)) {
      const share = totals.totalUsers
        ? Math.round((totals.activeUsers30d / totals.totalUsers) * 100)
        : 0;
      findings.push(
        `${formatCount(totals.activeUsers30d)} of ${formatCount(totals.totalUsers)} users (${share}%) were active in the last 30 days.`,
      );
    }

    if (isNumber(totals?.totalLabTimeMinutes)) {
      findings.push(
        `${formatCount(totals.totalLabTimeMinutes)} minutes of lab practice time recorded across the platform.`,
      );
    }

    return findings;
  }, [topExperiments, topSubjects, insights, totals]);

  const dotColors = ["bg-blue-600", "bg-emerald-500", "bg-blue-900"];

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      {error && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex flex-col gap-4 lg:gap-5 flex-1">
          <StatCards stats={stats} isLoading={isLoading} />

          <div className="flex flex-col gap-3 bg-white rounded-lg shadow-sm p-4 md:p-5">
            <h2 className="text-lg font-semibold text-gray-900">Insights</h2>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Key Findings
              </p>
              {isLoading ? (
                <p className="text-xs text-gray-400">Loading insights…</p>
              ) : !keyFindings.length ? (
                <p className="text-xs text-gray-400">
                  Not enough activity recorded to summarise yet
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {keyFindings.map((finding, index) => (
                    <li key={finding} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          dotColors[index % dotColors.length]
                        }`}
                      />
                      <span className="text-xs text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-sm">
          <ExportReportsPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <PopularExperimentsTable
          experiments={topExperiments}
          isLoading={isLoading}
        />
        <MostEngagedSubjectsTable
          subjects={topSubjects}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminReportPage;
