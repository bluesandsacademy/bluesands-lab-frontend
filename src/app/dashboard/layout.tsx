import type { Metadata } from "next";
import Sidebar from "@/components/Navbar/Sidebar";

export const metadata: Metadata = {
    title: "Dashboard | Blue Sands Stem Labs"
}


export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex w-full">
            <Sidebar />
            <div className="bg-[#F5F6FA] w-full p-3">{children}</div>
        </main>
    )
}