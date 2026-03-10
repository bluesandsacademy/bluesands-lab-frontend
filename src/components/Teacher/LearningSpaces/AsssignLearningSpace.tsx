import { Modal } from "@/components/School/Dashboard/UserMgt/SchoolUserManagementModals";
import { assignExperiment, getClasses } from "@/services/dashboard-service";
import { assignLearningSpace } from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { FaSpinner, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface ClassResponse {
  id: string;
  name: string;
  subject: string;
  myRole: string;
  students: number;
  createdAt: string;
  inviteCode: string;
  inviteCodeExpiresAt: string;
}

export const AssignLearningSpaceModal = ({
  isOpen,
  onClose,
  spaceId,
}: any) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [formData, setFormData] = useState({
  classroomId: "",   // ✅ was classroomId
  type: "",
});
  const [classList, setClassList] = useState<ClassResponse[]>([]);

  useEffect(() => {
    async function fetchClasses() {
      setIsClassLoading(true);
      try {
        const data = await getClasses(token);
        setClassList(data || []);
      } catch (err) {
        console.error("Error fetching classes:", err);
      } finally {
        setIsClassLoading(false);
      }
    }
    fetchClasses();
  }, [token]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // console.log("Assigning experiment:", formData);

    // Validation
    if (!formData.classroomId || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const res = await assignLearningSpace(formData, spaceId, token);
      console.log(res);

      // Simulate API call
      //await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsLoading(false);
      onClose();
      toast.success("Learning Space assigned successfully");
    } catch (error: any) {
      console.error("Error assigning space:", error);
      setIsLoading(false);
      toast.error(
        <div>
          <p className="font-semibold">Failed to assign Learning Space</p>
          <p>{error.message}</p>
        </div>,
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Experiment">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experiment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="Enter Experiment title"
              disabled
            />
          </div> */}

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              name="classroomId"
              value={formData.classroomId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
            >
              <option value="">Select a class</option>
              {classList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Set As
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-950 bg-white"
            >
              <option value="">Select Activity</option>
              <option value="classWork">Class work</option>
              <option value="assignment">Assignment</option>
              <option value="test">Test</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            />
          </div> */}
        </div>

        {/* <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <input
              type="text"
              name="classID"
              value={formData.classID}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="100"
            />
          </div>
        </div> */}

        {/* <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              name="resourceCode"
              value={formData.resourceCode}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="Instructions for the students"
            />
          </div>
        </div> */}

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
              "Assign Experiment"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
