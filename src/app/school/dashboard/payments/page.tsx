"use client";
import SchoolBillingHistory from "@/components/School/Dashboard/Payments/BillingHistory";
import SchoolPaymentOverview from "@/components/School/Dashboard/Payments/Overview";
import SchoolStudentPayment from "@/components/School/Dashboard/Payments/StudentPayment";
import SchoolFilterButton from "@/components/School/Dashboard/SchoolFilterButton";
import { getSchoolAdminBilling } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useState } from "react";

interface BillingResponse {
  subscription: {
    isActive: boolean;
    tier: string;
    seats: number;
    endsAt: string;
    daysRemaining: number;
  };
  recentPayments: [
    {
      id: number;
      amount: number;
      status: string;
      paidAt: string;
      reference: string;
      promo: string;
    }
  ];
}

const SchoolPaymentsAndSubPage = () => {
  const [billingData, setBillingData] = useState<BillingResponse>();
  const filters = [
    "Overview",
    "Student Payment",
    "Billing History",
    "Plans and Pricing",
  ];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const { user, token } = useUser();

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getSchoolAdminBilling(token);
        setBillingData(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, [user, token]);

  return (
    <div className="mt-4 p-2 lg:p-4">
      <SchoolFilterButton
        filters={filters}
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
      />
      {activeFilter === "Overview" ? (
        <SchoolPaymentOverview
          isActive={billingData?.subscription.isActive}
          currentSub={billingData?.subscription.tier}
          daysRemaining={billingData?.subscription.daysRemaining}
          seats={billingData?.subscription.seats}
        />
      ) : activeFilter === "Student Payment" ? (
        <SchoolStudentPayment />
      ) : activeFilter === "Billing History" ? (
        <SchoolBillingHistory />
      ) : (
        ""
      )}
    </div>
  );
};

export default SchoolPaymentsAndSubPage;
