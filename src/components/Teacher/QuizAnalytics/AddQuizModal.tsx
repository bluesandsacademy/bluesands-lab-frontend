import { Modal } from "@/components/School/Dashboard/UserMgt/SchoolUserManagementModals";
import { useUser } from "@/services/UserContext";
import { useState } from "react";
import { FaSpinner, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export const AddQuizModal = ({ isOpen, onClose }: any) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    quizTitle: "",
    description: "",
    startDate: "",
    points: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ],
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.questions];
    if (field === "question" || field === "correctAnswer") {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    });
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: updatedQuestions });
    }
  };

  const handleSubmit = async () => {
    console.log("Adding Quiz:", formData);
    
    // Validation
    if (!formData.quizTitle || !formData.description || !formData.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.some((opt) => !opt)) {
        toast.error(`Question ${i + 1} has empty options`);
        return;
      }
      if (!q.correctAnswer) {
        toast.error(`Question ${i + 1} has no correct answer selected`);
        return;
      }
    }

    try {
      setIsLoading(true);
      // const res = await addQuiz(formData, user?.schoolId, token);
      // console.log(res);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsLoading(false);
      onClose();
      toast.success("Quiz added successfully");
    } catch (error) {
      console.error("Error adding quiz:", error);
      setIsLoading(false);
      toast.error("Failed to add quiz");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Quiz">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="quizTitle"
              value={formData.quizTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="Brief description of the quiz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Points
            </label>
            <input
              type="number"
              name="points"
              value={formData.points}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="100"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Questions</h3>
          
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Question {qIndex + 1}
                </h4>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                  >
                    <FaTrash className="h-3 w-3" />
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                  placeholder="Enter your question"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600 w-6">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, optIndex, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer <span className="text-red-500">*</span>
                </label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                >
                  <option value="">Select correct answer</option>
                  {question.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {String.fromCharCode(65 + optIndex)}. {option || `Option ${String.fromCharCode(65 + optIndex)}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-950 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <FaPlus className="h-3 w-3" />
            Add Question
          </button>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 text-sm rounded-md flex items-center justify-center gap-2
                        ${
                          isLoading
                            ? "bg-blue-800 cursor-not-allowed"
                            : "bg-blue-950 hover:bg-blue-900"
                        } 
                        text-white transition duration-200`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4" />
                <span>Processing...</span>
              </>
            ) : (
              "Add Quiz"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};