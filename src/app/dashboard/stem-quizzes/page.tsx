"use client"

import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { quizStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";

const DashboardStemQuizesPage = () => {
   const { user } = useUser();
     const firstName = user?.fullName?.split(" ")[0];
    return (
        <div className="m-1">
           <WelcomeBanner firstName={firstName? firstName : ""}/>
           <StatCards stats={quizStats} />

            <div className="m-4 flex items-center justify-center mt-8">
               <div className="grid lg:grid-cols-3 gap-4">
                <div className="flex bg-gradient-to-tr from-blue-950 to-blue-600 h-40 w-56 lg:h-[200px] lg:w-[280px] rounded-md items-center justify-center">
                  <p className="text-white font-semibold lg:text-2xl">Physics</p>
                </div>
                 <div className="flex bg-gradient-to-tr from-blue-950 to-blue-600 h-40 w-56 lg:h-[200px] lg:w-[280px] rounded-md items-center justify-center">
                  <p className="text-white font-semibold lg:text-2xl">Chemistry</p>
                </div>
                 <div className="flex bg-gradient-to-tr from-blue-950 to-blue-600 h-40 w-56 lg:h-[200px] lg:w-[280px] rounded-md items-center justify-center">
                  <p className="text-white font-semibold lg:text-2xl">Biology</p>
                </div>
               </div>
            </div>
        </div>
  )
}

export default DashboardStemQuizesPage