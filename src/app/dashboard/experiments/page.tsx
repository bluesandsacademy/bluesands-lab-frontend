"use client"

import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { expStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";

export default function DashboardExperimentsPage() {
     const { user } = useUser();
     const firstName = user?.fullName?.split(" ")[0];
    return (
        <div className="m-1">
           <WelcomeBanner firstName={firstName? firstName : ""}/>
           <StatCards stats={expStats} />
            <div className="flex gap-1 md:gap-2 lg:gap-4 mx-auto lg:mx-0 bg-white rounded-md mt-4 p-3">
                <button className="bg-[#f5f6fa] p-1 lg:p-2 text-bgBlue rounded-md text-xs lg:text-sm active:bg-bgBlue active:text-white">All Experiments</button>
                <button className="bg-[#f5f6fa] p-1 lg:p-2 text-bgBlue text-xs lg:text-sm rounded-md active:bg-bgBlue active:text-white">Physics</button>
                <button className="bg-[#f5f6fa] p-1 lg:p-2 text-bgBlue text-xs lg:text-sm rounded-md active:bg-bgBlue active:text-white">Chemistry</button>
                <button className="bg-[#f5f6fa] p-1 lg:p-2 text-bgBlue text-xs lg:text-sm rounded-md active:bg-bgBlue active:text-white">Biology</button>
            </div>

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