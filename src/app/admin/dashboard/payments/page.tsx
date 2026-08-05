"use client";
import PaymentsTable from "@/components/Admin/Payments/PaymentsTable";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getAllGlobalBillingPayments,
  getAllGlobalBillingSubscriptions,
  getGlobalDashboardTotals,
  getGlobalSettings,
  type BillingPayment,
  type BillingSubscription,
  type GlobalDashboardTotals,
  type GlobalSettings,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
const PLACEHOLDER = "—";
const COLORS = ["#3B82F6", "#F59E0B"];
const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30.44;

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const formatMoney = (amount?: number | null, currency = "NGN") =>
  isNumber(amount)
    ? `${currency} ${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`
    : PLACEHOLDER;

const formatCount = (value?: number | null) =>
  isNumber(value) ? value.toLocaleString("en-NG") : PLACEHOLDER;

const isPaid = (payment: BillingPayment) =>
  payment.status?.toLowerCase() === "paid";

/** A payment or subscription with no real schoolId belongs to an individual. */
const isIndividual = (schoolId?: string) => !schoolId || schoolId === EMPTY_GUID;

const csvCell = (value: unknown) => {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const AdminPaymentsAndFinancePage = () => {
  const { user, token } = useUser();

  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [subscriptions, setSubscriptions] = useState<BillingSubscription[]>([]);
  const [totals, setTotals] = useState<GlobalDashboardTotals | null>(null);
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState("NGN");

  useEffect(() => {
    if (!user || !token) return;

    async function fetchFinance(authToken: string) {
      setIsLoading(true);
      setError(null);

      const [paymentsRes, subsRes, totalsRes, settingsRes] =
        await Promise.allSettled([
          getAllGlobalBillingPayments(authToken),
          getAllGlobalBillingSubscriptions(authToken),
          getGlobalDashboardTotals(authToken),
          getGlobalSettings(authToken),
        ]);

      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value);
      if (subsRes.status === "fulfilled") setSubscriptions(subsRes.value);
      if (totalsRes.status === "fulfilled") setTotals(totalsRes.value);
      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value);

      const requests = [paymentsRes, subsRes, totalsRes, settingsRes];
      const failed = requests.filter((r) => r.status === "rejected");
      if (failed.length) {
        console.error("Payments page: some requests failed", failed);
        setError(
          failed.length === requests.length
            ? "Could not load finance data. Please try again."
            : "Some finance data could not be loaded.",
        );
      }

      setIsLoading(false);
    }

    fetchFinance(token);
  }, [user, token]);

  /** Paid revenue per currency, so the USD card isn't a guess at conversion. */
  const revenueByCurrency = useMemo(() => {
    const buckets: Record<string, number> = {};
    payments.filter(isPaid).forEach((payment) => {
      if (!isNumber(payment.total)) return;
      const key = (payment.currency || "NGN").toUpperCase();
      buckets[key] = (buckets[key] ?? 0) + payment.total;
    });
    return buckets;
  }, [payments]);

  /**
   * Monthly recurring revenue: each active subscription's contract value spread
   * over its own duration, so a 12-month deal and a 14-day trial are comparable.
   */
  const mrr = useMemo(() => {
    return subscriptions
      .filter((sub) => sub.active)
      .reduce((sum, sub) => {
        const seats = isNumber(sub.studentsCovered) ? sub.studentsCovered : 0;
        const price = isNumber(sub.pricePerStudent) ? sub.pricePerStudent : 0;
        const contractValue = seats * price;
        if (!contractValue) return sum;

        const start = new Date(sub.startsAt).getTime();
        const end = new Date(sub.endsAt).getTime();
        if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
          return sum + contractValue;
        }
        const months = Math.max((end - start) / MS_PER_MONTH, 1);
        return sum + contractValue / months;
      }, 0);
  }, [subscriptions]);

  const stats: StatCardData[] = useMemo(
    () => [
      {
        title: "Total Revenue (NGN)",
        value: formatMoney(totals?.totalRevenueNGN ?? revenueByCurrency.NGN),
        icon: "/images/icon/admin/green_naira.svg",
      },
      {
        title: "Total Revenue (USD)",
        value: formatMoney(revenueByCurrency.USD ?? 0, "USD"),
        icon: "/images/icon/admin/blue_dollar.svg",
      },
      {
        title: "Active Subscriptions",
        value: formatCount(totals?.activeSubscriptions),
        icon: "/images/icon/admin/red_alarm.svg",
      },
      {
        title: "Monthly Recurring Revenue",
        value: formatMoney(Math.round(mrr)),
        icon: "/images/icon/clipboard.svg",
      },
    ],
    [totals, revenueByCurrency, mrr],
  );

  const breakdownData = useMemo(() => {
    const individual = subscriptions.filter((s) =>
      isIndividual(s.schoolId),
    ).length;
    const school = subscriptions.length - individual;
    return [
      { name: "Individual", value: individual },
      { name: "School", value: school },
    ].filter((entry) => entry.value > 0);
  }, [subscriptions]);

  /** Latest subscription end date per school, shown as the next renewal date. */
  const nextPaymentBySchool = useMemo(() => {
    const map: Record<string, string> = {};
    subscriptions.forEach((sub) => {
      if (!sub.schoolId || !sub.endsAt) return;
      const existing = map[sub.schoolId];
      if (!existing || new Date(sub.endsAt) > new Date(existing)) {
        map[sub.schoolId] = sub.endsAt;
      }
    });
    return map;
  }, [subscriptions]);

  /** Providers actually seen in the payment history, with their volume. */
  const providers = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    payments.forEach((payment) => {
      if (!payment.provider) return;
      // Casing is inconsistent ("paystack" and "Paystack"), so key lowercased.
      const key = payment.provider.toLowerCase();
      const existing = counts.get(key);
      if (existing) existing.count += 1;
      else
        counts.set(key, {
          label: key.charAt(0).toUpperCase() + key.slice(1),
          count: 1,
        });
    });
    return [...counts.values()].sort((a, b) => b.count - a.count);
  }, [payments]);

  const visiblePayments = useMemo(
    () =>
      payments.filter(
        (payment) => (payment.currency || "NGN").toUpperCase() === currency,
      ),
    [payments, currency],
  );

  const currencyOptions = useMemo(() => {
    const seen = new Set(
      payments.map((p) => (p.currency || "NGN").toUpperCase()),
    );
    seen.add("NGN");
    return [...seen].sort();
  }, [payments]);

  /** Built from the rows on screen, so the file always matches the view. */
  const handleExportCsv = () => {
    const header = [
      "Reference",
      "Payer",
      "School ID",
      "Currency",
      "Subtotal",
      "VAT",
      "Total",
      "Status",
      "Provider",
      "Date",
    ];
    const rows = visiblePayments.map((payment) => [
      payment.reference,
      payment.schoolName || "Individual",
      payment.schoolId,
      payment.currency,
      payment.subtotal,
      payment.vat,
      payment.total,
      payment.status,
      payment.provider,
      payment.dateCreated,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");

    const blob = new Blob([`﻿${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-${currency.toLowerCase()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <div className="flex self-end gap-1 lg:gap-2">
        <select
          name="currency"
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="text-xs lg:text-sm rounded-md border border-gray-300 p-1"
        >
          {currencyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={handleExportCsv}
          disabled={isLoading || !visiblePayments.length}
          className="p-2 px-3 text-xs lg:text-sm bg-bgBlue text-white rounded-md disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      <StatCards stats={stats} isLoading={isLoading} />

      <div className="flex flex-col lg:flex-row gap-2 lg:gap-3">
        <div className="flex flex-col gap-3 w-full lg:w-[65%]">
          <PaymentsTable
            payments={visiblePayments}
            isLoading={isLoading}
            nextPaymentBySchool={nextPaymentBySchool}
          />

          {/* Donut Chart */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold mb-4">
              Subscription Breakdown (Individual vs School)
            </h3>
            {!breakdownData.length ? (
              <div className="h-[300px] flex items-center justify-center text-xs text-gray-400">
                No subscriptions recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-[35%] gap-2 lg:gap-4">
          {/* Payment Integrations */}
          <div className="flex flex-col bg-white rounded-md p-3 gap-2 lg:gap-3">
            <p className="text-sm lg:text-base font-semibold">
              Payment Integrations
            </p>
            {isLoading ? (
              <p className="text-xs text-gray-400">Loading providers…</p>
            ) : !providers.length ? (
              <p className="text-xs text-gray-400">
                No payment providers used yet
              </p>
            ) : (
              providers.map((provider) => (
                <div
                  key={provider.label}
                  className="flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold">{provider.label}</p>
                    <p className="text-[.6rem] text-gray-500">
                      {provider.count.toLocaleString("en-NG")} payment(s)
                      processed
                    </p>
                  </div>
                  <p className="text-xs text-emerald-600">In use</p>
                </div>
              ))
            )}
            <button
              disabled
              title="Adding providers needs backend support"
              className="bg-bgBlue text-white rounded-md p-1 lg:p-2 text-xs lg:text-sm w-max opacity-50 cursor-not-allowed"
            >
              Add New Provider
            </button>
          </div>

          {/* Billing Settings */}
          <div className="flex flex-col bg-white rounded-md p-3 gap-1 lg:gap-3">
            <p className="text-sm lg:text-base font-semibold">
              Billing Settings
            </p>
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-col">
                <p className="text-sm font-semibold">
                  Default Billing Currency
                </p>
                <p className="text-[.6rem] text-gray-500">
                  Set the currency used for invoices
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {isLoading ? "…" : settings?.currency || PLACEHOLDER}
              </p>
            </div>
            {!!settings?.languages?.length && (
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">Languages</p>
                  <p className="text-[.6rem] text-gray-500">
                    Enabled across the platform
                  </p>
                </div>
                <p className="text-sm text-gray-900 uppercase">
                  {settings.languages.join(", ")}
                </p>
              </div>
            )}
            <p className="text-[11px] text-gray-400">
              Editing settings needs a backend update endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsAndFinancePage;
