"use client";

import { getLearningSpaceById } from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaSpinner,
  FaFlask,
  FaCheck,
  FaBook,
  FaGraduationCap,
  FaLightbulb,
  FaBriefcase,
  FaComments,
  FaGlobe,
  FaEdit,
  FaClock,
  FaTag,
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import { BsBook } from "react-icons/bs";

// ─── Types ────────────────────────────────────────────────────────────────────

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

type LearningSpace = {
  id: string;
  title: string;
  objective: string;
  score: string;
  duration: string;
  simulationId: string;
  simulationTitle?: string;
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
  published?: boolean;
  createdAt?: string;
};

type ViewLearningSpacePageProps = {
  spaceId: string;
  onBack?: () => void;
  onEdit?: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isEmpty = (val: unknown): boolean => {
  if (!val) return true;
  if (Array.isArray(val)) return val.length === 0;
  if (typeof val === "string") return val.trim() === "";
  return false;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

type SectionCardProps = {
  icon: React.ReactNode;
  title: string;
  accent: string; // tailwind bg color class for the icon bubble
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const SectionCard = ({ icon, title, accent, children, defaultOpen = true }: SectionCardProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${accent}`}>
            {icon}
          </div>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        {open ? (
          <FaChevronUp className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <FaChevronDown className="w-3.5 h-3.5 text-gray-400" />
        )}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-gray-100">{children}</div>}
    </div>
  );
};

type QuizViewProps = { data: QuizData; label: string };

const QuizView = ({ data, label }: QuizViewProps) => {
  if (!data?.quizTitle) {
    return (
      <p className="text-sm text-gray-400 italic py-2">No {label.toLowerCase()} configured.</p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Meta */}
      <div className="flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full font-medium">
          {data.quizTitle}
        </span>
        {data.points && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-full font-medium">
            {data.points} pts
          </span>
        )}
      </div>

      {data.description && (
        <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
      )}

      {/* Questions */}
      <div className="space-y-4 mt-2">
        {data.questions?.map((q, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              <span className="text-blue-950 mr-1.5">Q{i + 1}.</span>
              {q.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const isCorrect = opt === q.correctAnswer;
                return (
                  <div
                    key={oi}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors
                      ${isCorrect
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-white border-gray-200 text-gray-600"
                      }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0
                        ${isCorrect ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}
                    >
                      {isCorrect ? <FaCheck className="w-2.5 h-2.5" /> : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// normalizeSpace is shared — imported from utils
import { normalizeSpace } from "@/utils/NormalizeSpace";

// ─── Main Component ───────────────────────────────────────────────────────────

export const ViewLearningSpacePage = ({
  spaceId,
  onBack,
  onEdit,
}: ViewLearningSpacePageProps) => {
  const { token } = useUser();
  const [space, setSpace] = useState<LearningSpace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);
      try {
        const raw = await getLearningSpaceById(spaceId, token);
        setSpace(normalizeSpace(raw));
      } catch (err: any) {
        setError(err?.message ?? "Failed to load learning space");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [spaceId, token]);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Learning Space" onBack={onBack} onEdit={undefined} showEdit={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <FaSpinner className="animate-spin w-8 h-8" />
            <p className="text-sm font-medium">Loading learning space…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (error || !space) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Learning Space" onBack={onBack} onEdit={undefined} showEdit={false} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-3 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <FaExclamationTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Could not load this learning space</p>
            <p className="text-xs text-gray-500">{error}</p>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title={space.title} onBack={onBack} onEdit={onEdit} showEdit={!!onEdit} />

      <main className="flex-1 max-w-screen-lg mx-auto w-full px-4 sm:px-6 py-8 space-y-5">

        {/* ── Hero meta strip ── */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 flex-shrink-0">
              <BsBook className="text-xl text-indigo-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{space.title}</h1>
              {space.published !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5
                    ${space.published
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                    }`}
                >
                  {space.published ? <FaCheck className="w-2.5 h-2.5" /> : null}
                  {space.published ? "Published" : "Draft"}
                </span>
              )}
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 ml-auto">
              {space.duration && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                  <FaClock className="w-3 h-3 text-gray-400" />
                  {space.duration}
                </span>
              )}
              {space.score && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200">
                  {space.score} pts
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {!isEmpty(space.tags) && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              <FaTag className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
              {space.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] rounded-full border border-indigo-200 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Objective ── */}
        {!isEmpty(space.objective) && (
          <SectionCard
            icon={<FaGraduationCap className="w-4 h-4 text-orange-600" />}
            title="Learning Objective"
            accent="bg-orange-100"
          >
            <p className="text-sm text-gray-700 leading-relaxed">{space.objective}</p>
          </SectionCard>
        )}

        {/* ── Pre-sim quiz ── */}
        <SectionCard
          icon={<FaClipboardList className="w-4 h-4 text-blue-700" />}
          title="Pre-Simulation Assessment"
          accent="bg-blue-100"
          defaultOpen={false}
        >
          <QuizView data={space.preSimAssessment} label="Pre-Simulation Quiz" />
        </SectionCard>

        {/* ── Orientation ── */}
        {(!isEmpty(space.introductionMessage) ||
          !isEmpty(space.engagementQuestion) ||
          !isEmpty(space.hypothesisQuestion) ||
          !isEmpty(space.experimentProcedures) ||
          !isEmpty(space.discussionPrompt) ||
          !isEmpty(space.realWorldApplications) ||
          !isEmpty(space.relatedCareers) ||
          !isEmpty(space.realWorldTask)) && (
          <SectionCard
            icon={<FaFlask className="w-4 h-4 text-purple-600" />}
            title="Orientation & Experiment"
            accent="bg-purple-100"
            defaultOpen={false}
          >
            <div className="space-y-5">
              {!isEmpty(space.introductionMessage) && (
                <Field label="Teacher Introduction" icon={<FaBook className="w-3.5 h-3.5" />}>
                  <p className="text-sm text-gray-700 leading-relaxed">{space.introductionMessage}</p>
                </Field>
              )}

              {!isEmpty(space.engagementQuestion) && (
                <Field label="Engagement Question" icon={<FaLightbulb className="w-3.5 h-3.5" />}>
                  <p className="text-sm text-gray-700">{space.engagementQuestion}</p>
                </Field>
              )}

              {!isEmpty(space.hypothesisQuestion) && (
                <Field label="Hypothesis Question" icon={<FaLightbulb className="w-3.5 h-3.5" />}>
                  <p className="text-sm text-gray-700">{space.hypothesisQuestion}</p>
                </Field>
              )}

              {!isEmpty(space.experimentProcedures) && (
                <Field label="Experiment Procedures" icon={<FaClipboardList className="w-3.5 h-3.5" />}>
                  <ol className="space-y-2">
                    {space.experimentProcedures.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Field>
              )}

              {!isEmpty(space.discussionPrompt) && (
                <Field label="Discussion Prompt" icon={<FaComments className="w-3.5 h-3.5" />}>
                  <p className="text-sm text-gray-700">{space.discussionPrompt}</p>
                </Field>
              )}

              {!isEmpty(space.realWorldApplications) && (
                <Field label="Real-World Applications" icon={<FaGlobe className="w-3.5 h-3.5" />}>
                  <div className="flex flex-wrap gap-2">
                    {space.realWorldApplications.map((r) => (
                      <span key={r} className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-200 text-xs rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                </Field>
              )}

              {!isEmpty(space.relatedCareers) && (
                <Field label="Related Careers" icon={<FaBriefcase className="w-3.5 h-3.5" />}>
                  <div className="flex flex-wrap gap-2">
                    {space.relatedCareers.map((c) => (
                      <span key={c} className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </Field>
              )}

              {!isEmpty(space.realWorldTask) && (
                <Field label="Student Real-World Task" icon={<FaGlobe className="w-3.5 h-3.5" />}>
                  <p className="text-sm text-gray-700">{space.realWorldTask}</p>
                </Field>
              )}
            </div>
          </SectionCard>
        )}

        {/* ── Post-sim quiz ── */}
        <SectionCard
          icon={<FaClipboardList className="w-4 h-4 text-green-700" />}
          title="Post-Simulation Assessment"
          accent="bg-green-100"
          defaultOpen={false}
        >
          <QuizView data={space.postSimAssessment} label="Post-Simulation Quiz" />
        </SectionCard>

      </main>
    </div>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────

type HeaderProps = {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  showEdit: boolean;
};

const Header = ({ title, onBack, onEdit, showEdit }: HeaderProps) => (
  <header className="bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-30">
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="h-4 w-px bg-gray-200 flex-shrink-0" />
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-blue-950 flex items-center justify-center flex-shrink-0">
            <FaFlask className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-sm font-bold text-gray-900 truncate">{title}</h1>
        </div>
      </div>

      {showEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-950 text-white rounded-lg hover:bg-blue-800 transition-colors flex-shrink-0"
        >
          <FaEdit className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      )}
    </div>
  </header>
);

// ─── Field helper ─────────────────────────────────────────────────────────────

type FieldProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Field = ({ label, icon, children }: FieldProps) => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
      <span className="text-gray-400">{icon}</span>
      {label}
    </p>
    {children}
  </div>
);

export default ViewLearningSpacePage;