"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import {
  getLearningSpaceById,
  createSession,
  submitPoll,
  PollPayload,
} from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import {
  readStoredUserId,
  saveErrorMessage,
  withSession,
  type EnsureSession,
} from "./sessionHelpers";
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
  data: LessonStep & { title: string; subtitle: string; [key: string]: unknown };
  onContinue: (payload?: StepPayload) => void;
  onStepComplete: (payload: StepPayload) => void;
  sessionId?: string;
  ensureSession?: EnsureSession;
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

function PreQuizWrapper({
  data,
  onContinue,
  onStepComplete,
  sessionId,
  ensureSession,
}: any) {
  const [saving, setSaving] = useState(false);

  const normalizedQuiz = {
    title: data.quiz.quizTitle ?? "Pre-Quiz",
    duration: 10,
    questions: data.quiz.questions.map((q: any, index: number) => ({
      id: `q-${index}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? "",
    })),
  };

  const handleQuizComplete = async (results: QuizResults) => {
    onStepComplete({ stepId: data.id, quizResults: results });

    setSaving(true);
    try {
      const pollPayload: PollPayload = {
        quizTitle: results.quizTitle,
        timeSpentSeconds: results.timeSpent,
        answers: results.questionResults.map((q, i) => ({
          questionIndex: i,
          optionIndex: q.options.indexOf(q.userAnswer),
          isCorrect: q.isCorrect,
        })),
        score: results.score,
        correctAnswers: results.correctAnswers,
        totalQuestions: results.totalQuestions,
      };
      await withSession(sessionId, ensureSession, (id) =>
        submitPoll(id, pollPayload),
      );
    } catch (err) {
      toast.error(
        saveErrorMessage(err, "Failed to save quiz answers. You can still continue."),
      );
    } finally {
      setSaving(false);
    }

    onContinue({ stepId: data.id, quizResults: results });
  };

  if (saving) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-indigo-500">
        <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Saving quiz answers…
      </div>
    );
  }

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
  const { token, user } = useUser();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Held in refs as well as state so `ensureSession` can dedupe concurrent
  // callers without waiting for a re-render.
  const sessionIdRef = useRef<string | null>(null);
  const sessionPromiseRef = useRef<Promise<string | null> | null>(null);
  const hasResumedRef = useRef(false);

  // 1-based step the server last recorded for this student on this ILS.
  const [serverStep, setServerStep] = useState<number | null>(null);
  const [resumedFromStep, setResumedFromStep] = useState<number | null>(null);
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartNotice, setRestartNotice] = useState<string | null>(null);

  // Context can lag behind a page load, so fall back to the persisted user.
  const studentId = user?.userId ?? readStoredUserId();

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

  /**
   * Returns the session id, creating one if needed. Retries on a later step if
   * an earlier attempt failed, so one bad request no longer disables saving for
   * the rest of the lesson.
   */
  const ensureSession = useCallback(async (): Promise<string | null> => {
    if (sessionIdRef.current) return sessionIdRef.current;
    if (sessionPromiseRef.current) return sessionPromiseRef.current;

    const ilsId = lesson?.id ?? lessonId;
    if (!studentId || !ilsId) {
      console.error("Cannot start a learning session — missing ids", {
        studentId,
        ilsId,
      });
      return null;
    }

    const pending = createSession(studentId, ilsId)
      .then((session) => {
        sessionIdRef.current = session.id;
        setSessionId(session.id);
        setServerStep(session.step);
        return session.id;
      })
      .catch((err) => {
        console.error("Failed to start session:", err);
        sessionPromiseRef.current = null; // let the next step try again
        return null;
      });

    sessionPromiseRef.current = pending;
    return pending;
  }, [studentId, lesson?.id, lessonId]);

  useEffect(() => {
    setLesson(null);
    setCurrentStep(0);
    setFormData({});
    setSessionId(null);
    setServerStep(null);
    setResumedFromStep(null);
    sessionIdRef.current = null;
    sessionPromiseRef.current = null;
    hasResumedRef.current = false;
    fetchLesson();
  }, [lessonId, fetchLesson]);

  // The server tracks how far the student got, so a re-opened ILS picks up
  // where it left off instead of restarting at step 1.
  useEffect(() => {
    if (hasResumedRef.current || serverStep === null || !lesson) return;

    const lastIndex = lesson.steps.length - 1;
    const target = Math.min(Math.max(serverStep - 1, 0), Math.max(lastIndex, 0));
    hasResumedRef.current = true;

    if (target > 0) {
      setCurrentStep(target);
      setResumedFromStep(target);
    }
  }, [serverStep, lesson]);

  /**
   * Ask the server for a fresh attempt. If it hands back the same session the
   * previous attempt is still open — say so plainly rather than implying a
   * clean slate the student doesn't actually have.
   */
  const handleStartOver = useCallback(async () => {
    const previousId = sessionIdRef.current;

    setIsRestarting(true);
    setRestartNotice(null);
    // Stop the resume effect from jumping forward again on the new step value.
    hasResumedRef.current = true;
    sessionIdRef.current = null;
    sessionPromiseRef.current = null;

    const newId = await ensureSession();
    setIsRestarting(false);

    setCurrentStep(0);
    setFormData({});
    setResumedFromStep(null);

    if (!newId) {
      setRestartNotice(
        "Could not start a new attempt. Your answers may not be saved.",
      );
      return;
    }
    if (previousId && newId === previousId) {
      setRestartNotice(
        "Your previous attempt is still open, so this is a review of it — your recorded assessment score won't change.",
      );
    }
  }, [ensureSession]);

  // Open the session as soon as the lesson resolves. Runs on its own effect so
  // a late-arriving user id still triggers it.
  useEffect(() => {
    if (!lesson?.id) return;
    ensureSession().then((id) => {
      if (!id) {
        toast.warning(
          "Could not start a session — your progress may not be saved.",
        );
      }
    });
  }, [lesson?.id, ensureSession]);

  const activeSteps = lesson?.steps ?? [];

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
    () => {
      if (!lesson) return;
      const isLastStep = currentStep === activeSteps.length - 1;
      if (!isLastStep) {
        setCurrentStep((s) => s + 1);
      }
    },
    [lesson, activeSteps.length, currentStep],
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

      {resumedFromStep !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 bg-amber-50 px-5 py-2.5">
          <p className="text-xs text-amber-800">
            You&apos;ve attempted this learning space before — resuming at step{" "}
            {resumedFromStep + 1} of {activeSteps.length}.
          </p>
          <button
            onClick={handleStartOver}
            disabled={isRestarting}
            className="rounded-lg border border-amber-300 px-3 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
          >
            {isRestarting ? "Starting…" : "Start over"}
          </button>
        </div>
      )}

      {restartNotice && (
        <div className="border-b border-sky-100 bg-sky-50 px-5 py-2.5">
          <p className="text-xs text-sky-800">{restartNotice}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <StepComponent
          data={{
            ...stepData,
            stepNumber: currentStep + 1,
            totalSteps: activeSteps.length,
            title: lesson.title,
            subtitle: lesson.subtitle,
            ...(stepData.type === "assessment" && {
              postSimData: (formData["experiment"] as any)?.postSimAssessment ?? null,
            }),
          }}
          onContinue={handleContinue}
          onStepComplete={handleStepComplete}
          sessionId={sessionId ?? undefined}
          ensureSession={ensureSession}
        />
      </div>
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
