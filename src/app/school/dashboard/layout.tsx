"use client";

import { useState } from "react";
import TopNav from "@/components/Navbar/TopNav";
import Sidebar from "@/components/Navbar/Sidebar";
import PaymentGuard from "@/services/PaymentGuard";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex w-full min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="bg-[#F5F6FA] w-full flex flex-col min-h-screen overflow-x-hidden md:ml-64">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <PaymentGuard paymentRoute="/school/dashboard/payments">
            {children}
          </PaymentGuard>
        </div>
      </div>
    </main>
  );
}
