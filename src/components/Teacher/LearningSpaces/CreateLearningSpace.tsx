import { Modal } from "@/components/School/Dashboard/UserMgt/SchoolUserManagementModals";
import { getPhetSimulations } from "@/services/dashboard-service";
import {
  addLearningSpace,
  publishLearningSpace,
} from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useState, KeyboardEvent, useEffect } from "react";
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
  FaToggleOn,
  FaToggleOff,
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
};

type CreateLearningSpaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

//const SCORES = ["10", "20", "50", "100"];

const DURATION_OPTIONS = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "1 hour",
  "1.5 hours",
  "2 hours",
  "2.5 hours",
  "3 hours",
];

const EMPTY_QUIZ: QuizData = {
  quizTitle: "",
  description: "",
  points: "",
  questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
};

// ─── Step Tracker ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Setup" },
  { label: "Pre-Quiz" },
  { label: "Orientation" },
  { label: "Post-Quiz" },
];

type StepTrackerProps = { currentStep: number };

const StepTracker = ({ currentStep }: StepTrackerProps) => (
  <div className="flex items-center justify-center mb-6 select-none">
    {STEPS.map((step, index) => {
      const isCompleted = index < currentStep;
      const isActive = index === currentStep;

      return (
        <div key={step.label} className="flex items-center">
          {/* Step bubble */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${
                  isCompleted
                    ? "bg-green-500 text-white shadow-md shadow-green-200"
                    : isActive
                      ? "bg-blue-950 text-white shadow-md shadow-blue-200 ring-2 ring-blue-300 ring-offset-1"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
            >
              {isCompleted ? <FaCheck className="w-3 h-3" /> : index + 1}
            </div>
            <span
              className={`text-[10px] font-semibold tracking-wide uppercase transition-colors duration-200
                ${isCompleted ? "text-green-500" : isActive ? "text-blue-950" : "text-gray-400"}`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < STEPS.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500
                ${index < currentStep ? "bg-green-400" : "bg-gray-200"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

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

      {/* Questions */}
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

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const CreateLearningSpaceModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateLearningSpaceModalProps) => {
  const { user, token } = useUser();

  // Step: 0 = Setup, 1 = Pre-Quiz, 2 = Orientation, 3 = Post-Quiz
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // ── Form array input states  ──────────────────────────────────────────
  const [tagInput, setTagInput] = useState("");
  const [realWorldInput, setRealWorldInput] = useState("");
  const [careersInput, setCareersInput] = useState("");
  const [proceduresInput, setProceduresInput] = useState("");

  // ── Pre-quiz optional toggle ──────────────────────────────────────────
  const [includePreQuiz, setIncludePreQuiz] = useState(true);

  const [loading, setLoading] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string>("");
  const [experimentData, setExperimentData] = useState<ExperimentResponse[]>(
    [],
  );
  const [fetchFilters, setFetchFilters] = useState({
    physics: "",
    chemistry: "",
    biology: "",
    math: "",
    earthSpace: "",
    gradeLevel: "",
    search: "",
  });

  const [formData, setFormData] = useState<FormData>({
    title: "",
    objective: "",
    score: "",
    duration: "",
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

  useEffect(() => {
    async function fetchExperiments() {
      setLoading(true);
      try {
        const data = await getPhetSimulations(token, fetchFilters);
        setExperimentData(data.items || []);
      } catch (err) {
        console.error("Error fetching experiments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchExperiments();
  }, [token, fetchFilters]);

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
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag))
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setTagInput("");
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

  // FIX: dedicated Enter handler for the real-world input
  const handleRwaKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && realWorldInput.trim()) {
      e.preventDefault();
      handleAddRwa();
    }
  };

  const handleAddRwa = () => {
    const newRwa = realWorldInput.trim();
    if (newRwa && !formData.realWorldApplications.includes(newRwa)) {
      setFormData({
        ...formData,
        realWorldApplications: [...formData.realWorldApplications, newRwa],
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
    const newCareer = careersInput.trim();
    if (newCareer && !formData.relatedCareers.includes(newCareer)) {
      setFormData({
        ...formData,
        relatedCareers: [...formData.relatedCareers, newCareer],
      });
      setCareersInput("");
    }
  };

  const handleRemoveCareer = (career: string) =>
    setFormData({
      ...formData,
      relatedCareers: formData.relatedCareers.filter((c) => c !== career),
    });

  // ── Experiment Procedures ───────────────────────────────────────────────────────

  const handleProceduresKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && proceduresInput.trim()) {
      e.preventDefault();
      handleAddProcedure();
    }
  };

  const handleAddProcedure = () => {
    const newProcedure = proceduresInput.trim();
    if (newProcedure && !formData.experimentProcedures.includes(newProcedure)) {
      setFormData({
        ...formData,
        experimentProcedures: [...formData.experimentProcedures, newProcedure],
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
    // if (!formData.score) {
    //   toast.error("Please select a score");
    //   return false;
    // }
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
    // Step 0 → validate setup
    if (currentStep === 0 && !validateSetup()) return;

    // Step 1 → validate pre-quiz only if teacher chose to include it
    if (
      currentStep === 1 &&
      includePreQuiz &&
      !validateQuiz(formData.preSimAssessment, "Pre-Sim Quiz")
    )
      return;

    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 0));

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title before saving as draft");
      return;
    }
    try {
      setIsSavingDraft(true);
      //await new Promise((resolve) => setTimeout(resolve, 800));
      // const res = await addLearningSpace(formData);
      // console.log(res)
      await addLearningSpace(formData);
      toast.success("Draft saved successfully");
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!validateSetup()) return;
    // FIX: only validate pre-quiz if it is included
    if (
      includePreQuiz &&
      !validateQuiz(formData.preSimAssessment, "Pre-Sim Quiz")
    )
      return;
    if (!validateQuiz(formData.postSimAssessment, "Post-Sim Quiz")) return;
    try {
      setIsLoading(true);
      const res = await addLearningSpace(formData);
      const savedId = res.id
      await publishLearningSpace(savedId)

      toast.success("Learning space published successfully");
      onSuccess?.();
      onClose();
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Learning Space">
      <p className="text-sm text-gray-500 -mt-2 mb-5">
        Design an interactive learning experience
      </p>

      {/* Step Tracker */}
      <StepTracker currentStep={currentStep} />

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Try using verbs like &quot;identify&quot;,
                  &quot;explain&quot;, &quot;analyze&quot;, &quot;create&quot;
                </p>
              </div>
            </Section>

            <Section
              icon={<GradeIcon />}
              title="Duration"
              subtitle="Set time allocation"
              color="green"
            >
              <div className="grid grid-cols-1 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <select
                    name="score"
                    value={formData.score}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
                  >
                    <option value="">Select score</option>
                    {SCORES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
                  >
                    <option value="">Select duration</option>
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Section>

            <Section
              icon={<LabIcon />}
              title="Simulation / Lab Tool"
              subtitle="Choose an interactive simulation for hands-on learning"
              color="blue"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {SIMULATION_SUBJECT.map((tool) => {
                  const isSelected = activeSubject === tool.id;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleCourseFilterChange(tool.id)}
                      className={`relative text-left p-4 rounded-lg border-2 transition-all duration-150
                        ${isSelected ? "border-blue-950 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 bg-blue-950 text-white rounded-full p-0.5">
                          <FaCheck className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <div
                        className={`mb-2 p-2 rounded-md inline-flex ${isSelected ? "bg-blue-100 text-blue-950" : "bg-gray-100 text-gray-600"}`}
                      >
                        {tool.icon}
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {tool.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                        {tool.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Simulation
                </label>
                <select
                  name="simulationId"
                  value={formData.simulationId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
                >
                  <option value="">Select a simulation</option>
                  {experimentData.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title}
                    </option>
                  ))}
                </select>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
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
            {/* Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
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

            {/* Quiz form — only shown when toggled on */}
            {includePreQuiz && (
              <QuizEditor
                label="Pre-Simulation Quiz"
                data={formData.preSimAssessment}
                onChange={(updated) =>
                  setFormData({ ...formData, preSimAssessment: updated })
                }
              />
            )}

            {/* Skipped state */}
            {!includePreQuiz && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg mt-2">
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
              subtitle="Message from the teacher"
              color="orange"
            >
              <div>
                <textarea
                  name="introductionMessage"
                  value={formData.introductionMessage}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Today, we're going to explore how density affects whether objects sink or float..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                />
              </div>
            </Section>

            <Section
              icon={<TargetIcon />}
              title="Engagement Question"
              subtitle="Question to spark curiosity before the experiment"
              color="blue"
            >
              <div>
                <input
                  type="text"
                  name="engagementQuestion"
                  value={formData.engagementQuestion}
                  onChange={handleChange}
                  placeholder="e.g Why do some things float or sink?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
            </Section>

            <Section
              icon={<BookIcon />}
              title="Hypothesis Question"
              subtitle="Ask a question to spark curiosity"
              color="red"
            >
              <div>
                <input
                  type="text"
                  name="hypothesisQuestion"
                  value={formData.hypothesisQuestion}
                  onChange={handleChange}
                  placeholder="e.g What will happen if we increase the density of an object in water?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
            </Section>

            {/* <Section
              icon={<LabIcon />}
              title="Experiment Procedures"
              subtitle="Step-by-step procedures to guide the student in carrying out the experiment"
              color="orange"
            >
              <div>
                <textarea
                  name="experimentProcedures"
                  value={formData.experimentProcedures}
                  onChange={handleChange}
                  rows={3}
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
                />
              </div>
            </Section> */}

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
                    placeholder="Type in a procedure and press Enter..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddProcedure}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                  >
                    <FaPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {formData.experimentProcedures.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3">
                    {formData.experimentProcedures.map((procedure) => (
                      <span
                        key={procedure}
                        className="flex items-center justify-between gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 text-xs rounded-full border border-blue-200"
                      >
                        {procedure}
                        <button
                          type="button"
                          onClick={() => handleRemoveProcedure(procedure)}
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
              icon={<TagIcon />}
              title="Discussion Prompt"
              subtitle="A question or debate topic for after the experiment."
              color="green"
            >
              <div>
                <input
                  type="text"
                  name="discussionPrompt"
                  value={formData.discussionPrompt}
                  onChange={handleChange}
                  placeholder="e.g Was your hypothesis correct? What would you do differently?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
            </Section>

            <Section
              icon={<TargetIcon />}
              title="Real-World Applications"
              subtitle=""
              color="orange"
            >
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={realWorldInput}
                    onChange={(e) => setRealWorldInput(e.target.value)}
                    // FIX: use dedicated handler so Enter adds to realWorldApplications
                    onKeyDown={handleRwaKeyDown}
                    placeholder="e.g Ships floating in water use Archimedes principle..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddRwa}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
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
              subtitle=""
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <button
                    type="button"
                    onClick={handleAddCareer}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
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
              subtitle="A prompt asking students to find an example in their own life."
              color="purple"
            >
              <div>
                <input
                  type="text"
                  name="realWorldTask"
                  value={formData.realWorldTask}
                  onChange={handleChange}
                  placeholder="e.g Find one real world example near you and describe the connection"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>
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
      </div>

      {/* ── Footer Actions ── */}
      <div className="flex gap-3 justify-between pt-4 mt-2 border-t">
        {/* Left: Save Draft */}
        <button
          onClick={handleSaveDraft}
          disabled={isSavingDraft || isLoading}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
        >
          {isSavingDraft ? (
            <FaSpinner className="animate-spin h-3.5 w-3.5" />
          ) : (
            <FaSave className="h-3.5 w-3.5" />
          )}
          Save Draft
        </button>

        {/* Right: Navigation */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={currentStep === 0 ? onClose : handleBack}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {currentStep === 0 ? "Cancel" : "Back"}
          </button>

          {/* Next — visible on steps 0–2 */}
          {currentStep < STEPS.length - 1 && (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              Next
              <FaChevronRight className="h-3 w-3" />
            </button>
          )}

          {/* Publish — only on last step */}
          {currentStep === STEPS.length - 1 && (
            <button
              onClick={handlePublish}
              disabled={isLoading || isSavingDraft}
              className={`px-4 py-2 text-sm rounded-md flex items-center justify-center gap-2
                ${isLoading ? "bg-blue-800 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-900"}
                text-white transition duration-200 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane className="h-3.5 w-3.5" />
                  Publish
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
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
  <div className="border border-gray-200 rounded-lg p-4 space-y-3">
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
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
