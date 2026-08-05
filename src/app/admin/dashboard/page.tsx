"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getGlobalBillingPayments,
  getGlobalBillingRevenue,
  getGlobalDashboardGeoUsage,
  getGlobalDashboardGrowth,
  getGlobalDashboardInsights,
  getGlobalDashboardTotals,
  getGlobalSupportOverview,
  getGlobalUsers,
  type BillingPayment,
  type BillingRevenue,
  type GlobalDashboardGeoUsage,
  type GlobalDashboardGrowth,
  type GlobalDashboardInsights,
  type GlobalDashboardTotals,
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

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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

const formatPercent = (value?: number | null) =>
  isNumber(value) ? `${value}%` : PLACEHOLDER;

/** Growth points arrive as either "2026-01" or a full ISO timestamp. */
const formatGrowthLabel = (t: string) => {
  const parsed = new Date(t);
  if (Number.isNaN(parsed.getTime())) return t;
  return `${MONTHS[parsed.getMonth()]} ${String(parsed.getFullYear()).slice(2)}`;
};

/** The payments list is paginated; pull every page so revenue totals are complete. */
async function fetchAllPayments(token: string): Promise<BillingPayment[]> {
  const pageSize = 200;
  const first = await getGlobalBillingPayments({ page: 1, pageSize }, token);
  const items = [...(first.items ?? [])];
  const pages = isNumber(first.total) ? Math.ceil(first.total / pageSize) : 1;

  for (let page = 2; page <= pages; page++) {
    const next = await getGlobalBillingPayments({ page, pageSize }, token);
    items.push(...(next.items ?? []));
  }
  return items;
}

/** Sum paid payments per calendar month, oldest first, capped to the last 12. */
function toMonthlyRevenue(payments: BillingPayment[]) {
  const buckets = new Map<string, number>();

  payments
    .filter((p) => p?.status?.toLowerCase() === "paid" && isNumber(p.total))
    .forEach((p) => {
      const date = new Date(p.dateCreated);
      if (Number.isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      buckets.set(key, (buckets.get(key) ?? 0) + p.total);
    });

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, revenue]) => {
      const [year, month] = key.split("-");
      return { month: `${MONTHS[Number(month) - 1]} ${year.slice(2)}`, revenue };
    });
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
  const [revenue, setRevenue] = useState<BillingRevenue | null>(null);
  const [insights, setInsights] = useState<GlobalDashboardInsights | null>(null);
  const [growth, setGrowth] = useState<GlobalDashboardGrowth | null>(null);
  const [geo, setGeo] = useState<GlobalDashboardGeoUsage | null>(null);
  const [support, setSupport] = useState<SupportOverview | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [payments, setPayments] = useState<BillingPayment[]>([]);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchDashboard(authToken: string) {
      setIsLoading(true);
      setError(null);

      // Settled rather than all-or-nothing: one failing panel shouldn't blank the page.
      const [
        totalsRes,
        revenueRes,
        insightsRes,
        growthRes,
        geoRes,
        supportRes,
        usersRes,
        paymentsRes,
      ] = await Promise.allSettled([
        getGlobalDashboardTotals(authToken),
        getGlobalBillingRevenue(authToken),
        getGlobalDashboardInsights(authToken),
        getGlobalDashboardGrowth(authToken),
        getGlobalDashboardGeoUsage(authToken),
        getGlobalSupportOverview(authToken),
        getGlobalUsers({ page: 1, pageSize: 1 }, authToken),
        fetchAllPayments(authToken),
      ]);

      if (totalsRes.status === "fulfilled") setTotals(totalsRes.value);
      if (revenueRes.status === "fulfilled") setRevenue(revenueRes.value);
      if (insightsRes.status === "fulfilled") setInsights(insightsRes.value);
      if (growthRes.status === "fulfilled") setGrowth(growthRes.value);
      if (geoRes.status === "fulfilled") setGeo(geoRes.value);
      if (supportRes.status === "fulfilled") setSupport(supportRes.value);
      if (usersRes.status === "fulfilled") setTotalUsers(usersRes.value.total);
      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value);

      const failed = [
        totalsRes,
        revenueRes,
        insightsRes,
        growthRes,
        geoRes,
        supportRes,
        usersRes,
        paymentsRes,
      ].filter((r) => r.status === "rejected");

      if (failed.length) {
        console.error("Global admin dashboard: some requests failed", failed);
        setError(
          failed.length === 8
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
        value: formatCount(totalUsers),
        icon: "/images/icon/total_users.svg",
      },
      {
        title: "Total Schools Registered",
        value: formatCount(totals?.totalSchools),
        icon: "/images/icon/total_schools.svg",
      },
      {
        title: "Total Virtual Lab Experiments",
        value: formatCount(totals?.totalExperiments),
        icon: "/images/icon/microscope.svg",
      },
      {
        title: "Total Payments",
        value: formatNaira(revenue?.totalPaidNGN),
        icon: "/images/icon/total_payments.svg",
      },
    ],
    [totalUsers, totals, revenue],
  );

  const learningStats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total ILS Created",
        value: formatCount(totals?.totalIls),
        icon: "/images/icon/teacher/vr-headset-stemlabs.png",
      },
      {
        title: "Total Quiz Attempts",
        value: formatCount(totals?.totalQuizAttempts),
        icon: "/images/icon/clipboard.svg",
      },
      {
        title: "Average Quiz Score",
        value: formatPercent(insights?.avgQuizScorePercent),
        icon: "/images/icon/beaker_01.svg",
      },
      {
        title: "Active Users (30d)",
        value: formatCount(insights?.totalActiveUsers30d),
        icon: "/images/svg/subscribed.svg",
      },
    ],
    [totals, insights],
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
        value: formatCount(totals?.totalStudents),
        icon: "/images/icon/student_blue.svg",
      },
      {
        title: "Active Subscriptions",
        value: formatCount(revenue?.subscriptionsActive),
        icon: "/images/svg/subscribed.svg",
      },
      {
        title: "Payments Recorded",
        value: formatCount(revenue?.paymentsPaid),
        icon: "/images/icon/card_payment.svg",
      },
    ],
    [totals, revenue],
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

  const growthData = useMemo(
    () =>
      (growth?.points ?? [])
        .filter((point) => point && isNumber(point.v))
        .map((point) => ({
          label: formatGrowthLabel(point.t),
          value: point.v,
        })),
    [growth],
  );

  // Subject rows are returned with zero-count entries; those add nothing to a donut.
  const subjectData = useMemo(
    () =>
      (insights?.topSubjects ?? [])
        .filter((s) => s && isNumber(s.value) && s.value > 0)
        .map((s) => ({ label: s.label ?? "Unknown", value: s.value })),
    [insights],
  );

  const revenueData = useMemo(() => toMonthlyRevenue(payments), [payments]);

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

  const geoRows = useMemo(
    () => (geo?.rows ?? []).filter((row) => row && (row.users > 0 || row.schools > 0)),
    [geo],
  );

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
          title={growth?.metric ? `Growth — ${growth.metric}` : "Growth"}
          isEmpty={!growthData.length}
        >
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={growth?.metric || "value"}
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
        <ChartCard title="Revenue Growth" isEmpty={!revenueData.length}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatNaira(value)} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue (NGN)" fill="#3b82f6" />
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

      {/* User Demographics */}
      <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow">
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
      </div>
    </div>
  );
};

export default Page;
