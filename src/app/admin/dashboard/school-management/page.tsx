"use client";
import PaymentTable from "@/components/Admin/School-mgt/PaymentTable";
import SchoolTable from "@/components/Admin/School-mgt/SchoolTable";
import UsersPanel, {
  ROLE_FILTERS,
  roleValueFor,
} from "@/components/Admin/User-mgt/UsersPanel";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import {
  getAllGlobalBillingPayments,
  getAllGlobalUsers,
  getGlobalBillingRevenue,
  type BillingPayment,
  type BillingRevenue,
  type GlobalUser,
} from "@/services/globalAdminDashboardService";
import FilterButton from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useMemo, useState } from "react";
import { FaFilter } from "react-icons/fa";

const SCHOOL_STATUS_FILTERS = ["All Statuses", "Active", "Inactive"];
const PAYMENT_STATUS_FILTERS = ["All Statuses", "Paid", "Pending"];

const formatNaira = (amount: number) =>
  `NGN ${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const isPaid = (payment: BillingPayment) =>
  payment.status?.toLowerCase() === "paid";

const AdminSchoolManagementpage = () => {
  const filters = ["Schools", "Users", "Payments"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const { user, token } = useUser();

  const [search, setSearch] = useState("");
  const [schoolStatus, setSchoolStatus] = useState(SCHOOL_STATUS_FILTERS[0]);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS_FILTERS[0]);
  const [roleFilter, setRoleFilter] = useState(ROLE_FILTERS[0].label);

  const [schoolAdmins, setSchoolAdmins] = useState<GlobalUser[]>([]);
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [revenue, setRevenue] = useState<BillingRevenue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchBilling(authToken: string) {
      setIsLoading(true);
      setError(null);

      const [schoolAdminsRes, paymentsRes, revenueRes] =
        await Promise.allSettled([
          getAllGlobalUsers({ role: "SchoolAdmin" }, authToken),
          getAllGlobalBillingPayments(authToken),
          getGlobalBillingRevenue(authToken),
        ]);

      if (schoolAdminsRes.status === "fulfilled") {
        setSchoolAdmins(schoolAdminsRes.value);
      }
      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value);
      if (revenueRes.status === "fulfilled") setRevenue(revenueRes.value);

      const requests = [schoolAdminsRes, paymentsRes, revenueRes];
      const failed = requests.filter((r) => r.status === "rejected");
      if (failed.length) {
        console.error("School management: some requests failed", failed);
        setError(
          failed.length === requests.length
            ? "Could not load school and billing data. Please try again."
            : "Some data could not be loaded.",
        );
      }

      setIsLoading(false);
    }

    fetchBilling(token);
  }, [user, token]);

  const paymentStats: StatCardData[] = useMemo(() => {
    const now = new Date();
    const paidThisMonth = payments
      .filter((p) => {
        if (!isPaid(p) || typeof p.total !== "number") return false;
        const date = new Date(p.dateCreated);
        return (
          !Number.isNaN(date.getTime()) &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + p.total, 0);

    const pendingTotal = payments
      .filter(
        (p) =>
          p.status?.toLowerCase() === "pending" && typeof p.total === "number",
      )
      .reduce((sum, p) => sum + p.total, 0);

    return [
      {
        title: "Paid This Month",
        value: formatNaira(paidThisMonth),
        icon: "/images/icon/admin/green-paid.svg",
      },
      {
        title: "Pending",
        value: formatNaira(pendingTotal),
        icon: "/images/icon/admin/blue-pending.svg",
      },
      {
        title: "Payments Recorded",
        value: revenue ? revenue.paymentsPaid.toLocaleString("en-NG") : "—",
        icon: "/images/icon/admin/blue_dollar.svg",
      },
      {
        title: "Total Payments",
        value: revenue ? formatNaira(revenue.totalPaidNGN) : "—",
        icon: "/images/icon/total_payments.svg",
      },
    ];
  }, [payments, revenue]);

  const searchPlaceholder =
    activeFilter === "Schools"
      ? "Search School..."
      : activeFilter === "Users"
        ? "Search by name or email..."
        : "Search reference or provider...";

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <FilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />

      <div className="flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-end md:items-center p-4 rounded-md bg-white">
        <div className="flex text-xs md:text-sm gap-4 items-center">
          <input
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="text-sm rounded-md p-2 border border-gray-300"
          />
          <div className="flex items-center text-gray-500 rounded-md p-2 border border-gray-200">
            <FaFilter />
            {activeFilter === "Schools" ? (
              <select
                value={schoolStatus}
                onChange={(e) => setSchoolStatus(e.target.value)}
              >
                {SCHOOL_STATUS_FILTERS.map((filter) => (
                  <option value={filter} key={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            ) : activeFilter === "Users" ? (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {ROLE_FILTERS.map((filter) => (
                  <option value={filter.label} key={filter.label}>
                    {filter.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                {PAYMENT_STATUS_FILTERS.map((filter) => (
                  <option value={filter} key={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {activeFilter === "Payments" && (
        <StatCards stats={paymentStats} isLoading={isLoading} />
      )}

      {activeFilter === "Schools" ? (
        <SchoolTable
          users={schoolAdmins}
          isLoading={isLoading}
          search={search}
          statusFilter={schoolStatus}
        />
      ) : activeFilter === "Users" ? (
        <UsersPanel search={search} role={roleValueFor(roleFilter)} />
      ) : activeFilter === "Payments" ? (
        <PaymentTable
          payments={payments}
          isLoading={isLoading}
          search={search}
          statusFilter={paymentStatus}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminSchoolManagementpage;
