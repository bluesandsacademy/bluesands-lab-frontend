"use client"
import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { courseStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";

const DashboardStemCoursesPage = () => {
     const { user } = useUser();
     const firstName = user?.fullName?.split(" ")[0];
  return (
     <div className="m-1">
           <WelcomeBanner firstName={firstName? firstName : ""}/>
           <StatCards stats={courseStats} />
           <div className="m-4 mt-6 lg:mt-12">
              <p className="text-sm lg:text-base font-semibold lg:ml-4">STEM Courses Coming Soon...</p>
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

export default DashboardStemCoursesPage