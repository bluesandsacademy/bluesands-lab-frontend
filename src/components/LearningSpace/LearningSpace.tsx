"use client";

import { useState, useEffect, useCallback } from "react";
import { FiArrowLeft, FiCheckCircle, FiX } from "react-icons/fi";
import { MdOutlineExplore } from "react-icons/md";
import {
  BsLightbulb,
  BsChatSquareText,
  BsGlobe,
  BsTrophy,
} from "react-icons/bs";
import { FaFlask } from "react-icons/fa";
import { HiOutlineClipboardCheck } from "react-icons/hi";

import OrientationStep from "./OrientationStep";
import HypothesisStep from "./HypothesisStep";
import ExperimentStep from "./ExperimentStep";
import DiscussionStep from "./DiscussionStep";
import RealWorldStep from "./RealworldStep";
import AssessmentStep from "./AssessmentStep";
import { QuizResults, QuizSessionEmbedded } from "./QuizCore";
import { getLearningSpaceById, submitLearningSpace } from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { toast } from "react-toastify";

// ── Types ─────────────────────────────────────────────────────

type StepType =
  | "pre-quiz"
  | "orientation"
  | "hypothesis"
  | "experiment"
  | "discussion"
  | "real-world"
  | "assessment";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizData {
  quizTitle: string;
  description: string;
  points: string;
  questions: QuizQuestion[];
}

/** Shape returned by the API (teacher's saved FormData) */
interface ApiLearningSpace {
  id: string;
  title: string;
  objective: string;
  score: string;
  duration: string;
  simulationId: string;
  preSimAssessment: QuizData;
  postSimAssessment: QuizData;
  tags: string[];
  introductionMessage: string;
  engagementQuestion: string;
  hypothesisQuestion: string;
  experimentProcedures: string[];
  discussionPrompt: string;
  realWorldApplications: string[];
  relatedCareers: string[];
  realWorldTask: string;
}

interface LessonStep {
  id: string;
  type: StepType;
  label: string;
  optional?: boolean;
  enabled?: boolean;
  [key: string]: unknown;
}

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: LessonStep[];
}

type StepPayload = Record<string, unknown>;
type FormData = Record<string, StepPayload>;

type StepComponentType = React.ComponentType<{
  data: LessonStep & { title: string; subtitle: string };
  onContinue: () => void;
  onStepComplete: (payload: StepPayload) => void;
}>;

// ── API → Steps mapper ────────────────────────────────────────
/**
 * Converts the flat API response into an ordered array of LessonSteps.
 * Each step only appears if its key data is non-empty/truthy.
 */
function mapApiToSteps(api: ApiLearningSpace): LessonStep[] {
  const steps: LessonStep[] = [];

  // 1. Pre-Sim Assessment (optional – only if questions exist)
  // if (api.preSimAssessment?.questions?.length > 0) {
  if (
    api.preSimAssessment?.quizTitle?.trim() !== "" &&
    api.preSimAssessment?.questions?.some((q) => q.question.trim() !== "")
  ) {
    steps.push({
      id: "pre-quiz",
      type: "pre-quiz",
      label: "Pre-Quiz",
      quiz: api.preSimAssessment,
    });
  }

  // 2. Orientation / Introduction
  if (api.introductionMessage || api.engagementQuestion || api.objective) {
    steps.push({
      id: "orientation",
      type: "orientation",
      label: "Introduction",
      introductionMessage: api.introductionMessage,
      engagementQuestion: api.engagementQuestion,
      objective: api.objective,
    });
  }

  // 3. Hypothesis
  if (api.hypothesisQuestion) {
    steps.push({
      id: "hypothesis",
      type: "hypothesis",
      label: "Hypothesis",
      hypothesisQuestion: api.hypothesisQuestion,
    });
  }

  // 4. Experiment / Simulation
  if (api.simulationId || api.experimentProcedures?.length > 0) {
    steps.push({
      id: "experiment",
      type: "experiment",
      label: "Experiment",
      simulationId: api.simulationId,
      experimentProcedures: api.experimentProcedures ?? [],
      discussionPrompt: api.discussionPrompt,
      postSimAssessment: api.postSimAssessment,
    });
  }

  // 5. Discussion
  if (api.discussionPrompt) {
    steps.push({
      id: "discussion",
      type: "discussion",
      label: "Discussion",
      discussionPrompt: api.discussionPrompt,
    });
  }

  // 6. Real-World Application
  if (
    api.realWorldApplications?.length > 0 ||
    api.relatedCareers?.length > 0 ||
    api.realWorldTask
  ) {
    steps.push({
      id: "real-world",
      type: "real-world",
      label: "Real World",
      realWorldApplications: api.realWorldApplications ?? [],
      relatedCareers: api.relatedCareers ?? [],
      realWorldTask: api.realWorldTask,
    });
  }

  // 7. Post-Sim Assessment (optional – only if questions exist)
  if (api.postSimAssessment?.questions?.length > 0) {
    steps.push({
      id: "assessment",
      type: "assessment",
      label: "Assessment",
      quiz: api.postSimAssessment,
    });
  }

  return steps;
}

// ── Step registry ─────────────────────────────────────────────

function PreQuizWrapper({ data, onContinue, onStepComplete }: any) {
  // Normalize API questions to include id and default missing fields
  const normalizedQuiz = {
    title: data.quiz.quizTitle ?? "Pre-Quiz",
    duration: 10, // default duration in minutes
    questions: data.quiz.questions.map((q: any, index: number) => ({
      id: `q-${index}`,           // generates stable id from index
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? "",
    })),
  };

  const handleQuizComplete = (results: QuizResults) => {
    onStepComplete({ stepId: data.id, quizResults: results });
    onContinue({ stepId: data.id, quizResults: results }); // ✅ pass payload to onContinue too
  };

  return (
    <QuizSessionEmbedded quiz={normalizedQuiz} onComplete={handleQuizComplete} />
  );
}

const STEP_COMPONENTS: Record<StepType, StepComponentType> = {
  "pre-quiz": PreQuizWrapper,
  orientation: OrientationStep,
  hypothesis: HypothesisStep,
  experiment: ExperimentStep,
  discussion: DiscussionStep,
  "real-world": RealWorldStep,
  assessment: AssessmentStep,
};

const STEP_ICONS: Record<StepType, React.ReactNode> = {
  "pre-quiz": <HiOutlineClipboardCheck size={15} />,
  orientation: <MdOutlineExplore size={15} />,
  hypothesis: <BsLightbulb size={15} />,
  experiment: <FaFlask size={15} />,
  discussion: <BsChatSquareText size={15} />,
  "real-world": <BsGlobe size={15} />,
  assessment: <BsTrophy size={15} />,
};

// ── Sub-components ────────────────────────────────────────────

function Header({
  title,
  subtitle,
  onBack,
  onClose,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-4">
      <button
        onClick={onBack}
        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
      >
        <FiArrowLeft size={18} />
      </button>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}

function StepBar({
  steps,
  currentIndex,
}: {
  steps: LessonStep[];
  currentIndex: number;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-100 bg-white px-5 py-3">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.id} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <FiCheckCircle size={14} /> : STEP_ICONS[step.type]}
              </div>
              <span
                className={`whitespace-nowrap text-[10px] font-medium ${
                  active
                    ? "text-indigo-600"
                    : done
                      ? "text-emerald-500"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mb-4 h-px w-8 flex-shrink-0 ${done ? "bg-emerald-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Form submission ───────────────────────────────────────────
// const {token} = useUser();

// async function handleSubmitLearningSpace(
//    lessonId: string,
//   formData: FormData,
// ){
//   const response = await submitLearningSpace(lessonId, formData, token);
// }

// ── Shared lesson content ─────────────────────────────────────

function LessonContent({
  lessonId,
  onClose,
}: {
  lessonId?: string;
  onClose?: () => void;
}) {
  const { token } = useUser(); // ✅ inside component
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLesson = useCallback(async () => {
    if (!lessonId) return;
    setFetchError(null);
    setLoading(true);
    try {
      const data: ApiLearningSpace = await getLearningSpaceById(lessonId, token);
      const steps = mapApiToSteps(data);
      setLesson({
        id: data.id,
        title: data.title,
        subtitle: data.objective ?? "",
        steps,
      });
    } catch (err) {
      console.error("Failed to load learning space:", err);
      setFetchError("Failed to load this learning space. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [lessonId, token]);

  useEffect(() => {
    setLesson(null);
    setCurrentStep(0);
    setFormData({});
    fetchLesson();
  }, [lessonId]);

  const activeSteps = lesson?.steps ?? [];

  //  Accept the last step's payload directly so we don't rely on stale formData state
  const doSubmit = useCallback(
    async (finalFormData: FormData) => {
      if (!lesson) return;
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await submitLearningSpace(lessonId ?? lesson.id, finalFormData, token);
        toast.success("Learning space submitted!");
      } catch (err: any) {
        setSubmitError(err.message ?? "Submission failed.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [lesson, lessonId, token],
  );

  const handleStepComplete = useCallback(
    (payload: StepPayload) => {
      setFormData((prev) => ({
        ...prev,
        [String(payload.stepId ?? currentStep)]: payload,
      }));
    },
    [currentStep],
  );

  const handleContinue = useCallback(
    (lastPayload?: StepPayload) => {
      if (!lesson) return;
      const isLastStep = currentStep === activeSteps.length - 1;

      if (isLastStep) {
        // Merge the final payload immediately — don't wait for setFormData to flush
        const finalFormData: FormData = lastPayload
          ? {
              ...formData,
              [String(lastPayload.stepId ?? currentStep)]: lastPayload,
            }
          : formData;
        doSubmit(finalFormData);
      } else {
        setCurrentStep((s) => s + 1);
      }
    },
    [lesson, activeSteps.length, currentStep, formData, doSubmit],
  );

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

//   // ── Render states ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Loading lesson…
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-rose-500">
        <p>{fetchError}</p>
        <button
          className="rounded-md bg-rose-50 px-4 py-2 text-rose-600 hover:bg-rose-100"
          onClick={fetchLesson}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!lesson) return null;

  if (activeSteps.length === 0) {
    return (
      <div className="flex h-full flex-col bg-gray-50">
        <Header
          title={lesson.title}
          subtitle={lesson.subtitle}
          onBack={handleBack}
          onClose={onClose}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm text-gray-400">
          <p className="font-medium text-gray-600">{lesson.title}</p>
          <p>{lesson.subtitle}</p>
          <p className="mt-4 text-xs">
            No content has been configured for this space yet.
          </p>
        </div>
      </div>
    );
  }


  // const stepData = activeSteps[currentStep];
  // const StepView = STEP_COMPONENTS[stepData.type];

    // Guard: clamp currentStep in case it's ever out of bounds
  const safeStep = Math.min(currentStep, activeSteps.length - 1);
  const stepData = activeSteps[safeStep];

  // Guard: unknown step type should never crash the app
   const StepView = stepData ? STEP_COMPONENTS[stepData.type] : null;

     if (!stepData || !StepView) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        Step not found.
      </div>
    );
  }

  // TypeScript knows StepView is non-null past this point,
  // but this assertion makes it explicit for the JSX renderer
  const StepComponent = StepView as StepComponentType;

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header
        title={lesson.title}
        subtitle={lesson.subtitle}
        onBack={handleBack}
        onClose={onClose}
      />
      <StepBar steps={activeSteps} currentIndex={currentStep} />

      <div className="flex-1 overflow-y-auto">
        <StepComponent
          data={{
            ...stepData,
            stepNumber: currentStep + 1,
            totalSteps: activeSteps.length,
            title: lesson.title,
            subtitle: lesson.subtitle,
          }}
          onContinue={handleContinue}
          onStepComplete={handleStepComplete}
        />
      </div>

      {isSubmitting && (
        <div className="border-t border-gray-100 bg-white px-5 py-3 text-center text-sm text-indigo-500">
          Submitting your work…
        </div>
      )}
      {submitError && (
        <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-center text-sm text-rose-600">
          {submitError} —{" "}
          <button className="underline" onClick={() => doSubmit(formData)}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
// ── Popup wrapper ─────────────────────────────────────────────

function LearningSpacePopup({
  lessonId,
  onClose,
}: {
  lessonId?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl shadow-2xl">
        <LessonContent lessonId={lessonId} onClose={onClose} />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────

export default function LearningSpace({
  lessonId,
  popup = false,
  onClose,
}: {
  lessonId?: string;
  popup?: boolean;
  onClose?: () => void;
}) {
  if (popup) {
    if (!onClose)
      throw new Error(
        "LearningSpace: `onClose` is required when using `popup` mode.",
      );
    return <LearningSpacePopup lessonId={lessonId} onClose={onClose} />;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <LessonContent lessonId={lessonId} />
    </div>
  );
}
