// "use client";

// import { useState, useEffect } from "react";
// import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
// import { MdOutlineExplore } from "react-icons/md";
// import { BsLightbulb, BsChatSquareText, BsGlobe, BsTrophy } from "react-icons/bs";
// import { FaFlask } from "react-icons/fa";

// import OrientationStep from "./OrientationStep";
// import HypothesisStep from "./HypothesisStep";
// import ExperimentStep from "./ExperimentStep";

// // Map step type → component
// const STEP_COMPONENTS = {
//   orientation: OrientationStep,
//   hypothesis:  HypothesisStep,
//   experiment:  ExperimentStep,
// };

// // Map step type → icon (for the progress bar)
// const STEP_ICONS = {
//   orientation: <MdOutlineExplore size={15} />,
//   hypothesis:  <BsLightbulb      size={15} />,
//   experiment:  <FaFlask          size={15} />,
//   discussion:  <BsChatSquareText size={15} />,
//   "real-world":<BsGlobe          size={15} />,
//   assessment:  <BsTrophy         size={15} />,
// };

// // ── Sub-components ────────────────────────────────────────────

// function Header({ title, subtitle, onBack }: any) {
//   return (
//     <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4 sticky top-0 z-10">
//       <button onClick={onBack} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100">
//         <FiArrowLeft size={18} />
//       </button>
//       <div>
//         <p className="text-sm font-semibold text-gray-800">{title}</p>
//         <p className="text-xs text-gray-400">{subtitle}</p>
//       </div>
//     </div>
//   );
// }

// function StepBar({ steps, currentIndex }: any) {
//   return (
//     <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-100 bg-white px-5 py-3">
//       {steps.map((step, i) => {
//         const done   = i < currentIndex;
//         const active = i === currentIndex;
//         return (
//           <div key={step.id} className="flex items-center gap-1">
//             <div className="flex flex-col items-center gap-1">
//               <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
//                 done   ? "bg-emerald-500 text-white" :
//                 active ? "bg-indigo-600 text-white"  :
//                          "bg-gray-100 text-gray-400"
//               }`}>
//                 {done ? <FiCheckCircle size={14} /> : STEP_ICONS[step.type]}
//               </div>
//               <span className={`whitespace-nowrap text-[10px] font-medium ${
//                 active ? "text-indigo-600" : done ? "text-emerald-500" : "text-gray-400"
//               }`}>
//                 {step.label}
//               </span>
//             </div>
//             {i < steps.length - 1 && (
//               <div className={`mb-4 h-px w-8 flex-shrink-0 ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────

// export default function LearningSpace({ lessonId }: any) {
//   const [lesson, setLesson]       = useState(null);
//   const [currentStep, setCurrentStep] = useState(0);

//   // Simulate an API fetch — swap this for a real fetch()/SWR/React Query call
//   useEffect(() => {
//     import("./lessonData.json").then((mod) => setLesson(mod.default));
//   }, [lessonId]);

//   if (!lesson) {
//     return (
//       <div className="flex h-screen items-center justify-center text-sm text-gray-400">
//         Loading lesson...
//       </div>
//     );
//   }

//   const steps      = lesson.steps;
//   const stepData   = steps[currentStep];
//   const StepView   = STEP_COMPONENTS[stepData.type];

//   const handleContinue = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
//   const handleBack     = () => setCurrentStep((s) => Math.max(s - 1, 0));

//   return (
//     <div className="mx-auto flex max-w-2xl flex-col bg-gray-50 min-h-screen">
//       <Header
//         title={lesson.title}
//         subtitle={lesson.subtitle}
//         onBack={handleBack}
//       />
//       <StepBar steps={steps} currentIndex={currentStep} />

//       {StepView ? (
//         <StepView
//           data={{ ...stepData, title: lesson.title, subtitle: lesson.subtitle }}
//           onContinue={handleContinue}
//         />
//       ) : (
//         <div className="flex flex-1 items-center justify-center p-10 text-sm text-gray-400">
//           This step is coming soon.
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { MdOutlineExplore } from "react-icons/md";
import { BsLightbulb, BsChatSquareText, BsGlobe, BsTrophy } from "react-icons/bs";
import { FaFlask } from "react-icons/fa";

import OrientationStep from "./OrientationStep";
import HypothesisStep from "./HypothesisStep";
import ExperimentStep from "./ExperimentStep";

// ── Types ─────────────────────────────────────────────────────

type StepType = "orientation" | "hypothesis" | "experiment" | "discussion" | "real-world" | "assessment";

interface LessonStep {
  id: string;
  type: StepType;
  label: string;
  stepNumber: number;
  totalSteps: number;
  [key: string]: unknown; // allows extra fields per step type
}

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: LessonStep[];
}

type StepComponentType = React.ComponentType<{ data: LessonStep & { title: string; subtitle: string }; onContinue: () => void }>;

// ── Step registry ─────────────────────────────────────────────

const STEP_COMPONENTS: Partial<Record<StepType, StepComponentType>> = {
  orientation: OrientationStep,
  hypothesis:  HypothesisStep,
  experiment:  ExperimentStep,
};

const STEP_ICONS: Record<StepType, React.ReactNode> = {
  orientation:  <MdOutlineExplore size={15} />,
  hypothesis:   <BsLightbulb      size={15} />,
  experiment:   <FaFlask          size={15} />,
  discussion:   <BsChatSquareText size={15} />,
  "real-world": <BsGlobe          size={15} />,
  assessment:   <BsTrophy         size={15} />,
};

// ── Sub-components ────────────────────────────────────────────

function Header({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
      <button onClick={onBack} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100">
        <FiArrowLeft size={18} />
      </button>
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function StepBar({ steps, currentIndex }: { steps: LessonStep[]; currentIndex: number }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-100 bg-white px-5 py-3">
      {steps.map((step, i) => {
        const done   = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                done   ? "bg-emerald-500 text-white" :
                active ? "bg-indigo-600 text-white"  :
                         "bg-gray-100 text-gray-400"
              }`}>
                {done ? <FiCheckCircle size={14} /> : STEP_ICONS[step.type]}
              </div>
              <span className={`whitespace-nowrap text-[10px] font-medium ${
                active ? "text-indigo-600" : done ? "text-emerald-500" : "text-gray-400"
              }`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mb-4 h-px w-8 flex-shrink-0 ${done ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function LearningSpace({ lessonId }: { lessonId?: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate an API fetch — swap for a real fetch()/SWR/React Query call
  useEffect(() => {
    import("./lessonData.json").then((mod) => setLesson(mod.default as Lesson));
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        Loading lesson...
      </div>
    );
  }

  const steps    = lesson.steps;
  const stepData = steps[currentStep];
  const StepView = STEP_COMPONENTS[stepData.type];

  const handleContinue = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack     = () => setCurrentStep((s) => Math.max(s - 1, 0));

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col bg-gray-50">
      <Header title={lesson.title} subtitle={lesson.subtitle} onBack={handleBack} />
      <StepBar steps={steps} currentIndex={currentStep} />

      {StepView ? (
        <StepView
          data={{ ...stepData, title: lesson.title, subtitle: lesson.subtitle }}
          onContinue={handleContinue}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center p-10 text-sm text-gray-400">
          This step is coming soon.
        </div>
      )}
    </div>
  );
}