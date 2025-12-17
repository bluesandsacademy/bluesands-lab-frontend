// "use client"
// import StatCards from '@/components/Dashboard/StatCards'
// import WelcomeBanner from '@/components/Dashboard/WelcomeBanner'
// import AnswerEval from '@/components/Quiz/AnswerEval'
// import { quizResultStats } from '@/lib/data'
// import { useUser } from '@/services/UserContext'

// const QuizReport = () => {
//     const { user } = useUser();
//     const firstName = user?.fullName?.split(" ")[0];
//   return (
//     <div>
//         <WelcomeBanner firstName={firstName? firstName : ""}/>
//         <StatCards stats={quizResultStats} />
//         <AnswerEval questions={[]}/>
//     </div>
//   )
// }

// export default QuizReport

// app/dashboard/stem-quizzes/report/page.tsx
"use client";

import StatCards from "@/components/Dashboard/StatCards";
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import AnswerEval from "@/components/Quiz/AnswerEval";
import { useUser } from "@/services/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const QuizReport = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const firstName = user?.fullName?.split(" ")[0];

  const resultsData = useMemo(() => {
    const data = searchParams.get("data");
    if (!data) return null;
    try {
      return JSON.parse(decodeURIComponent(data));
    } catch (error) {
      console.error("Error parsing results data:", error);
      return null;
    }
  }, [searchParams]);

  // Generate stats from results
  const quizResultStats = resultsData
    ? [
        {
          title: "Score",
          value: `${resultsData.score}%`,
          icon: "/images/icon/clipboard.svg",
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
        },
        {
          title: "Correct Answers",
          value: `${resultsData.correctAnswers}/${resultsData.totalQuestions}`,
          icon: "/images/icon/highscore.svg",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
        },
        {
          title: "Time Spent",
          value: `${Math.floor(resultsData.timeSpent / 60)}m ${
            resultsData.timeSpent % 60
          }s`,
          icon: "/images/icon/stopwatch.svg",
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
        },
        {
          title: "Completion",
          value: "100%",
          icon: "/images/icon/grad.svg",
          bgColor: "bg-orange-50",
          textColor: "text-orange-600",
        },
      ]
    : [];

  if (!resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-red-600 mb-4">No quiz results found</div>
          <button
            onClick={() => router.push("/dashboard/stem-quizzes")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <WelcomeBanner firstName={firstName ? firstName : ""} />
      
      {/* Quiz Title */}
      <div className="mx-4 md:mx-8 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {resultsData.quizTitle}
        </h2>
        <p className="text-gray-600 mt-1">Quiz Results & Performance Analysis</p>
      </div>

      <StatCards stats={quizResultStats} />
      
      {/* Performance Message */}
      <div className="mx-4 md:mx-8 mb-2 mt-2">
        <div
          className={`p-4 rounded-lg ${
            resultsData.score >= 80
              ? "bg-green-50 border border-green-200"
              : resultsData.score >= 60
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p
            className={`font-semibold ${
              resultsData.score >= 80
                ? "text-green-700"
                : resultsData.score >= 60
                ? "text-yellow-700"
                : "text-red-700"
            }`}
          >
            {resultsData.score >= 80
              ? "🎉 Excellent Work!"
              : resultsData.score >= 60
              ? "👍 Good Effort!"
              : "📚 Keep Practicing!"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {resultsData.score >= 80
              ? "You demonstrated strong understanding of the material."
              : resultsData.score >= 60
              ? "You have a good grasp of the basics. Review the explanations below to strengthen your knowledge."
              : "Don't worry! Review the explanations carefully and try again."}
          </p>
        </div>
      </div>

      <AnswerEval questions={resultsData.questionResults} />

      {/* Action Buttons */}
      <div className="mx-4 md:mx-8 mt-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => router.push("/dashboard/stem-quizzes")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Take Another Quiz
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizReport;