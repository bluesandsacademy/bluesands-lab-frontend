// "use client";

// import { profile, stats } from "@/lib/data";
// import StatCards from "@/components/Dashboard/StatCards";
// import PerformanceByStemCourses from "@/components/Dashboard/Performance";
// import UpcomingStemCourses from "@/components/Dashboard/UpcomingStemCourses";
// import QuizPerformance from "@/components/Dashboard/Performance/Quiz";
// import TimeSpent from "@/components/Dashboard/Performance/TimeSpent";
// import { useUser } from "@/services/UserContext";

// export default function DashboardHome() {
//   const { user } = useUser();
//   const firstName = user?.fullName?.split(" ")[0];
//    const handleclick = () => {
//     console.log(user);
//     alert(user)
//    }
//   return (
//     <div className="p-5 space-y-10">
//       <div className="relative">
//         <img src="/images/bg/welcome_cover.png" alt="" />
//         <div className="absolute top-1/2 -translate-y-1/2 text-white left-10 space-y-2">
//           <h3 className="font-medium text-3xl">Welcome Back, {firstName}</h3>
//           <p className="text-md">Ready for your next STEM adventure?</p>
//         </div>
//       </div>

//       <StatCards stats={stats} />

//       <div className="grid grid-cols-5 gap-x-5 justify-start items-center ">
//         <TimeSpent />
//         <QuizPerformance />
//       </div>

//       <div className="grid grid-cols-5 gap-x-5 justify-start items-center ">
//         <PerformanceByStemCourses />
//         <UpcomingStemCourses />
//       </div>

//       <p className="text-gray-500">Let’s dive into your next STEM adventure!</p>
//       <button onClick={handleclick}> show user</button>
//     </div>
//   );
// }


// 4. Updated DashboardPage Component
"use client";

import { profile, stats } from "@/lib/data";
import StatCards from "@/components/Dashboard/StatCards";
import PerformanceByStemCourses from "@/components/Dashboard/Performance";
import UpcomingStemCourses from "@/components/Dashboard/UpcomingStemCourses";
import QuizPerformance from "@/components/Dashboard/Performance/Quiz";
import TimeSpent from "@/components/Dashboard/Performance/TimeSpent";
import { useUser } from "@/services/UserContext";

export default function DashboardHome() {
  const { user } = useUser();
  const firstName = user?.fullName?.split(" ")[0];
   
  const handleclick = () => {
    console.log(user);
    alert(user)
  }

  return (
    <div className="p-3 md:p-5 space-y-6 md:space-y-10">
      {/* Welcome Section */}
      <div className="relative rounded-lg md:rounded-none overflow-hidden">
        <img 
          src="/images/bg/welcome_cover.png" 
          alt="" 
          className="w-full h-32 md:h-auto object-cover"
        />
        <div className="absolute top-1/2 -translate-y-1/2 text-white left-4 md:left-10 space-y-1 md:space-y-2">
          <h3 className="font-medium text-lg md:text-2xl lg:text-3xl">
            Welcome Back, {firstName}
          </h3>
          <p className="text-sm md:text-md">Ready for your next STEM adventure?</p>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCards stats={stats} />

      {/* Performance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
        <div className="xl:col-span-2">
          <TimeSpent />
        </div>
        <div className="xl:col-span-3">
          <QuizPerformance />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 md:gap-5">
        <div className="xl:col-span-3">
          <PerformanceByStemCourses />
        </div>
        <div className="xl:col-span-2">
          <UpcomingStemCourses />
        </div>
      </div>

      <p className="text-gray-500 text-sm md:text-base">Let's dive into your next STEM adventure!</p>
      {/* <button onClick={handleclick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Show user
      </button> */}
    </div>
  );
}