"use client";
import DataSecurityTab from "@/components/Admin/Settings/DataSecurityTab";
import IntegrationsTab, {
  type PaymentProviderUsage,
} from "@/components/Admin/Settings/IntegrationsTab";
import PlatformConfigTab from "@/components/Admin/Settings/PlatformConfigTab";
import {
  getAllGlobalBillingPayments,
  getGlobalSettings,
  type BillingPayment,
  type GlobalSettings,
} from "@/services/globalAdminDashboardService";
import FilterButton from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useMemo, useState } from "react";

const TABS = ["Platform Configuration", "Data Security & backups", "Integrations"];

const AdminSystemSettingsPage = () => {
  const { user, token } = useUser();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    async function fetchSettings(authToken: string) {
      setIsLoading(true);
      setError(null);

      const [settingsRes, paymentsRes] = await Promise.allSettled([
        getGlobalSettings(authToken),
        getAllGlobalBillingPayments(authToken),
      ]);

      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value);
      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value);

      const failed = [settingsRes, paymentsRes].filter(
        (r) => r.status === "rejected",
      );
      if (failed.length) {
        console.error("System settings: some requests failed", failed);
        setError(
          failed.length === 2
            ? "Could not load settings. Please try again."
            : "Some settings could not be loaded.",
        );
      }

      setIsLoading(false);
    }

    fetchSettings(token);
  }, [user, token]);

  /** Same derivation the payments page uses, so both screens agree. */
  const providers: PaymentProviderUsage[] = useMemo(() => {
    const counts = new Map<string, PaymentProviderUsage>();
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

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <FilterButton
        filters={TABS}
        activeFilter={activeTab}
        onFilterChange={setActiveTab}
      />

      {error && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      {activeTab === "Platform Configuration" ? (
        <PlatformConfigTab settings={settings} isLoading={isLoading} />
      ) : activeTab === "Data Security & backups" ? (
        <DataSecurityTab />
      ) : (
        <IntegrationsTab providers={providers} isLoading={isLoading} />
      )}
    </div>
  );
};

export default AdminSystemSettingsPage;
