// import type { Metadata } from "next";
// import Sidebar from "@/components/Navbar/Sidebar";
// import TopNav from "@/components/Navbar/TopNav";

// export const metadata: Metadata = {
//     title: "Dashboard | Blue Sands Stem Labs"
// }


// export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
//     return (
//         <main className="flex w-full">
//             <Sidebar />
//             <div className="bg-[#F5F6FA] w-full flex flex-col max-h-screen overflow-y-scroll">
//                 <TopNav />
//                 {children}
//             </div>
//         </main>
//     )
// }

// 3. Updated DashboardLayout Component
"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/Navbar/Sidebar";
import TopNav from "@/components/Navbar/TopNav";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <main className="flex w-full min-h-screen">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            <div className="bg-[#F5F6FA] w-full flex flex-col min-h-screen overflow-x-hidden md:ml-64">
                <TopNav onMenuClick={() => setSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </main>
    )
}