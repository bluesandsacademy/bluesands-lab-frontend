// "use client";

// import { FiCheckCircle } from "react-icons/fi";
// import { GiTrophy } from "react-icons/gi";

// export default function AssessmentStep({ data }: any) {
//   // const { score, maxScore, completionItems, teacherFeedbackPending } = data;
//   const assessmentData = {
//     score: 5,
//     maxScore: 5,
//     teacherFeedbackPending: true,
//     completionItems: [
//       {
//         id: "c1",
//         label: "Pre-Quiz Completed",
//       },
//       {
//         id: "c2",
//         label: "Hypothesis Submitted",
//       },
//       {
//         id: "c3",
//         label: "Experiment Completed",
//       },
//       {
//         id: "c4",
//         label: "Reflection Posted",
//       },
//       {
//         id: "c5",
//         label: "Assessment Submitted",
//       },
//     ],
//   };
//   const { score, maxScore, completionItems, teacherFeedbackPending } = assessmentData;
//   const progressPercent = Math.round((score / maxScore) * 100);

//   return (
//     <div className="flex flex-col gap-4 p-6">
//       {/* Trophy banner */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 to-indigo-500 p-8 text-center text-white">
//         <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10" />
//         <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
//         <div className="relative z-10 flex flex-col items-center gap-3">
//           <GiTrophy size={56} className="text-yellow-400 drop-shadow-lg" />
//           <div>
//             <h1 className="text-2xl font-bold">Lesson Complete!</h1>
//             <p className="mt-1 text-sm text-indigo-200">
//               Great work on finishing the lesson
//             </p>
//           </div>
//           <div className="mt-2 text-center">
//             <p className="text-4xl font-bold">
//               {score}
//               <span className="text-xl font-normal text-indigo-300">
//                 /{maxScore}
//               </span>
//             </p>
//             <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-white/20">
//               <div
//                 className="h-full rounded-full bg-white transition-all duration-700"
//                 style={{ width: `${progressPercent}%` }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Completion summary */}
//       <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
//         <p className="mb-4 text-sm font-semibold text-gray-800">
//           Completion Summary
//         </p>
//         <div className="flex flex-col gap-3">
//           {completionItems?.map((item: any) => (
//             <div
//               key={item.id}
//               className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
//             >
//               <FiCheckCircle
//                 size={18}
//                 className="flex-shrink-0 text-emerald-500"
//               />
//               <p className="text-sm font-medium text-gray-700">{item.label}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Teacher feedback */}
//       {teacherFeedbackPending && (
//         <p className="text-center text-sm text-gray-400">
//           Teacher feedback will appear here once reviewed.
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { GiTrophy } from "react-icons/gi";

export default function AssessmentStep({ data, onContinue, onStepComplete }: any) {
  const progressPercent = data.score && data.maxScore
    ? Math.round((data.score / data.maxScore) * 100)
    : 0;

  // Dynamically build completion items based on which steps exist in this space
  const completionItems = [
    data.quiz?.questions?.length > 0 && { id: "pre-quiz", label: "Pre-Quiz Completed" },
    data.introductionMessage            && { id: "orientation", label: "Introduction Reviewed" },
    data.hypothesisQuestion             && { id: "hypothesis", label: "Hypothesis Submitted" },
    data.simulationId                   && { id: "experiment", label: "Experiment Completed" },
    data.discussionPrompt               && { id: "discussion", label: "Reflection Posted" },
    (data.realWorldApplications?.length > 0 || data.realWorldTask) && { id: "real-world", label: "Real World Task Done" },
  ].filter(Boolean);

  const handleSubmit = () => {
    const payload = {
      stepId: data.id,
      completedAt: new Date().toISOString(),
    };
    onStepComplete(payload);
    onContinue(payload); // ✅ triggers doSubmit in parent since this is the last step
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Trophy banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 to-indigo-500 p-8 text-center text-white">
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <GiTrophy size={56} className="text-yellow-400 drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold">Lesson Complete!</h1>
            <p className="mt-1 text-sm text-indigo-200">
              Great work on finishing the lesson
            </p>
          </div>
          {data.score != null && (
            <div className="mt-2 text-center">
              <p className="text-4xl font-bold">
                {data.score}
                <span className="text-xl font-normal text-indigo-300">
                  /{data.maxScore}
                </span>
              </p>
              <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion summary */}
      {completionItems.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-800">
            Completion Summary
          </p>
          <div className="flex flex-col gap-3">
            {completionItems.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <FiCheckCircle size={18} className="flex-shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher feedback pending */}
      <p className="text-center text-sm text-gray-400">
        Teacher feedback will appear here once reviewed.
      </p>

      {/* Submit button — hidden if readOnly (already submitted) */}
      {!data.readOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Submit Learning Space <FiArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}