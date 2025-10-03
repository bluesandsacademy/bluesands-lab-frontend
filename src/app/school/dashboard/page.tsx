"use client";
import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import SchoolWelcomeBanner from "@/components/School/Dashboard/SchoolWelcomeBanner";
import SchoolWideTrend from "@/components/School/Dashboard/SchoolWideTrend";
import { schoolDashStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";

const SchoolDashboardPage = () => {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
  return (
    <div className="p-4 space-y-4">
      <SchoolWelcomeBanner firstName={firstName || ""} />
      <StatCards stats={schoolDashStats} />
      <div className=" flex flex-col md:flex-row items-center gap-6">
        <SchoolWideTrend />
        <div className="flex flex-col p-4 gap-4 w-96 rounded-lg bg-white lg:py-14">
          <strong className="text-sm md:text-base text-gray-500">Subscription</strong>
          <div className="flex flex-col gap-2">
            <p className="text-sm">Plan Type</p>
            <p className="text-green-400 text-xs md:text-sm">Active: renews in mont dd, yyyy</p>
            <p className="text-xs md:text-sm">Payment: cardtype card***num</p>
          </div>
          <button className="text-white bg-blue-950 rounded-md p-2 text-sm">
            Manage subscription
          </button>
        </div>
        
      </div>
      <div className="flex flex-col gap-3 bg-white rounded-md p-3">
            <p className="text-blue-950 text-sm lg:text-base font-semibold">Recent Activities</p>
        </div>
    </div>
  );
};

export default SchoolDashboardPage;
