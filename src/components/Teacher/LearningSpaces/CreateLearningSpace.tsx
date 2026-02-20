import { Modal } from "@/components/School/Dashboard/UserMgt/SchoolUserManagementModals";
import { useUser } from "@/services/UserContext";
import { useState, KeyboardEvent } from "react";
import { FaSpinner, FaFlask, FaAtom, FaCalculator, FaDna, FaCheck, FaTimes, FaPlus, FaPaperPlane, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

type SimulationTool = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const SIMULATION_TOOLS: SimulationTool[] = [
  {
    id: "physics",
    label: "Physics Lab",
    description: "Interactive physics experiments with forces, motions and energy",
    icon: <FaFlask className="w-5 h-5" />,
  },
  {
    id: "chemistry",
    label: "Chemistry Lab",
    description: "Virtual chemistry experiments and molecular visualization",
    icon: <FaAtom className="w-5 h-5" />,
  },
  {
    id: "math",
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

const GRADE_OPTIONS = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
];

const DURATION_OPTIONS = [
  "15 minutes", "30 minutes", "45 minutes", "1 hour",
  "1.5 hours", "2 hours", "2.5 hours", "3 hours",
];

type FormData = {
  title: string;
  objective: string;
  gradeLevel: string;
  duration: string;
  simulationTool: string;
  tags: string[];
};

type CreateLearningSpaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export const CreateLearningSpaceModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateLearningSpaceModalProps) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    objective: "",
    gradeLevel: "",
    duration: "",
    simulationTool: "",
    tags: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToolSelect = (toolId: string) => {
    setFormData({ ...formData, simulationTool: toolId });
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
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

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const validate = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the learning space");
      return false;
    }
    if (!formData.objective.trim()) {
      toast.error("Please enter a learning objective");
      return false;
    }
    if (!formData.gradeLevel) {
      toast.error("Please select a grade level");
      return false;
    }
    if (!formData.duration) {
      toast.error("Please select a duration");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title before saving as draft");
      return;
    }
    try {
      setIsSavingDraft(true);
      // Replace with your actual API call, e.g.:
      // await createLearningSpace({ ...formData, status: "draft" }, user?.schoolId, token);
      await new Promise((resolve) => setTimeout(resolve, 800)); // placeholder
      toast.success("Draft saved successfully");
      setIsSavingDraft(false);
    } catch (error: any) {
      setIsSavingDraft(false);
      toast.error("Failed to save draft");
    }
  };

  const handlePublish = async () => {
    if (!validate()) return;
    try {
      setIsLoading(true);
      // Replace with your actual API call, e.g.:
      // await createLearningSpace({ ...formData, status: "published" }, user?.schoolId, token);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // placeholder
      setIsLoading(false);
      toast.success("Learning space published successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(
        <div>
          <p className="font-semibold">Failed to publish learning space</p>
          <p>{error.message}</p>
        </div>
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Learning Space">
      {/* Header description */}
      <p className="text-sm text-gray-500 -mt-2 mb-5">
        Design an interactive learning experience
      </p>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">

        {/* ── Basic Information ── */}
        <Section
          icon={<BookIcon />}
          title="Basic Information"
          subtitle="Give your learning space a clear, descriptive title"
          color="purple"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Newton's laws of Motion"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>
        </Section>

        {/* ── Learning Objective ── */}
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
              placeholder="Students will be able to identify and explain Newton's three laws of motion through hands-on experiments and real world examples..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Try using verbs like &quot;identify&quot;, &quot;explain&quot;, &quot;analyze&quot;, &quot;create&quot;
            </p>
          </div>
        </Section>

        {/* ── Grade & Duration ── */}
        <Section
          icon={<GradeIcon />}
          title="Grade & Duration"
          subtitle="Set the appropriate grade level and time allocation"
          color="green"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade level
              </label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
              >
                <option value="">Select grade</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
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
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* ── Simulation / Lab Tool ── */}
        <Section
          icon={<LabIcon />}
          title="Simulation/Lab Tool"
          subtitle="Choose an interactive simulation for hands-on learning"
          color="blue"
        >
          <div className="grid grid-cols-2 gap-3">
            {SIMULATION_TOOLS.map((tool) => {
              const isSelected = formData.simulationTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolSelect(tool.id)}
                  className={`relative text-left p-4 rounded-lg border-2 transition-all duration-150
                    ${isSelected
                      ? "border-blue-950 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-blue-950 text-white rounded-full p-0.5">
                      <FaCheck className="w-2.5 h-2.5" />
                    </span>
                  )}
                  <div className={`mb-2 p-2 rounded-md inline-flex
                    ${isSelected ? "bg-blue-100 text-blue-950" : "bg-gray-100 text-gray-600"}`}>
                    {tool.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{tool.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{tool.description}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Curriculum Tags ── */}
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
      </div>

      {/* ── Footer Actions ── */}
      <div className="flex gap-3 justify-end pt-4 mt-2 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
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
      </div>
    </Modal>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// Simple inline SVG icons to match the Figma design style
const BookIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const GradeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const LabIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
  </svg>
);