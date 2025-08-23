"use client"
import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { schoolDashStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";


const SchoolDashboardPage = () => {
    const { user } = useUser();
    const firstName = user?.fullName?.split(" ")[0];
  return (
    <div className="p-4 space-y-4">
        <WelcomeBanner firstName={firstName || ""} />
        <StatCards stats={schoolDashStats} />
    </div>
  )
}

export default SchoolDashboardPage