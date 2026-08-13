"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import SchoolActivityTrend from "@/components/School/Dashboard/SchoolActivityTrend";
import SchoolWelcomeBanner from "@/components/School/Dashboard/SchoolWelcomeBanner";
import SchoolWideTrend from "@/components/School/Dashboard/SchoolWideTrend";
import {
  getSchoolAdminOverview,
  getSchoolAdminTrends,
  type SchoolAdminOverview,
  type SchoolAdminTrends,
} from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useMemo, useState } from "react";

const PLACEHOLDER = "—";

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const formatCount = (value?: number | null) =>
  isNumber(value) ? value.toLocaleString("en-NG") : PLACEHOLDER;

const formatPercent = (value?: number | null) =>
  isNumber(value) ? `${Math.round(value * 10) / 10}%` : PLACEHOLDER;

const SchoolDashboardPage = () => {
  const { user, token } = useUser();
  const firstName = user?.fullName?.split(" ")[0];

  const [overview, setOverview] = useState<SchoolAdminOverview | null>(null);
  const [trends, setTrends] = useState<SchoolAdminTrends | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchDashboard(authToken: string) {
      setIsLoading(true);
      setError(null);

      // Settled rather than all-or-nothing: a failing chart shouldn't blank
      // the stat cards.
      const [overviewRes, trendsRes] = await Promise.allSettled([
        getSchoolAdminOverview(authToken),
        getSchoolAdminTrends(authToken),
      ]);

      if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);
      if (trendsRes.status === "fulfilled") setTrends(trendsRes.value);

      const failed = [overviewRes, trendsRes].filter(
        (r) => r.status === "rejected",
      );
      if (failed.length) {
        console.error("School dashboard: some requests failed", failed);
        setError(
          failed.length === 2
            ? "Could not load dashboard data. Please try again."
            : "Some dashboard data could not be loaded.",
        );
      }

      setIsLoading(false);
    }

    fetchDashboard(token);
  }, [user, token]);

  const schoolStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Students",
        value: formatCount(overview?.totalStudents),
        icon: "/images/icon/student_blue.svg",
      },
      {
        title: "Total Teachers",
        value: formatCount(overview?.totalTeachers),
        icon: "/images/icon/card_teacher.svg",
      },
      {
        title: "Active Classes",
        value: formatCount(overview?.activeClasses),
        icon: "/images/icon/calendar.svg",
      },
      {
        title: "Total ILS Created",
        value: formatCount(overview?.totalIlsCreated),
        icon: "/images/icon/teacher/vr-headset-stemlabs.png",
      },
    ],
    [overview],
  );

  const activityStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Experiments (This Term)",
        value: formatCount(overview?.experimentsRunThisTerm),
        icon: "/images/icon/microscope.svg",
      },
      {
        title: "Experiments (All Time)",
        value: formatCount(overview?.experimentsRunAllTime),
        icon: "/images/icon/beaker_01.svg",
      },
      {
        title: "Average Student Score",
        value: formatPercent(overview?.avgStudentScore),
        icon: "/images/icon/clipboard.svg",
      },
      {
        title: "Average Completion Rate",
        value: formatPercent(overview?.avgStudentCompletionRate),
        icon: "/images/icon/chart.svg",
      },
      {
        title: "Weekly Active Users",
        value: formatCount(overview?.weeklyActiveUsers),
        icon: "/images/icon/student_dark.svg",
      },
      {
        title: "Monthly Active Users",
        value: formatCount(overview?.monthlyActiveUsers),
        icon: "/images/icon/active_teacher.svg",
      },
    ],
    [overview],
  );

  const subscription = user?.subscription;
  const tierName = user?.currentTier?.tierName;

  return (
    <div className="p-4 space-y-4">
      <SchoolWelcomeBanner firstName={firstName || ""} />

      {error && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      {!!overview?.schoolName && (
        <p className="text-sm text-gray-500">{overview.schoolName}</p>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-xs text-gray-500">School overview</p>
        <StatCards stats={schoolStats} isLoading={isLoading} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs text-gray-500">Activity &amp; performance</p>
        <StatCards stats={activityStats} isLoading={isLoading} />
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-6">
        <SchoolWideTrend
          points={trends?.avgScores ?? []}
          isLoading={isLoading}
        />

        <div className="flex flex-col p-4 gap-4 w-full md:w-96 rounded-lg bg-white lg:py-14">
          <strong className="text-sm md:text-base text-gray-500">
            Subscription
          </strong>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{tierName || "Plan type"}</p>

            {subscription?.active ? (
              <p className="text-green-500 text-xs md:text-sm">
                Active
                {isNumber(subscription.daysRemaining) &&
                  ` — renews in ${subscription.daysRemaining} day(s)`}
              </p>
            ) : (
              <p className="text-red-400 text-xs md:text-sm">
                Subscription not active
              </p>
            )}

            {isNumber(subscription?.studentsCovered) && (
              <p className="text-xs md:text-sm text-gray-500">
                {subscription.studentsCovered.toLocaleString("en-NG")} student
                seat(s)
                {isNumber(overview?.totalStudents) &&
                  ` · ${overview.totalStudents.toLocaleString("en-NG")} enrolled`}
              </p>
            )}

            {!!subscription?.lastPaymentReference && (
              <p className="text-xs md:text-sm text-gray-500 break-all">
                Last payment: {subscription.lastPaymentReference}
              </p>
            )}
          </div>
          <button className="text-white bg-blue-950 rounded-md p-2 text-sm">
            Manage subscription
          </button>
        </div>
      </div>

      <SchoolActivityTrend
        activeUsers={trends?.activeUsers ?? []}
        experimentsRun={trends?.experimentsRun ?? []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SchoolDashboardPage;
