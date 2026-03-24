import {
  getPhetSimulations,
  getPhetSimulationsById,
} from "@/services/dashboard-service";
import {
  addLearningSpace,
  publishLearningSpace,
  updateLearningSpace,
} from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useState, KeyboardEvent, useEffect, useRef, useCallback } from "react";
import {
  FaSpinner,
  FaFlask,
  FaAtom,
  FaCalculator,
  FaDna,
  FaCheck,
  FaTimes,
  FaPlus,
  FaPaperPlane,
  FaSave,
  FaTrash,
  FaChevronRight,
  FaChevronLeft,
  FaToggleOn,
  FaToggleOff,
  FaBook,
  FaExternalLinkAlt,
  FaFilePdf,
  FaChalkboardTeacher,
  FaEye,
  FaArrowLeft,
  FaLightbulb,
  FaInfoCircle,
  FaGraduationCap,
  FaRocket,
  FaShieldAlt,
  FaCloud,
} from "react-icons/fa";
import { toast } from "react-toastify";

// ─── Types ────────────────────────────────────────────────────────────────────

type SimulationTool = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizData = {
  quizTitle: string;
  description: string;
  points: string;
  questions: QuizQuestion[];
};

type FormData = {
  title: string;
  objective: string;
  score: string;
  duration: number;
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
};

interface ExperimentResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  topic: string;
  description: string;
  learningGoals: string;
  lowGradeLevel: string;
  mainTopics: string;
  physics: boolean;
  chemistry: boolean;
  biology: boolean;
  math: boolean;
  earthSpace: boolean;
  keywords: string;
}

interface PhetSimulationDetail {
  id: string;
  title: string;
  type: string;
  numberOfScreens: number;
  screenNames: string;
  simPage: string;
  simString: string;
  teacherTipsDoc: string;
  pdfUrl: string;
  physics: boolean;
  mathStatistics: boolean;
  chemistry: boolean;
  earthSpace: boolean;
  biology: boolean;
  lowGradeLevel: string;
  highGradeLevel: string;
  mainTopics: string;
  keywords: string;
  description: string;
  sampleLearningGoals: string;
  translations: string;
  published: string;
  runnableResource: string;
  cheerpJRunnable: string;
  filename: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIMULATION_SUBJECT: SimulationTool[] = [
  {
    id: "physics",
    label: "Physics Lab",
    description:
      "Interactive physics experiments with forces, motions and energy",
    icon: <FaFlask className="w-5 h-5" />,
  },
  {
    id: "chemistry",
    label: "Chemistry Lab",
    description: "Virtual chemistry experiments and molecular visualization",
    icon: <FaAtom className="w-5 h-5" />,
  },
  {
    id: "mathStatistics",
    label: "Math Simulator",
    description: "Visual math tools for algebra, geometry and calculus",
    icon: <FaCalculator className="w-5 h-5" />,
  },
  {
    id: "biology",
    label: "Biology Lab",
    description: "Cell structures ecosystems and life science simulations",
    icon: <FaDna className="w-5 h-5" />,
  },
];

const DURATION_OPTIONS = {
  "15 minutes": 0.25,
  "30 minutes": 0.5,
  "45 minutes": 0.75,
  "1 hour": 1,
  "1.5 hours": 1.5,
  "2 hours": 2,
  "2.5 hours": 2.5,
  "3 hours": 3,
};

const EMPTY_QUIZ: QuizData = {
  quizTitle: "",
  description: "",
  points: "",
  questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
};

// ─── Guide Steps ──────────────────────────────────────────────────────────────

const GUIDE_STEPS = [
  {
    icon: <FaLightbulb className="w-8 h-8" />,
    title: "What is an Interactive Learning Space?",
    description:
      "An Interactive Learning Space (ILS) combines PhET simulations with structured assessments, guiding students through a full inquiry-based learning cycle — from hypothesis to reflection.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    icon: <FaGraduationCap className="w-8 h-8" />,
    title: "4-Step Setup Process",
    description:
      "You'll configure your ILS in 4 steps: (1) Basic Setup — title, duration, and simulation. (2) Pre-Quiz — assess prior knowledge. (3) Orientation — structure the experiment. (4) Post-Quiz — evaluate learning outcomes.",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    icon: <FaShieldAlt className="w-8 h-8" />,
    title: "Your Work is Always Safe",
    description:
      "Auto-save kicks in every 30 seconds so you never lose progress. You can also manually save a draft at any time and return later to publish when you're ready.",
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50 border-green-200",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    icon: <FaRocket className="w-8 h-8" />,
    title: "Ready to Build?",
    description:
      "Once published, students can access the learning space from their dashboard. You can preview the simulation and review learning resources at any time during setup.",
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
  },
];

// ─── Step Tracker ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Setup" },
  { label: "Pre-Quiz" },
  { label: "Orientation" },
  { label: "Post-Quiz" },
];

type StepTrackerProps = { currentStep: number };

const StepTracker = ({ currentStep }: StepTrackerProps) => (
  <div className="flex items-center justify-between w-full max-w-sm sm:max-w-md mx-auto mb-6 select-none px-2">
    {STEPS.map((step, index) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;

      return (
        <div key={step.label} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${
                  isCompleted
                    ? "bg-green-500 text-white shadow-md shadow-green-200"
                    : isActive
                      ? "bg-blue-950 text-white shadow-md shadow-blue-200 ring-2 ring-blue-300 ring-offset-2"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
            >
              {isCompleted ? <FaCheck className="w-3 h-3" /> : index + 1}
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase transition-colors duration-200
                ${isCompleted ? "text-green-500" : isActive ? "text-blue-950" : "text-gray-400"}`}
            >
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1.5 sm:mx-2 mb-4 rounded-full transition-all duration-500
                ${index < currentStep ? "bg-green-400" : "bg-gray-200"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Auto-save Badge ──────────────────────────────────────────────────────────

type AutoSaveBadgeProps = { status: "idle" | "saving" | "saved" | "error" };

const AutoSaveBadge = ({ status }: AutoSaveBadgeProps) => {
  const config = {
    idle: {
      label: "Auto-save on",
      icon: <FaCloud className="w-3 h-3" />,
      cls: "text-gray-400 bg-gray-50 border-gray-200",
    },
    saving: {
      label: "Saving…",
      icon: <FaSpinner className="w-3 h-3 animate-spin" />,
      cls: "text-blue-600 bg-blue-50 border-blue-200",
    },
    saved: {
      label: "Saved",
      icon: <FaCheck className="w-3 h-3" />,
      cls: "text-green-600 bg-green-50 border-green-200",
    },
    error: {
      label: "Save failed",
      icon: <FaTimes className="w-3 h-3" />,
      cls: "text-red-500 bg-red-50 border-red-200",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all duration-300 ${config.cls}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// ─── Quiz Editor ──────────────────────────────────────────────────────────────

type QuizEditorProps = {
  label: string;
  data: QuizData;
  onChange: (data: QuizData) => void;
};

const QuizEditor = ({ label, data, onChange }: QuizEditorProps) => {
  const handleField = (
    field: keyof Omit<QuizData, "questions">,
    value: string,
  ) => {
    onChange({ ...data, [field]: value });
  };

  const handleQuestionChange = (
    index: number,
    field: "question" | "correctAnswer",
    value: string,
  ) => {
    const updated = [...data.questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, questions: updated });
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string,
  ) => {
    const updated = [...data.questions];
    const opts = [...updated[qIndex].options];
    opts[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: opts };
    onChange({ ...data, questions: updated });
  };

  const addQuestion = () => {
    onChange({
      ...data,
      questions: [
        ...data.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (data.questions.length > 1) {
      onChange({
        ...data,
        questions: data.questions.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-1">
        <span className="w-2 h-2 rounded-full bg-blue-950 animate-pulse" />
        <span className="text-xs font-semibold text-blue-950 uppercase tracking-wider">
          {label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.quizTitle}
            onChange={(e) => handleField("quizTitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="Enter quiz title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Points
          </label>
          <input
            type="number"
            value={data.points}
            onChange={(e) => handleField("points", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="e.g. 100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => handleField("description", e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
          placeholder="Brief description of the quiz"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Questions</h3>
        {data.questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="mb-5 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Question {qIndex + 1}
              </span>
              {data.questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                >
                  <FaTrash className="h-3 w-3" /> Remove
                </button>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Question Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={question.question}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "question", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                placeholder="Enter your question"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 w-5">
                      {String.fromCharCode(65 + optIndex)}.
                    </span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(qIndex, optIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Correct Answer <span className="text-red-500">*</span>
              </label>
              <select
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
              >
                <option value="">Select correct answer</option>
                {question.options.map((option, optIndex) => (
                  <option key={optIndex} value={option}>
                    {String.fromCharCode(65 + optIndex)}.{" "}
                    {option || `Option ${String.fromCharCode(65 + optIndex)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-950 border border-dashed border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
        >
          <FaPlus className="h-3 w-3" /> Add Question
        </button>
      </div>
    </div>
  );
};

// ─── Simulation Preview Modal ─────────────────────────────────────────────────

type SimPreviewModalProps = {
  sim: PhetSimulationDetail | null;
  onClose: () => void;
};

const SimPreviewModal = ({ sim, onClose }: SimPreviewModalProps) => {
  if (!sim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-950 to-blue-800 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white">{sim.title}</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Grades {sim.lowGradeLevel}–{sim.highGradeLevel} · {sim.mainTopics}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          {sim.description && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {sim.description}
              </p>
            </div>
          )}

          {/* Learning Goals */}
          {sim.sampleLearningGoals && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaGraduationCap className="w-3.5 h-3.5" /> Sample Learning
                Goals
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                {sim.sampleLearningGoals}
              </p>
            </div>
          )}

          {/* Keywords */}
          {sim.keywords && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {sim.keywords.split(",").map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                  >
                    {kw.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Runnable preview */}
          {sim.runnableResource && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">
                  Live Preview
                </span>
                <a
                  href={sim.runnableResource}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  Open in new tab <FaExternalLinkAlt className="w-2.5 h-2.5" />
                </a>
              </div>
              <iframe
                src={sim.runnableResource}
                title={sim.title}
                className="w-full h-72 border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Learning Resources Panel ─────────────────────────────────────────────────

type ResourcesPanelProps = {
  sim: PhetSimulationDetail | null;
  isLoading: boolean;
};

const ResourcesPanel = ({ sim, isLoading }: ResourcesPanelProps) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FaBook className="w-4 h-4 text-blue-700" /> Learning Resources
        </h3>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!sim) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-5 text-center">
        <FaBook className="w-6 h-6 text-gray-300 mx-auto mb-2" />
        <p className="text-xs text-gray-400 font-medium">
          Select a simulation to see resources
        </p>
      </div>
    );
  }

  const resources = [
    sim.teacherTipsDoc && {
      label: "Teacher Tips",
      // href: sim.teacherTipsDoc,
      icon: <FaChalkboardTeacher className="w-3.5 h-3.5" />,
      color: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    sim.pdfUrl && {
      label: "PDF Guide",
      // href: sim.pdfUrl,
      icon: <FaFilePdf className="w-3.5 h-3.5" />,
      color: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
    },
    sim.simPage && {
      label: "Simulation Page",
      href: sim.simPage,
      icon: <FaExternalLinkAlt className="w-3.5 h-3.5" />,
      color: "text-green-700 bg-green-50 border-green-200 hover:bg-green-100",
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: React.ReactNode;
    color: string;
  }[];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-950 to-blue-800">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <FaBook className="w-3.5 h-3.5" /> Learning Resources
        </h3>
        <p className="text-xs text-blue-200 mt-0.5">{sim.title}</p>
      </div>

      <div className="p-4 space-y-3">
        {/* Grade Level */}
        {(sim.lowGradeLevel || sim.highGradeLevel) && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <FaGraduationCap className="w-3.5 h-3.5 text-gray-400" />
            <span>
              Grades <strong>{sim.lowGradeLevel}</strong>
              {sim.highGradeLevel && sim.highGradeLevel !== sim.lowGradeLevel
                ? `–${sim.highGradeLevel}`
                : ""}
            </span>
          </div>
        )}

        {/* Topics */}
        {sim.mainTopics && (
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <FaInfoCircle className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{sim.mainTopics}</span>
          </div>
        )}

        {/* Screens */}
        {sim.numberOfScreens > 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <span className="font-semibold">{sim.numberOfScreens}</span> screen
            {sim.numberOfScreens !== 1 ? "s" : ""}
            {sim.screenNames ? `: ${sim.screenNames}` : ""}
          </div>
        )}

        {/* Resource links */}
        {resources.length > 0 && (
          <div className="border-t pt-3 space-y-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Available Resources
            </p>
            {resources.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${r.color}`}
              >
                {r.icon}
                {r.label}
                <FaExternalLinkAlt className="w-2.5 h-2.5 ml-auto opacity-60" />
              </a>
            ))}
          </div>
        )}

        {/* Sample learning goals */}
        {sim.sampleLearningGoals && (
          <div className="border-t pt-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Learning Goals
            </p>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
              {sim.sampleLearningGoals}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Onboarding Guide ─────────────────────────────────────────────────────────

type OnboardingGuideProps = {
  onStart: () => void;
};

const OnboardingGuide = ({ onStart }: OnboardingGuideProps) => {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-950 text-white text-xs font-semibold rounded-full mb-5 tracking-wide uppercase">
            <FaFlask className="w-3.5 h-3.5" />
            Interactive Learning Space
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Before you start building
          </h1>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            Here's a quick overview of what you'll configure and how the process
            works.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
          {GUIDE_STEPS.map((step, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveCard(i)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                activeCard === i
                  ? `${step.bg} border-current shadow-sm scale-[1.01]`
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${activeCard === i ? step.iconBg : "bg-gray-100 text-gray-400"}`}
              >
                {step.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="px-8 py-3.5 bg-blue-950 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 active:scale-95 transition-all duration-150 flex items-center gap-2.5 shadow-lg shadow-blue-900/20"
          >
            <FaRocket className="w-4 h-4" />
            Start Building
            <FaChevronRight className="w-3 h-3" />
          </button>
          <p className="text-xs text-gray-400">
            Takes about 10–15 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: "purple" | "orange" | "green" | "blue" | "red";
  children: React.ReactNode;
};

const colorMap = {
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-500",
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-500",
};

const Section = ({ icon, title, subtitle, color, children }: SectionProps) => (
  <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-white">
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
);

// ─── Icons ────────────────────────────────────────────────────────────────────

const BookIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const GradeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
  </svg>
);

const LabIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

// ─── Main Page Component ──────────────────────────────────────────────────────

type CreateLearningSpacePageProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const CreateLearningSpacePage = ({
  onSuccess,
  onCancel,
}: CreateLearningSpacePageProps) => {
  const { user, token } = useUser();

  // ── Phase: guide → form ────────────────────────────────────────────────────
  const [phase, setPhase] = useState<"guide" | "form">("guide");

  // ── Step ──────────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);

  // ── Loading states ─────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [draftId, setDraftId] = useState<string | null>(null);

  // ── Experiment state ───────────────────────────────────────────────────────
  const [simListLoading, setSimListLoading] = useState(false);
  const [simDetailLoading, setSimDetailLoading] = useState(false);
  const [experimentData, setExperimentData] = useState<ExperimentResponse[]>(
    [],
  );
  const [selectedSimDetail, setSelectedSimDetail] =
    useState<PhetSimulationDetail | null>(null);
  const [previewSim, setPreviewSim] = useState<PhetSimulationDetail | null>(
    null,
  );
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [fetchFilters, setFetchFilters] = useState({
    physics: "",
    chemistry: "",
    biology: "",
    math: "",
    earthSpace: "",
    gradeLevel: "",
    search: "",
  });

  // ── Array input states ─────────────────────────────────────────────────────
  const [tagInput, setTagInput] = useState("");
  const [realWorldInput, setRealWorldInput] = useState("");
  const [careersInput, setCareersInput] = useState("");
  const [proceduresInput, setProceduresInput] = useState("");

  // ── Pre-quiz toggle ────────────────────────────────────────────────────────
  const [includePreQuiz, setIncludePreQuiz] = useState(true);

  // ── Scroll ref: scroll-to-top on step change ───────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Form ──────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<FormData>({
    title: "",
    objective: "",
    score: "",
    duration: 0,
    simulationId: "",
    preSimAssessment: { ...EMPTY_QUIZ },
    postSimAssessment: { ...EMPTY_QUIZ },
    tags: [],
    introductionMessage: "",
    engagementQuestion: "",
    hypothesisQuestion: "",
    experimentProcedures: [],
    discussionPrompt: "",
    realWorldApplications: [],
    relatedCareers: [],
    realWorldTask: "",
  });

  // ── Auto-save ref (holds latest formData + draftId for the interval) ───────
  const autoSaveRef = useRef({ formData, draftId, token });
  useEffect(() => {
    autoSaveRef.current = { formData, draftId, token };
  }, [formData, draftId, token]);

  // ── Fetch simulation list ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "form") return;
    async function fetchExperiments() {
      setSimListLoading(true);
      try {
        const data = await getPhetSimulations(token, fetchFilters);
        setExperimentData(data.items || []);
      } catch (err) {
        console.error("Error fetching experiments:", err);
      } finally {
        setSimListLoading(false);
      }
    }
    fetchExperiments();
  }, [token, fetchFilters, phase]);

  // ── Fetch sim detail when simulationId changes ────────────────────────────
  useEffect(() => {
    if (!formData.simulationId) {
      setSelectedSimDetail(null);
      return;
    }
    async function fetchDetail() {
      setSimDetailLoading(true);
      try {
        const detail = await getPhetSimulationsById(
          formData.simulationId,
          token,
        );
        setSelectedSimDetail(detail);
      } catch (err) {
        console.error("Error fetching simulation detail:", err);
      } finally {
        setSimDetailLoading(false);
      }
    }
    fetchDetail();
  }, [formData.simulationId, token]);

  // ── Scroll to top when step changes ───────────────────────────────────────
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  // ── Auto-save every 30 seconds (only when in form phase, has a title) ─────
  useEffect(() => {
    if (phase !== "form") return;

    const interval = setInterval(async () => {
      const { formData: fd, draftId: did, token: tok } = autoSaveRef.current;
      if (!fd.title.trim()) return; // nothing worth saving yet

      setAutoSaveStatus("saving");
      try {
        if (did) {
          await updateLearningSpace(fd, did, tok);
        } else {
          const res = await addLearningSpace(fd, tok);
          setDraftId(res.id);
        }
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus("idle"), 3000);
      } catch {
        setAutoSaveStatus("error");
        setTimeout(() => setAutoSaveStatus("idle"), 4000);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [phase]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCourseFilterChange = (subjectId: string) => {
    setActiveSubject(subjectId);
    setFetchFilters({
      ...fetchFilters,
      physics: subjectId === "physics" ? "true" : "",
      chemistry: subjectId === "chemistry" ? "true" : "",
      biology: subjectId === "biology" ? "true" : "",
      math: subjectId === "mathStatistics" ? "true" : "",
      earthSpace: subjectId === "earthSpace" ? "true" : "",
    });
  };

  // ── Tags ──────────────────────────────────────────────────────────────────

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setTagInput("");
    }
  };
  const handleRemoveTag = (tag: string) =>
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });

  // ── Real-World Applications ───────────────────────────────────────────────

  const handleRwaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && realWorldInput.trim()) {
      e.preventDefault();
      handleAddRwa();
    }
  };
  const handleAddRwa = () => {
    const v = realWorldInput.trim();
    if (v && !formData.realWorldApplications.includes(v)) {
      setFormData({
        ...formData,
        realWorldApplications: [...formData.realWorldApplications, v],
      });
      setRealWorldInput("");
    }
  };
  const handleRemoveRwa = (rwa: string) =>
    setFormData({
      ...formData,
      realWorldApplications: formData.realWorldApplications.filter(
        (r) => r !== rwa,
      ),
    });

  // ── Related Careers ───────────────────────────────────────────────────────

  const handleCareerKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && careersInput.trim()) {
      e.preventDefault();
      handleAddCareer();
    }
  };
  const handleAddCareer = () => {
    const v = careersInput.trim();
    if (v && !formData.relatedCareers.includes(v)) {
      setFormData({
        ...formData,
        relatedCareers: [...formData.relatedCareers, v],
      });
      setCareersInput("");
    }
  };
  const handleRemoveCareer = (career: string) =>
    setFormData({
      ...formData,
      relatedCareers: formData.relatedCareers.filter((c) => c !== career),
    });

  // ── Experiment Procedures ─────────────────────────────────────────────────

  const handleProceduresKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && proceduresInput.trim()) {
      e.preventDefault();
      handleAddProcedure();
    }
  };
  const handleAddProcedure = () => {
    const v = proceduresInput.trim();
    if (v && !formData.experimentProcedures.includes(v)) {
      setFormData({
        ...formData,
        experimentProcedures: [...formData.experimentProcedures, v],
      });
      setProceduresInput("");
    }
  };
  const handleRemoveProcedure = (procedure: string) =>
    setFormData({
      ...formData,
      experimentProcedures: formData.experimentProcedures.filter(
        (p) => p !== procedure,
      ),
    });

  // ── Validation ────────────────────────────────────────────────────────────

  const validateSetup = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return false;
    }
    if (!formData.objective.trim()) {
      toast.error("Please enter a learning objective");
      return false;
    }
    if (!formData.duration) {
      toast.error("Please select a duration");
      return false;
    }
    return true;
  };

  const validateQuiz = (quiz: QuizData, label: string) => {
    if (!quiz.quizTitle.trim()) {
      toast.error(`${label}: Please enter a quiz title`);
      return false;
    }
    if (!quiz.description.trim()) {
      toast.error(`${label}: Please enter a description`);
      return false;
    }
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      if (!q.question) {
        toast.error(`${label} Q${i + 1}: Question text is empty`);
        return false;
      }
      if (q.options.some((o) => !o)) {
        toast.error(`${label} Q${i + 1}: All options must be filled`);
        return false;
      }
      if (!q.correctAnswer) {
        toast.error(`${label} Q${i + 1}: Select a correct answer`);
        return false;
      }
    }
    return true;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (currentStep === 0 && !validateSetup()) return;
    if (
      currentStep === 1 &&
      includePreQuiz &&
      !validateQuiz(formData.preSimAssessment, "Pre-Sim Quiz")
    )
      return;
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // ── Save Draft ────────────────────────────────────────────────────────────

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title before saving as draft");
      return;
    }
    try {
      setIsSavingDraft(true);
      if (draftId) {
        await updateLearningSpace(formData, draftId, token);
        toast.success("Draft updated successfully");
      } else {
        const res = await addLearningSpace(formData, token);
        setDraftId(res.id);
        toast.success("Draft saved successfully");
      }
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // ── Publish ───────────────────────────────────────────────────────────────

  const handlePublish = async () => {
    if (!validateSetup()) return;
    if (
      includePreQuiz &&
      !validateQuiz(formData.preSimAssessment, "Pre-Sim Quiz")
    )
      return;
    if (!validateQuiz(formData.postSimAssessment, "Post-Sim Quiz")) return;

    try {
      setIsLoading(true);
      const savedId = draftId
        ? (await updateLearningSpace(formData, draftId, token), draftId)
        : (await addLearningSpace(formData, token)).id;

      await publishLearningSpace(savedId, token);
      toast.success("Learning space published successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        <div>
          <p className="font-semibold">Failed to publish</p>
          <p>{error.message}</p>
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Guide phase ───────────────────────────────────────────────────────────

  if (phase === "guide") {
    return <OnboardingGuide onStart={() => setPhase("form")} />;
  }

  // ── Form phase ─────────────────────────────────────────────────────────────

  // Show resources panel only on step 0 when a sim is selected
  const showResourcesPanel = currentStep === 0;

  return (
    <>
      {/* Simulation Preview Modal */}
      {previewSim && (
        <SimPreviewModal sim={previewSim} onClose={() => setPreviewSim(null)} />
      )}

      <div className="min-h-screen lg:h-screen bg-gray-50 flex flex-col lg:overflow-hidden">
        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0 z-30">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-950 flex items-center justify-center">
                  <FaFlask className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900 leading-none">
                    Create Learning Space
                  </h1>
                  {formData.title && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                      {formData.title}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden xs:block">
                <AutoSaveBadge status={autoSaveStatus} />
              </div>
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isLoading}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium disabled:opacity-50 transition-colors"
              >
                {isSavingDraft ? (
                  <FaSpinner className="animate-spin w-3 h-3" />
                ) : (
                  <FaSave className="w-3 h-3" />
                )}
                Save Draft
              </button>
            </div>
          </div>
        </header>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        {/*
          Mobile/tablet: normal page flow — window scrolls, no fixed heights.
          Desktop (lg+): fixed viewport columns — form and sidebar each scroll independently.
        */}
        <div className="flex-1 lg:overflow-hidden">
          <div className="max-w-screen-xl lg:h-full mx-auto w-full px-4 sm:px-6 flex flex-col">
            {/* Step Tracker */}
            <div className="pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0">
              <StepTracker currentStep={currentStep} />
            </div>

            {/* Two-column layout */}
            <div
              className={`flex gap-6 lg:flex-1 lg:min-h-0 ${showResourcesPanel ? "flex-col lg:flex-row" : "flex-col"}`}
            >
              {/* ── Form column ──────────────────────────────────────── */}
              <div
                ref={scrollContainerRef}
                className="flex-1 lg:overflow-y-auto space-y-5 pb-8"
              >
                {/* ── Step 0: Setup ── */}
                {currentStep === 0 && (
                  <>
                    <Section
                      icon={<BookIcon />}
                      title="Basic Information"
                      subtitle="Give your learning space a clear, descriptive title"
                      color="purple"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title / Topic
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g. Introduction to Newton's Laws of Motion"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                      </div>
                    </Section>

                    <Section
                      icon={<TargetIcon />}
                      title="Learning Objective"
                      subtitle="What will students achieve by the end of this session?"
                      color="orange"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Objective
                        </label>
                        <textarea
                          name="objective"
                          value={formData.objective}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Students will be able to identify and explain Newton's three laws..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Try using verbs like &quot;identify&quot;,
                          &quot;explain&quot;, &quot;analyze&quot;,
                          &quot;create&quot;
                        </p>
                      </div>
                    </Section>

                    <Section
                      icon={<GradeIcon />}
                      title="Duration"
                      subtitle="Set time allocation for the session"
                      color="green"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
                        >
                          <option value="">Select duration</option>
                          {Object.entries(DURATION_OPTIONS).map((duration, value) => (
                            <option key={value} value={value}>
                              {duration[0]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Section>

                    <Section
                      icon={<LabIcon />}
                      title="Simulation / Lab Tool"
                      subtitle="Choose an interactive simulation for hands-on learning"
                      color="blue"
                    >
                      {/* Subject filters */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {SIMULATION_SUBJECT.map((tool) => {
                          const isSelected = activeSubject === tool.id;
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => handleCourseFilterChange(tool.id)}
                              className={`relative text-left p-3.5 rounded-xl border-2 transition-all duration-150
                              ${isSelected ? "border-blue-950 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                            >
                              {isSelected && (
                                <span className="absolute top-2 right-2 bg-blue-950 text-white rounded-full p-0.5">
                                  <FaCheck className="w-2.5 h-2.5" />
                                </span>
                              )}
                              <div
                                className={`mb-2 p-2 rounded-lg inline-flex ${isSelected ? "bg-blue-100 text-blue-950" : "bg-gray-100 text-gray-600"}`}
                              >
                                {tool.icon}
                              </div>
                              <p className="text-xs font-semibold text-gray-800">
                                {tool.label}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                                {tool.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Simulation select with preview button */}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Simulation
                        </label>
                        <div className="flex gap-2">
                          <select
                            name="simulationId"
                            value={formData.simulationId}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
                          >
                            <option value="">
                              {simListLoading
                                ? "Loading simulations…"
                                : "Select a simulation"}
                            </option>
                            {experimentData.map((exp) => (
                              <option key={exp.id} value={exp.id}>
                                {exp.title}
                              </option>
                            ))}
                          </select>

                          {/* Preview button — enabled when sim detail is loaded */}
                          <button
                            type="button"
                            disabled={!selectedSimDetail || simDetailLoading}
                            onClick={() => setPreviewSim(selectedSimDetail)}
                            title="Preview simulation"
                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            {simDetailLoading ? (
                              <FaSpinner className="w-4 h-4 animate-spin" />
                            ) : (
                              <FaEye className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Preview</span>
                          </button>
                        </div>
                      </div>
                    </Section>

                    <Section
                      icon={<TagIcon />}
                      title="Curriculum Tags"
                      subtitle="Add tags to help organize and discover this learning space"
                      color="red"
                    >
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Type a tag and press Enter..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                          >
                            <FaPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 text-xs rounded-full border border-blue-200"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="hover:text-red-500 transition-colors"
                                >
                                  <FaTimes className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Section>
                  </>
                )}

                {/* ── Step 1: Pre-Sim Quiz ── */}
                {currentStep === 1 && (
                  <Section
                    icon={<TargetIcon />}
                    title="Pre-Simulation Assessment"
                    subtitle="Test prior knowledge before students begin the simulation"
                    color="orange"
                  >
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Include Pre-Simulation Quiz
                        </p>
                        <p className="text-xs text-gray-500">
                          Turn off to skip this assessment
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIncludePreQuiz((v) => !v)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                        ${includePreQuiz ? "bg-blue-950 text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        {includePreQuiz ? (
                          <>
                            <FaToggleOn className="w-4 h-4" /> Enabled
                          </>
                        ) : (
                          <>
                            <FaToggleOff className="w-4 h-4" /> Disabled
                          </>
                        )}
                      </button>
                    </div>

                    {includePreQuiz ? (
                      <QuizEditor
                        label="Pre-Simulation Quiz"
                        data={formData.preSimAssessment}
                        onChange={(updated) =>
                          setFormData({
                            ...formData,
                            preSimAssessment: updated,
                          })
                        }
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl mt-2">
                        <FaToggleOff className="w-8 h-8 mb-2 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">
                          Pre-simulation quiz is disabled
                        </p>
                        <p className="text-xs mt-1">
                          Students will go directly to the simulation.
                        </p>
                      </div>
                    )}
                  </Section>
                )}

                {/* ── Step 2: Orientation ── */}
                {currentStep === 2 && (
                  <>
                    <Section
                      icon={<BookIcon />}
                      title="Teacher Introduction Message"
                      subtitle="Message from the teacher displayed before the simulation begins"
                      color="orange"
                    >
                      <textarea
                        name="introductionMessage"
                        value={formData.introductionMessage}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Today, we're going to explore how density affects whether objects sink or float..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                      />
                    </Section>

                    <Section
                      icon={<TargetIcon />}
                      title="Engagement Question"
                      subtitle="A question to spark curiosity before the experiment"
                      color="blue"
                    >
                      <input
                        type="text"
                        name="engagementQuestion"
                        value={formData.engagementQuestion}
                        onChange={handleChange}
                        placeholder="e.g Why do some things float or sink?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      />
                    </Section>

                    <Section
                      icon={<BookIcon />}
                      title="Hypothesis Question"
                      subtitle="Ask students to form a prediction before experimenting"
                      color="red"
                    >
                      <input
                        type="text"
                        name="hypothesisQuestion"
                        value={formData.hypothesisQuestion}
                        onChange={handleChange}
                        placeholder="e.g What will happen if we increase the density of an object in water?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      />
                    </Section>

                    <Section
                      icon={<LabIcon />}
                      title="Experiment Procedures"
                      subtitle="Step-by-step procedures to guide the student in carrying out the experiment"
                      color="orange"
                    >
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={proceduresInput}
                            onChange={(e) => setProceduresInput(e.target.value)}
                            onKeyDown={handleProceduresKeyDown}
                            placeholder="Type a procedure step and press Enter..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                          />
                          <button
                            type="button"
                            onClick={handleAddProcedure}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                          >
                            <FaPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {formData.experimentProcedures.length > 0 && (
                          <ol className="flex flex-col gap-2 mt-3">
                            {formData.experimentProcedures.map(
                              (procedure, i) => (
                                <li
                                  key={procedure}
                                  className="flex items-center gap-2.5 px-3 py-2 bg-blue-50 text-blue-900 text-xs rounded-lg border border-blue-200"
                                >
                                  <span className="font-bold text-blue-400 w-4 flex-shrink-0">
                                    {i + 1}.
                                  </span>
                                  <span className="flex-1">{procedure}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveProcedure(procedure)
                                    }
                                    className="hover:text-red-500 transition-colors flex-shrink-0"
                                  >
                                    <FaTimes className="w-2.5 h-2.5" />
                                  </button>
                                </li>
                              ),
                            )}
                          </ol>
                        )}
                      </div>
                    </Section>

                    <Section
                      icon={<TagIcon />}
                      title="Discussion Prompt"
                      subtitle="A question or debate topic for after the experiment"
                      color="green"
                    >
                      <input
                        type="text"
                        name="discussionPrompt"
                        value={formData.discussionPrompt}
                        onChange={handleChange}
                        placeholder="e.g Was your hypothesis correct? What would you do differently?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      />
                    </Section>

                    <Section
                      icon={<TargetIcon />}
                      title="Real-World Applications"
                      subtitle="Connect the experiment to real-world scenarios"
                      color="orange"
                    >
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={realWorldInput}
                            onChange={(e) => setRealWorldInput(e.target.value)}
                            onKeyDown={handleRwaKeyDown}
                            placeholder="e.g Ships floating in water use Archimedes' principle..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                          />
                          <button
                            type="button"
                            onClick={handleAddRwa}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                          >
                            <FaPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {formData.realWorldApplications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.realWorldApplications.map((rwa) => (
                              <span
                                key={rwa}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 text-xs rounded-full border border-blue-200"
                              >
                                {rwa}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRwa(rwa)}
                                  className="hover:text-red-500 transition-colors"
                                >
                                  <FaTimes className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Section>

                    <Section
                      icon={<GradeIcon />}
                      title="Related Occupations / Careers"
                      subtitle="Show students how this connects to real careers"
                      color="red"
                    >
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={careersInput}
                            onChange={(e) => setCareersInput(e.target.value)}
                            onKeyDown={handleCareerKeyDown}
                            placeholder="Type a career and press Enter..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                          />
                          <button
                            type="button"
                            onClick={handleAddCareer}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                          >
                            <FaPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {formData.relatedCareers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {formData.relatedCareers.map((career) => (
                              <span
                                key={career}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 text-xs rounded-full border border-blue-200"
                              >
                                {career}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCareer(career)}
                                  className="hover:text-red-500 transition-colors"
                                >
                                  <FaTimes className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Section>

                    <Section
                      icon={<TargetIcon />}
                      title="Student Real-World Task"
                      subtitle="A prompt asking students to find an example in their own life"
                      color="purple"
                    >
                      <input
                        type="text"
                        name="realWorldTask"
                        value={formData.realWorldTask}
                        onChange={handleChange}
                        placeholder="e.g Find one real world example near you and describe the connection"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                      />
                    </Section>
                  </>
                )}

                {/* ── Step 3: Post-Sim Quiz ── */}
                {currentStep === 3 && (
                  <Section
                    icon={<LabIcon />}
                    title="Post-Simulation Assessment"
                    subtitle="Evaluate what students learned after completing the simulation"
                    color="blue"
                  >
                    <QuizEditor
                      label="Post-Simulation Quiz"
                      data={formData.postSimAssessment}
                      onChange={(updated) =>
                        setFormData({ ...formData, postSimAssessment: updated })
                      }
                    />
                  </Section>
                )}

                {/* ── Footer navigation ─────────────────────────────────────── */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 pb-8 border-t border-gray-200 mt-2">
                  {/* Save draft — full width on mobile, auto on sm+ */}
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isLoading}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium disabled:opacity-50 transition-colors"
                  >
                    {isSavingDraft ? (
                      <FaSpinner className="animate-spin w-3.5 h-3.5" />
                    ) : (
                      <FaSave className="w-3.5 h-3.5" />
                    )}
                    Save Draft
                  </button>

                  {/* Back / Next / Publish — full width row on mobile */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={currentStep === 0 ? onCancel : handleBack}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                      {currentStep === 0 ? "Cancel" : "Back"}
                    </button>

                    {currentStep < STEPS.length - 1 && (
                      <button
                        onClick={handleNext}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm bg-blue-950 text-white rounded-lg hover:bg-blue-800 active:scale-95 transition-all"
                      >
                        Next
                        <FaChevronRight className="w-3 h-3" />
                      </button>
                    )}

                    {currentStep === STEPS.length - 1 && (
                      <button
                        onClick={handlePublish}
                        disabled={isLoading || isSavingDraft}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 text-sm rounded-lg text-white transition-all
                        ${isLoading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-800 active:scale-95"}
                        disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <>
                            <FaSpinner className="animate-spin w-4 h-4" />{" "}
                            Publishing…
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="w-3.5 h-3.5" /> Publish
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Resources sidebar (step 0 only) ─────────────────────── */}
              {showResourcesPanel && (
                <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 lg:overflow-y-auto pb-8 space-y-4">
                  <ResourcesPanel
                    sim={selectedSimDetail}
                    isLoading={simDetailLoading}
                  />

                  {/* Quick tips card */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FaLightbulb className="w-3 h-3" /> Tips
                    </h3>
                    <ul className="space-y-1.5">
                      {[
                        "Pick a simulation first to unlock resources",
                        "Use the Preview button to try the sim before selecting",
                        "Teacher tips include classroom activity guides",
                      ].map((tip) => (
                        <li
                          key={tip}
                          className="flex items-start gap-2 text-xs text-amber-800"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              )}
            </div>
            {/* end two-column flex */}
          </div>
          {/* end h-full column wrapper */}
        </div>
        {/* end flex-1 overflow-hidden */}
      </div>
    </>
  );
};

export default CreateLearningSpacePage;
