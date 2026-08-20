"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getGlobalDashboardGeoUsage,
  getGlobalDashboardInsights,
  getGlobalDashboardPromptTotals,
  getGlobalDashboardTotals,
  getGlobalSupportOverview,
  getRevenueGrowth,
  getUserGrowth,
  type DashboardSeries,
  type GeoUsageRow,
  type GlobalDashboardGeoUsage,
  type GlobalDashboardInsights,
  type GlobalDashboardTotals,
  type PromptTotals,
  type SupportOverview,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#ef4444",
  "#06b6d4",
  "#a3a3a3",
];

const PLACEHOLDER = "—";

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

// Every metric is optional in practice — a panel that failed, or a field the
// endpoint omitted, must render as a placeholder rather than throw.
const formatNaira = (amount?: number | null) =>
  isNumber(amount)
    ? `NGN ${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
    : PLACEHOLDER;

const formatCount = (value?: number | null) =>
  isNumber(value) ? value.toLocaleString("en-NG") : PLACEHOLDER;

const formatMinutes = (value?: number | null) =>
  isNumber(value) ? `${value.toLocaleString("en-NG")} mins` : PLACEHOLDER;

/** totalQuizScores is a small decimal, so rounding to an integer would read as 2. */
const formatDecimal = (value?: number | null) =>
  isNumber(value)
    ? value.toLocaleString("en-NG", { maximumFractionDigits: 2 })
    : PLACEHOLDER;

const formatPercent = (value?: number | null) =>
  isNumber(value)
    ? `${value.toLocaleString("en-NG", { maximumFractionDigits: 1 })}%`
    : PLACEHOLDER;

/** DEMO: prefer the prompt-totals value, falling back to the older endpoint. */
const pick = (...values: (number | null | undefined)[]) =>
  values.find(isNumber);

/**
 * The chart endpoints ship a ready-made `label`; fall back to the timestamp
 * only if one is missing.
 */
function toChartData(series: DashboardSeries | null) {
  return (series?.dataPoints ?? [])
    .filter((point) => point && isNumber(point.value))
    .map((point) => ({
      name: point.label || new Date(point.timestamp).toLocaleDateString("en-NG"),
      value: point.value,
    }));
}

const ChartCard = ({
  title,
  isEmpty,
  children,
}: {
  title: string;
  isEmpty?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex-1 bg-white p-4 rounded-lg shadow">
    <h3 className="text-sm font-semibold mb-4">{title}</h3>
    {isEmpty ? (
      <div className="h-[300px] flex items-center justify-center text-xs text-gray-400">
        No data recorded yet
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    )}
  </div>
);

const Page = () => {
  const { user, token } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totals, setTotals] = useState<GlobalDashboardTotals | null>(null);
  // DEMO: prompt-totals takes precedence over /dashboard/totals for the cards.
  const [promptTotals, setPromptTotals] = useState<PromptTotals | null>(null);
  const [insights, setInsights] = useState<GlobalDashboardInsights | null>(null);
  const [userGrowth, setUserGrowth] = useState<DashboardSeries | null>(null);
  const [revenueGrowth, setRevenueGrowth] = useState<DashboardSeries | null>(
    null,
  );
  const [geo, setGeo] = useState<GlobalDashboardGeoUsage | null>(null);
  const [support, setSupport] = useState<SupportOverview | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchDashboard(authToken: string) {
      setIsLoading(true);
      setError(null);

      // Settled rather than all-or-nothing: one failing panel shouldn't blank the page.
      const [
        totalsRes,
        promptTotalsRes,
        insightsRes,
        userGrowthRes,
        revenueGrowthRes,
        geoRes,
        supportRes,
      ] = await Promise.allSettled([
        getGlobalDashboardTotals(authToken),
        getGlobalDashboardPromptTotals(authToken),
        getGlobalDashboardInsights(authToken),
        getUserGrowth(authToken),
        getRevenueGrowth(authToken),
        getGlobalDashboardGeoUsage(authToken),
        getGlobalSupportOverview(authToken),
      ]);

      if (totalsRes.status === "fulfilled") setTotals(totalsRes.value);
      if (promptTotalsRes.status === "fulfilled")
        setPromptTotals(promptTotalsRes.value);
      if (insightsRes.status === "fulfilled") setInsights(insightsRes.value);
      if (userGrowthRes.status === "fulfilled")
        setUserGrowth(userGrowthRes.value);
      if (revenueGrowthRes.status === "fulfilled")
        setRevenueGrowth(revenueGrowthRes.value);
      if (geoRes.status === "fulfilled") setGeo(geoRes.value);
      if (supportRes.status === "fulfilled") setSupport(supportRes.value);

      const requests = [
        totalsRes,
        promptTotalsRes,
        insightsRes,
        userGrowthRes,
        revenueGrowthRes,
        geoRes,
        supportRes,
      ];
      const failed = requests.filter((r) => r.status === "rejected");

      if (failed.length) {
        console.error("Global admin dashboard: some requests failed", failed);
        setError(
          failed.length === requests.length
            ? "Could not load dashboard data. Please try again."
            : "Some dashboard metrics could not be loaded.",
        );
      }

      setIsLoading(false);
    }

    fetchDashboard(token);
  }, [user, token]);

  const generalStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Platform Users",
        value: formatCount(
          pick(promptTotals?.totalPlatformUsers, totals?.totalUsers),
        ),
        icon: "/images/icon/total_users.svg",
      },
      {
        title: "Total Schools Registered",
        value: formatCount(
          pick(promptTotals?.totalSchoolsRegistered, totals?.totalSchools),
        ),
        icon: "/images/icon/total_schools.svg",
      },
      {
        title: "Total STEM Courses",
        value: formatCount(
          pick(promptTotals?.totalStemCourses, totals?.totalStemCourses),
        ),
        icon: "/images/icon/calendar.svg",
      },
      {
        title: "Total Payments",
        value: formatNaira(
          pick(promptTotals?.totalPayments, totals?.totalRevenueNGN),
        ),
        icon: "/images/icon/total_payments.svg",
      },
    ],
    [promptTotals, totals],
  );

  const learningStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Lab Practice Time",
        value: formatMinutes(
          pick(promptTotals?.totalLabPractice, totals?.totalLabTimeMinutes),
        ),
        icon: "/images/icon/beaker_01.svg",
      },
      {
        title: "Total Experiment Attempts",
        value: formatCount(
          pick(
            promptTotals?.totalExperimentAttempts,
            totals?.totalExperimentAttempts,
          ),
        ),
        icon: "/images/icon/microscope.svg",
      },
      {
        title: "Total Quiz Attempts",
        value: formatCount(
          pick(promptTotals?.totalQuizAttempts, totals?.totalQuizAttempts),
        ),
        icon: "/images/icon/clipboard.svg",
      },
      {
        title: "Total Quiz Scores",
        // prompt-totals reports a percentage; the older endpoint a raw decimal.
        value: isNumber(promptTotals?.totalQuizScorePercent)
          ? formatPercent(promptTotals.totalQuizScorePercent)
          : formatDecimal(totals?.totalQuizScores),
        icon: "/images/icon/studentgrad.svg",
      },
      {
        title: "Total ILS Created",
        value: formatCount(
          pick(promptTotals?.totalILScreated, totals?.totalIls),
        ),
        icon: "/images/icon/teacher/vr-headset-stemlabs.png",
      },
    ],
    [promptTotals, totals],
  );

  const userOverviewStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Subscribed Users",
        value: formatCount(
          pick(promptTotals?.subscribedUsers, totals?.totalSubscribedUsers),
        ),
        icon: "/images/svg/subscribed.svg",
      },
      {
        title: "Active Users (30d)",
        value: formatCount(
          pick(promptTotals?.activeUsers, totals?.activeUsers30d),
        ),
        icon: "/images/icon/user-bold.svg",
      },
      // {
      //   // Not in prompt-totals; still sourced from /dashboard/totals.
      //   title: "Offline Users",
      //   value: formatCount(totals?.offlineUsers),
      //   icon: "/images/svg/offline.svg",
      // },
      {
        // Not in prompt-totals; still sourced from /dashboard/totals.
        title: "Offline Users",
        value: formatCount(
          pick(promptTotals?.offlineUsers, totals?.offlineUsers),
        ),
        icon: "/images/svg/offline.svg",
      },
      {
        title: "Male Users",
        value: formatCount(pick(promptTotals?.maleUsers, totals?.maleUsers)),
        icon: "/images/svg/male.svg",
      },
      {
        title: "Female Users",
        value: formatCount(
          pick(promptTotals?.femaleUsers, totals?.femaleUsers),
        ),
        icon: "/images/svg/female.svg",
      },
    ],
    [promptTotals, totals],
  );

  const platformStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Teachers",
        value: formatCount(totals?.totalTeachers),
        icon: "/images/icon/card_teacher.svg",
      },
      {
        title: "Total Students",
        value: formatCount(totals?.totalStudent),
        icon: "/images/icon/student_blue.svg",
      },
      {
        title: "Active Subscriptions",
        value: formatCount(
          pick(promptTotals?.activeSubscriptions, totals?.activeSubscriptions),
        ),
        icon: "/images/svg/subscribed.svg",
      },
      {
        title: "Payments Recorded",
        value: formatCount(
          pick(promptTotals?.paymentRecorded, totals?.totalPayments),
        ),
        icon: "/images/icon/card_payment.svg",
      },
    ],
    [promptTotals, totals],
  );

  const supportStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Messages (last 7 days)",
        value: formatCount(support?.messagesLast7d),
        icon: "/images/icon/clipboard.svg",
      },
      {
        title: "Open Messages",
        value: formatCount(support?.messagesOpen),
        icon: "/images/svg/offline.svg",
      },
      {
        title: "Schools Contacting (7d)",
        value: formatCount(support?.distinctSchoolsLast7d),
        icon: "/images/icon/total_schools.svg",
      },
    ],
    [support],
  );

  const growthData = useMemo(() => toChartData(userGrowth), [userGrowth]);

  // Subject rows are returned with zero-count entries; those add nothing to a donut.
  const subjectData = useMemo(
    () =>
      (insights?.topSubjects ?? [])
        .filter((s) => s && isNumber(s.value) && s.value > 0)
        .map((s) => ({ label: s.label ?? "Unknown", value: s.value })),
    [insights],
  );

  const revenueData = useMemo(
    () => toChartData(revenueGrowth),
    [revenueGrowth],
  );

  const peakUsageData = useMemo(
    () =>
      (insights?.peakUsage ?? [])
        .filter((bucket) => bucket && isNumber(bucket.count))
        .map((bucket) => ({
          hour: `${String(bucket.hour).padStart(2, "0")}:00`,
          count: bucket.count,
        })),
    [insights],
  );

  // Several raw country values normalize to the same name ("NG" and "Nigeria"),
  // so merge them — otherwise the list shows one country twice with split counts.
  // Currently unused: the User Demographics block below is commented out for
  // the demo. Kept so restoring it is a single uncomment.
  const geoRows = useMemo(() => {
    const merged = new Map<string, GeoUsageRow>();

    (geo?.rows ?? []).forEach((row) => {
      if (!row?.country) return;
      const existing = merged.get(row.country);
      if (existing) {
        existing.schools += row.schools ?? 0;
        existing.users += row.users ?? 0;
        existing.experiments += row.experiments ?? 0;
        existing.quizAttempts += row.quizAttempts ?? 0;
      } else {
        merged.set(row.country, {
          country: row.country,
          schools: row.schools ?? 0,
          users: row.users ?? 0,
          experiments: row.experiments ?? 0,
          quizAttempts: row.quizAttempts ?? 0,
        });
      }
    });

    return [...merged.values()]
      .filter((row) => row.users > 0 || row.schools > 0)
      .sort((a, b) => b.users - a.users);
  }, [geo]);

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      {error && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-xs">General metrics</p>
        <StatCards stats={generalStats} isLoading={isLoading} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">Learning metrics</p>
        <StatCards stats={learningStats} isLoading={isLoading} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">User Status Overview</p>
        <StatCards stats={userOverviewStats} isLoading={isLoading} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">Users &amp; billing</p>
        <StatCards stats={platformStats} isLoading={isLoading} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs">Support</p>
        <StatCards stats={supportStats} isLoading={isLoading} />
      </div>

      {/* Growth and subject distribution */}
      <div className="flex flex-col lg:flex-row gap-4">
        <ChartCard
          title={userGrowth?.title || "User Growth"}
          isEmpty={!growthData.length}
        >
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={userGrowth?.metricName || "users"}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ChartCard>

        <ChartCard title="Top Subjects" isEmpty={!subjectData.length}>
          <PieChart>
            <Pie
              data={subjectData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              innerRadius={50}
              fill="#8884d8"
              nameKey="label"
              dataKey="value"
            >
              {subjectData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.label}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>

      {/* Revenue and peak usage */}
      <div className="flex flex-col lg:flex-row gap-4">
        <ChartCard
          title={revenueGrowth?.title || "Revenue Growth"}
          isEmpty={!revenueData.length}
        >
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatNaira(value)} />
            <Legend />
            <Bar
              dataKey="value"
              name={revenueGrowth?.metricName || "Revenue (NGN)"}
              fill="#3b82f6"
            />
          </BarChart>
        </ChartCard>

        <ChartCard title="Peak Usage by Hour" isEmpty={!peakUsageData.length}>
          <BarChart data={peakUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" name="Sessions" fill="#8b5cf6" />
          </BarChart>
        </ChartCard>
      </div>

      {/* User Demographics — hidden for the demo */}
      {/* <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow">
        <p className="text-sm font-semibold">User Demographics</p>
        {geoRows.length ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {geoRows.map((row) => (
              <div
                key={row.country}
                className="bg-blue-400 rounded-md w-20 h-14 flex flex-col items-center justify-center text-xs"
              >
                <p className="text-blue-900 font-semibold text-center leading-tight">
                  {row.country}
                </p>
                <p className="text-white">{formatCount(row.users)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No regional usage recorded yet</p>
        )}
      </div> */}
    </div>
  );
};

export default Page;
