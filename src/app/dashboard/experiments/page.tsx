"use client"

import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { expStats } from "@/lib/data";
import CourseFilter from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import { useState } from "react";

export default function DashboardExperimentsPage() {
    const { user } = useUser();
    const firstName = user?.fullName?.split(" ")[0];
    const filters = ["All Experiments", "Physics", "Chemistry", "Biology"];
    const [activeFilter, setActiveFilter] = useState(filters[0]);

    //  The function to filter courses 
    //  const filteredCourses =
    // activeFilter === "All Experiments"
    //   ? courseData
    //   : courseData.filter((course) => course.subject === activeFilter);

    return (
        <div className="m-1">
            <WelcomeBanner firstName={firstName? firstName : ""}/>
            <StatCards stats={expStats} />
            <CourseFilter filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter}/>

            <div className="m-4">
                {/* <iframe src="https://youtu.be/6R8EFrK0Vk0?si=1BTzaPa9C6UrS5Ye" className="rounded-sm"> Watch our demo videos</iframe> */}
                 <iframe
                    src="https://www.youtube.com/embed/6R8EFrK0Vk0"
                    className="rounded-sm w-full md:w-96 h-52 md:h-80 lg:w-[560px] lg:h-[315px] m-1 md:m-2 lg:m-4 mb-32"
                    width="560"
                    height="315"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Demo Video"
                ></iframe>
            </div>
        </div>
    )
}