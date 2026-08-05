"use client";
import { createGlobalTicket } from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { PRIORITY_OPTIONS, readError } from "./supportHelpers";

interface NewTicketModalProps {
  schools: { id: string; name: string }[];
  onClose: () => void;
  onCreated: () => void;
}

const NewTicketModal = ({
  schools,
  onClose,
  onCreated,
}: NewTicketModalProps) => {
  const { user, token } = useUser();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [schoolId, setSchoolId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!subject.trim() || !body.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await createGlobalTicket(
        {
          subject: subject.trim(),
          body: body.trim(),
          priority,
          source: "admin",
          createdByUserId: user?.userId,
          ...(schoolId && { schoolId }),
        },
        token,
      );
      onCreated();
      onClose();
    } catch (err) {
      console.error("Failed to create ticket", err);
      setError(readError(err, "Could not create the ticket. Please try again."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-900">New ticket</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-md border border-gray-300 p-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Description</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="rounded-md border border-gray-300 p-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">Priority</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-md border border-gray-300 p-2 text-sm"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-600">School (optional)</span>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">No school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!subject.trim() || !body.trim() || isSaving}
            className="rounded-md bg-bgBlue px-3 py-2 text-xs text-white disabled:opacity-50"
          >
            {isSaving ? "Creating…" : "Create ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewTicketModal;
