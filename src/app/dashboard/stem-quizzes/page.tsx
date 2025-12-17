// "use client";

// import StatCards from "@/components/Dashboard/StatCards";
// import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
// import { quizStats } from "@/lib/data";
// import { useUser } from "@/services/UserContext";

// const DashboardStemQuizesPage = () => {
//   const { user } = useUser();
//   const firstName = user?.fullName?.split(" ")[0];
//   return (
//     <div className="m-1">
//       <WelcomeBanner firstName={firstName ? firstName : ""} />
//       <StatCards stats={quizStats} />

//       <div className="m-4 w-full flex items-center justify-center mt-8">
//         <div className="flex flex-col gap-4 w-full items-center">
//           <div className="flex flex-col w-full md:w-[80%] rounded-md bg-white shadow-md pb-1.5">
//             <div className="flex bg-bgBlue text-white p-2 rounded-t-md">
//               {" "}
//               <p className="text-white lg:text-2xl">Physics</p>
//             </div>
//             <div className="flex gap-10 p-3 items-center justify-center">
//               <button className="p-2 px-24 rounded bg-[#FFEDD5] text-[#CC0000] font-semibold">
//                 Pre-sim
//               </button>
//               <button className="p-2 px-24 rounded bg-[#DCFCE7] text-[#15803D] font-semibold">
//                 Post-sim{" "}
//               </button>
//             </div>
//             <div className="text-xs text-gray-400 flex justify-center">
//               Take assessments before and after simulations
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardStemQuizesPage;

// app/dashboard/stem-quizzes/page.tsx
"use client";

import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { quizStats } from "@/lib/data";
import { useUser } from "@/services/UserContext";
import { useRouter } from "next/navigation";
import { mockQuizzes } from "@/lib/mockQuizData";

const DashboardStemQuizesPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const firstName = user?.fullName?.split(" ")[0];

  const handleQuizStart = (quizId: string) => {
    // Navigate to quiz session (outside dashboard layout)
    router.push(`/quiz-session/${quizId}`);
  };

  // Group quizzes by category and type
  const quizzesByCategory = mockQuizzes.reduce((acc, quiz) => {
    if (!acc[quiz.category]) {
      acc[quiz.category] = { "pre-sim": null, "post-sim": null };
    }
    acc[quiz.category][quiz.type] = quiz;
    return acc;
  }, {} as Record<string, { "pre-sim": any; "post-sim": any }>);

  return (
    <div className="m-1">
      <WelcomeBanner firstName={firstName ? firstName : ""} />
      <StatCards stats={quizStats} />

      <div className="m-4 w-full flex items-center justify-center mt-8">
        <div className="flex flex-col gap-6 w-full items-center">
          {Object.entries(quizzesByCategory).map(([category, quizzes]) => (
            <div
              key={category}
              className="flex flex-col w-full md:w-[80%] rounded-md bg-white shadow-md pb-1.5"
            >
              {/* Category Header */}
              <div className="flex bg-bgBlue text-white p-4 rounded-t-md">
                <p className="text-white text-xl lg:text-2xl font-semibold">
                  {category}
                </p>
              </div>

              {/* Quiz Buttons */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-10 p-6 items-center justify-center">
                {quizzes["pre-sim"] && (
                  <button
                    onClick={() => handleQuizStart(quizzes["pre-sim"].id)}
                    className="w-full md:w-auto p-3 px-16 md:px-24 rounded-lg bg-[#FFEDD5] text-[#CC0000] font-semibold hover:bg-[#FED7AA] transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Pre-sim
                  </button>
                )}
                {quizzes["post-sim"] && (
                  <button
                    onClick={() => handleQuizStart(quizzes["post-sim"].id)}
                    className="w-full md:w-auto p-3 px-16 md:px-24 rounded-lg bg-[#DCFCE7] text-[#15803D] font-semibold hover:bg-[#BBF7D0] transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Post-sim
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="text-xs text-gray-400 flex justify-center pb-3">
                Take assessments before and after simulations
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStemQuizesPage;