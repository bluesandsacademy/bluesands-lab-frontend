"use client";
import {
  addClass,
  addSchoolStudent,
  addSchoolTeacher,
  bulkUploadStudents,
  bulkUploadTeachers,
  BulkUserRecord,
} from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import React, { useState } from "react";
import { FaPlus, FaSpinner, FaTimes } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";

// Modal Component
export const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-blue-950">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const parseCSV = (text: string): BulkUserRecord[] => {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, ""));

  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] ?? ""; });
      return {
        fullName: row["fullname"] || row["full_name"] || row["name"] || "",
        email: row["email"] || "",
        phone: row["phone"] || "",
        country: row["country"] || "",
      };
    })
    .filter((r) => r.email);
};

// Bulk Upload Modal
export const BulkUploadModal = ({ isOpen, onClose, userType }: any) => {
  const { user, token } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csv = "fullName,email,phone,country\nJohn Doe,john@example.com,+2348001234567,Nigeria";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${userType.toLowerCase()}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!file) return;

    if (userType !== "Teachers" && userType !== "Students") {
      toast.error(`Bulk upload is not supported for ${userType}.`);
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const records = parseCSV(text);

      if (records.length === 0) {
        toast.error("No valid records found. Check that your CSV has the correct headers and at least one data row.");
        setIsLoading(false);
        return;
      }

      if (userType === "Teachers") {
        await bulkUploadTeachers(records, user?.schoolId, token);
      } else {
        await bulkUploadStudents(records, user?.schoolId, token);
      }

      toast.success(`${records.length} ${userType.toLowerCase()} uploaded successfully.`);
      setFile(null);
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Upload failed.";
      toast.error(<div><p className="font-semibold">Bulk upload failed</p><p>{message}</p></div>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bulk Upload ${userType}`}>
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Upload a CSV file to add multiple {userType.toLowerCase()} at once.
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop your CSV file here, or
          </p>
          <label className="inline-block">
            <span className="text-blue-950 hover:underline cursor-pointer font-medium">
              browse files
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {file && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md flex items-center justify-between">
              <p className="text-sm text-gray-700 truncate">{file.name}</p>
              <button
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-gray-600 ml-2 shrink-0"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm font-medium text-blue-950 mb-1">Required CSV columns:</p>
          <p className="text-xs text-gray-600 font-mono">fullName, email, phone, country</p>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="text-xs text-blue-950 hover:underline mt-2 block"
          >
            Download sample CSV template
          </button>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="px-4 py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin h-4 w-4" />
                <span>Uploading...</span>
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Add Teacher Modal
export const AddTeacherModal = ({ isOpen, onClose }: any) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Adding teacher:", formData);
    try {
      setIsLoading(true);
      const res = await addSchoolTeacher(formData, user?.schoolId, token);
      console.log(res);
      setIsLoading(false);
      onClose();
      toast.success("Teacher added successfully");
    } catch (error: any) {
      console.error("Error adding teacher:", error);
      setIsLoading(false);
      toast.error(<div><p className="font-semibold">Failed to add teacher</p><p>${error.message}</p></div>)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Teacher">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="Enter teacher's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="teacher@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="City, State"
            />
          </div>
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
              "Add Teacher"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Add Student Modal
export const AddStudentModal = ({ isOpen, onClose }: any) => {
  const { user, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "09000123456",
    country: "Nigeria",
    // assignClass: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Adding student:", formData);
    try {
      setIsLoading(true);
      const res = await addSchoolStudent(formData, user?.schoolId, token);
      console.log(res);
      setIsLoading(false);
      onClose();
      toast.success("Student added successfully");
    } catch (error: any) {
      console.error("Error adding student:", error);
      setIsLoading(false);
      toast.error(<div><p className="font-semibold">Failed to add Student</p><p>${error.message}</p></div>)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Student">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="Enter student's name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="student@example.com"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign Class <span className="text-red-500">*</span>
          </label>
          <select
            name="assignClass"
            value={formData.assignClass}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
          >
            <option value="">Select a class</option>
            <option value="class1">Class 1</option>
            <option value="class2">Class 2</option>
            <option value="class3">Class 3</option>
          </select>
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
              "Add Student"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Add Class Modal
export const AddClassModal = ({ isOpen, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    // description: "",
    // schedule: "",
    // capacity: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("Adding class:", formData);
    try {
      setIsLoading(true);
      const res = await addClass(formData);
      console.log(res);
      setIsLoading(false);
      onClose();
      toast.success("Class added successfully");
    } catch (error: any) {
      console.error("Error adding Class:", error);
      setIsLoading(false);
      toast.error(<div><p className="font-semibold">Failed to add Class</p><p>${error.message}</p></div>)
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Class">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="e.g., Biology 101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="e.g., Biology"
            />
          </div>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="Brief description of the class..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="e.g., Mon-Wed 10am-12pm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="30"
              min="1"
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
              "Add Class"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Add Role Modal
export const AddRoleModal = ({ isOpen, onClose }: any) => {
  const [formData, setFormData] = useState({
    roleName: "",
    roleColor: "",
    description: "",
  });

  const [permissions, setPermissions] = useState({
    viewUsers: true,
    addUsers: false,
    editUsers: false,
    deleteUsers: false,
    viewCourses: true,
    editCourses: true,
    createCourses: false,
    gradeStudent: false,
    viewAnalytics: true,
    systemSettings: true,
    manageRoles: false,
    bulkOperations: false,
    viewReports: true,
    studentRecords: true,
    financialReports: false,
    exportData: false,
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (e: any) => {
    setPermissions({ ...permissions, [e.target.name]: e.target.checked });
  };

  const handleSubmit = () => {
    console.log("Adding role:", { ...formData, permissions });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Role">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
              placeholder="e.g., Teacher"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Color
            </label>
            <select
              name="roleColor"
              id="roleColor"
              value={formData.roleColor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            >
              <option value="">Select a color</option>
              <option value="purple">Purple</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="yellow">Yellow</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
            placeholder="e.g., teaches the laboratory sessions and equipment management"
          />
        </div>

        {/* Permissions Section */}
        <div className="border-2 border-blue-950 rounded-md p-4">
          <h3 className="text-sm font-semibold text-blue-950 mb-3">
            PERMISSIONS
          </h3>

          {/* User Management */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              User Management
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="viewUsers"
                  checked={permissions.viewUsers}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                View Users
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="addUsers"
                  checked={permissions.addUsers}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Add users
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="editUsers"
                  checked={permissions.editUsers}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Edit users
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="deleteUsers"
                  checked={permissions.deleteUsers}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Delete Users
              </label>
            </div>
          </div>

          {/* Course Management */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Course Management
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="viewCourses"
                  checked={permissions.viewCourses}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                View Courses
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="editCourses"
                  checked={permissions.editCourses}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Edit Courses
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="createCourses"
                  checked={permissions.createCourses}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Create Courses
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="gradeStudent"
                  checked={permissions.gradeStudent}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Grade Student
              </label>
            </div>
          </div>

          {/* System Administration */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              System Administration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="viewAnalytics"
                  checked={permissions.viewAnalytics}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                View Analytics
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="systemSettings"
                  checked={permissions.systemSettings}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                System Settings
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="manageRoles"
                  checked={permissions.manageRoles}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Manage Roles
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="bulkOperations"
                  checked={permissions.bulkOperations}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Bulk Operations
              </label>
            </div>
          </div>

          {/* Reports & data */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Reports & data
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="viewReports"
                  checked={permissions.viewReports}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                View reports
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="studentRecords"
                  checked={permissions.studentRecords}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Student records
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="financialReports"
                  checked={permissions.financialReports}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Financial reports
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="exportData"
                  checked={permissions.exportData}
                  onChange={handlePermissionChange}
                  className="mr-2 h-4 w-4 text-blue-950 border-gray-300 rounded focus:ring-blue-950"
                />
                Export data
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900"
          >
            Create Role
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Main Component Demo
const SchoolUserManagementDemo = () => {
  const filters = ["Teachers", "Students", "Classes", "Roles & Permissions"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleBulkUpload = () => {
    setIsBulkUploadOpen(true);
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-950 mb-6">
          User Management
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-blue-950 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div
          className={`p-4 flex rounded-lg bg-white ${
            activeFilter === "Roles & Permissions"
              ? "justify-end"
              : "justify-between"
          }`}
        >
          <div
            className={`flex gap-2 items-center bg-gray-100 border border-gray-200 text-sm px-3 rounded-md ${
              activeFilter === "Roles & Permissions" && "hidden"
            }`}
          >
            <IoSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              className="bg-gray-100 p-2 outline-none"
              placeholder={
                activeFilter === "Teachers"
                  ? "Search Teachers"
                  : activeFilter === "Students"
                  ? "Search Students"
                  : activeFilter === "Classes"
                  ? "Search Classes"
                  : ""
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleBulkUpload}
              className={`flex gap-2 items-center bg-gray-200 text-blue-950 px-4 py-2 rounded-md text-sm hover:bg-gray-300 ${
                activeFilter === "Roles & Permissions" && "hidden"
              }`}
            >
              <FiUpload /> Bulk Upload
            </button>
            <button
              onClick={handleAddUser}
              className="flex gap-2 items-center bg-blue-950 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
            >
              <FaPlus />
              {activeFilter === "Teachers"
                ? "Add Teacher"
                : activeFilter === "Students"
                ? "Add Student"
                : activeFilter === "Classes"
                ? "Add Class"
                : activeFilter === "Roles & Permissions"
                ? "Create Role"
                : ""}
            </button>
          </div>
        </div>

        {/* Table Placeholder */}
        <div className="mt-6 bg-white rounded-lg p-8 text-center text-gray-500">
          {activeFilter} table content goes here...
        </div>

        {/* Modals */}
        <BulkUploadModal
          isOpen={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
          userType={activeFilter}
        />

        {activeFilter === "Teachers" && (
          <AddTeacherModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}

        {activeFilter === "Students" && (
          <AddStudentModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}

        {activeFilter === "Classes" && (
          <AddClassModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SchoolUserManagementDemo;

// "use client"
// import { addSchoolTeacher } from '@/services/dashboard-service';
// import { useUser } from '@/services/UserContext';
// import React, { useState } from 'react';
// import { FaPlus, FaTimes } from 'react-icons/fa';
// import { FiUpload } from 'react-icons/fi';
// import { IoSearch } from 'react-icons/io5';

// const {user, token} = useUser()

// // Modal Component
// export const Modal = ({ isOpen, onClose, title, children }: any) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-lg font-semibold text-blue-950">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FaTimes className="text-xl" />
//           </button>
//         </div>
//         <div className="p-6">{children}</div>
//       </div>
//     </div>
//   );
// };

// // Bulk Upload Modal
// export const BulkUploadModal = ({ isOpen, onClose, userType }: any) => {
//   const [file, setFile] = useState(null);
//   const [dragActive, setDragActive] = useState(false);

//   const handleDrag = (e: any) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: any) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       setFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleFileChange = (e: any) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = () => {
//     if (file) {
//       console.log("Uploading file:", file);
//       // Handle file upload logic here
//       onClose();
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={`Bulk Upload ${userType}`}>
//       <div className="space-y-4">
//         <div className="text-sm text-gray-600 mb-4">
//           Upload a CSV file to add multiple {userType.toLowerCase()} at once.
//         </div>

//         <div
//           className={`border-2 border-dashed rounded-lg p-8 text-center ${
//             dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
//           }`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
//           <p className="text-sm text-gray-600 mb-2">
//             Drag and drop your CSV file here, or
//           </p>
//           <label className="inline-block">
//             <span className="text-blue-950 hover:underline cursor-pointer font-medium">
//               browse files
//             </span>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>
//           {file && (
//             <div className="mt-4 p-3 bg-gray-100 rounded-md">
//               <p className="text-sm text-gray-700">Selected: {file}</p>
//             </div>
//           )}
//         </div>

//         <div className="bg-blue-50 p-4 rounded-md">
//           <p className="text-sm font-medium text-blue-950 mb-2">CSV Format:</p>
//           <p className="text-xs text-gray-600">
//             {userType === "Teachers" && "name, email, phone, location, experience, class, schedule"}
//             {userType === "Students" && "name, email, class"}
//             {userType === "Classes" && "class name, subject, description, schedule, capacity"}
//           </p>
//           <button
//             type="button"
//             className="text-xs text-blue-950 hover:underline mt-2"
//           >
//             Download sample CSV template
//           </button>
//         </div>

//         <div className="flex gap-3 justify-end pt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!file}
//             className="px-4 py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             Upload
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// // Add Teacher Modal
// export const AddTeacherModal = ({ isOpen, onClose }: any) => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     country: '',
//     // experience: '',
//     // assignClass: '',
//     // schedule: ''
//   });

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     console.log("Adding teacher:", formData);
//     const res = addSchoolTeacher(formData, user?.schoolId, token)
//     console.log(res);
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Add Teacher">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="Enter teacher's name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="teacher@example.com"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="+234 800 000 0000"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Country
//             </label>
//             <input
//               type="text"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="City, State"
//             />
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Years of Experience
//             </label>
//             <input
//               type="number"
//               name="experience"
//               value={formData.experience}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="5"
//               min="0"
//             />
//           </div> */}

//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Assign Class <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="assignClass"
//               value={formData.assignClass}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//             >
//               <option value="">Select a class</option>
//               <option value="class1">Class 1</option>
//               <option value="class2">Class 2</option>
//               <option value="class3">Class 3</option>
//             </select>
//           </div>
//         </div> */}

//         {/* <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Schedule <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="schedule"
//             value={formData.schedule}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//             placeholder="e.g., Mon-Fri 9am-5pm"
//           /> */}
//         </div>

//         <div className="flex gap-3 justify-end pt-4 border-t">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900"
//           >
//             Add Teacher
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// // Add Student Modal
// export const AddStudentModal = ({ isOpen, onClose }: any) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     assignClass: ''
//   });

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     console.log("Adding student:", formData);
//     // Handle form submission logic here
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Add Student">
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Full Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//             placeholder="Enter student's name"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email Address <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//             placeholder="student@example.com"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Assign Class <span className="text-red-500">*</span>
//           </label>
//           <select
//             name="assignClass"
//             value={formData.assignClass}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//           >
//             <option value="">Select a class</option>
//             <option value="class1">Class 1</option>
//             <option value="class2">Class 2</option>
//             <option value="class3">Class 3</option>
//           </select>
//         </div>

//         <div className="flex gap-3 justify-end pt-4 border-t">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900"
//           >
//             Add Student
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// // Add Class Modal
// export const AddClassModal = ({ isOpen, onClose }: any) => {
//   const [formData, setFormData] = useState({
//     className: '',
//     subject: '',
//     description: '',
//     schedule: '',
//     capacity: ''
//   });

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     console.log("Adding class:", formData);
//     // Handle form submission logic here
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Add Class">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Class Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="className"
//               value={formData.className}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="e.g., Biology 101"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Subject <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="subject"
//               value={formData.subject}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="e.g., Biology"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//             placeholder="Brief description of the class..."
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Schedule <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="schedule"
//               value={formData.schedule}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="e.g., Mon-Wed 10am-12pm"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Capacity <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               name="capacity"
//               value={formData.capacity}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
//               placeholder="30"
//               min="1"
//             />
//           </div>
//         </div>

//         <div className="flex gap-3 justify-end pt-4 border-t">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 text-sm bg-blue-950 text-white rounded-md hover:bg-blue-900"
//           >
//             Add Class
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// // Main Component Demo
// const SchoolUserManagementDemo = () => {
//   const filters = ["Teachers", "Students", "Classes", "Roles & Permissions"];
//   const [activeFilter, setActiveFilter] = useState(filters[0]);
//   const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const handleBulkUpload = () => {
//     setIsBulkUploadOpen(true);
//   };

//   const handleAddUser = () => {
//     setIsAddModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold text-blue-950 mb-6">User Management</h1>

//         {/* Filter Buttons */}
//         <div className="flex gap-2 mb-6 overflow-x-auto">
//           {filters.map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setActiveFilter(filter)}
//               className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
//                 activeFilter === filter
//                   ? "bg-blue-950 text-white"
//                   : "bg-white text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               {filter}
//             </button>
//           ))}
//         </div>

//         {/* Action Bar */}
//         <div
//           className={`p-4 flex rounded-lg bg-white ${
//             activeFilter === "Roles & Permissions"
//               ? "justify-end"
//               : "justify-between"
//           }`}
//         >
//           <div
//             className={`flex gap-2 items-center bg-gray-100 border border-gray-200 text-sm px-3 rounded-md ${
//               activeFilter === "Roles & Permissions" && "hidden"
//             }`}
//           >
//             <IoSearch className="text-gray-400 text-lg" />
//             <input
//               type="text"
//               className="bg-gray-100 p-2 outline-none"
//               placeholder={
//                 activeFilter === "Teachers"
//                   ? "Search Teachers"
//                   : activeFilter === "Students"
//                   ? "Search Students"
//                   : activeFilter === "Classes"
//                   ? "Search Classes"
//                   : ""
//               }
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <button
//               onClick={handleBulkUpload}
//               className={`flex gap-2 items-center bg-gray-200 text-blue-950 px-4 py-2 rounded-md text-sm hover:bg-gray-300 ${
//                 activeFilter === "Roles & Permissions" && "hidden"
//               }`}
//             >
//               <FiUpload /> Bulk Upload
//             </button>
//             <button
//               onClick={handleAddUser}
//               className="flex gap-2 items-center bg-blue-950 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-900"
//             >
//               <FaPlus />
//               {activeFilter === "Teachers"
//                 ? "Add Teacher"
//                 : activeFilter === "Students"
//                 ? "Add Student"
//                 : activeFilter === "Classes"
//                 ? "Add Class"
//                 : activeFilter === "Roles & Permissions"
//                 ? "Create Role"
//                 : ""}
//             </button>
//           </div>
//         </div>

//         {/* Table Placeholder */}
//         <div className="mt-6 bg-white rounded-lg p-8 text-center text-gray-500">
//           {activeFilter} table content goes here...
//         </div>

//         {/* Modals */}
//         <BulkUploadModal
//           isOpen={isBulkUploadOpen}
//           onClose={() => setIsBulkUploadOpen(false)}
//           userType={activeFilter}
//         />

//         {activeFilter === "Teachers" && (
//           <AddTeacherModal
//             isOpen={isAddModalOpen}
//             onClose={() => setIsAddModalOpen(false)}
//           />
//         )}

//         {activeFilter === "Students" && (
//           <AddStudentModal
//             isOpen={isAddModalOpen}
//             onClose={() => setIsAddModalOpen(false)}
//           />
//         )}

//         {activeFilter === "Classes" && (
//           <AddClassModal
//             isOpen={isAddModalOpen}
//             onClose={() => setIsAddModalOpen(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// // export default SchoolUserManagementDemo
