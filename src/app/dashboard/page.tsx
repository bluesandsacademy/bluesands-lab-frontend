
"use client";

import { profile, stats } from "@/lib/data";
import StatCards from "@/components/Dashboard/StatCards";
import PerformanceByStemCourses from "@/components/Dashboard/Performance";
import UpcomingStemCourses from "@/components/Dashboard/UpcomingStemCourses";

export default function DashboardHome() {
    const firstName = profile.fullName.split(" ")[0];
    return (
        <div className="p-5 space-y-5">
            <div className="relative">
                <img src="/images/bg/welcome_cover.png" alt="" />
                <div className="absolute top-1/2 -translate-y-1/2 text-white left-10 space-y-2">
                    <h3 className="font-medium text-3xl">Welcome Back, {firstName}</h3>
                    <p className="text-md">Ready for your next STEM adventure?</p>
                </div>
            </div>

            <StatCards stats={stats} />
            
            <div className="grid grid-cols-5 gap-x-5 justify-start items-center ">
                <PerformanceByStemCourses />
                <UpcomingStemCourses />
            </div>

            <p className="text-gray-500">Let’s dive into your next STEM adventure!</p>
        </div>
    )
}