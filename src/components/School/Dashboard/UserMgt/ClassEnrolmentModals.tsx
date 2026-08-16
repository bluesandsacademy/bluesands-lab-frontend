"use client";
import {
  changeClassEnrolment,
  enrollInClass,
  type ClassEnrolmentRole,
  type SchoolClass,
  type SchoolUser,
} from "@/services/schoolAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

export type EnrolmentMode = "assign" | "change";

const readError = (err: unknown, fallback: string) => {
  const data = (err as { response?: { data?: unknown } })?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  const message = (data as { message?: string })?.message;
  return message || fallback;
};

const Shell = ({
  title,
  subtitle,
  onClose,
  children,
  wide,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) => {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? "max-w-lg" : "max-w-xs"} max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-200 p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </p>
            {!!subtitle && (
              <p className="text-xs text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Step one: the small menu shown when the row's options button is clicked. */
export const UserActionMenu = ({
  user,
  onSelect,
  onClose,
}: {
  user: SchoolUser;
  onSelect: (mode: EnrolmentMode) => void;
  onClose: () => void;
}) => (
  <Shell
    title={user.fullName || "Unnamed user"}
    subtitle={user.email}
    onClose={onClose}
  >
    <div className="flex flex-col p-2">
      <button
        onClick={() => onSelect("assign")}
        className="rounded-md px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
      >
        Assign to a class
      </button>
      <button
        onClick={() => onSelect("change")}
        className="rounded-md px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
      >
        Change class
      </button>
    </div>
  </Shell>
);

interface ClassEnrolmentModalProps {
  user: SchoolUser;
  role: ClassEnrolmentRole;
  mode: EnrolmentMode;
  classes: SchoolClass[];
  isLoadingClasses?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/** Step two: pick the class(es) and submit. */
export const ClassEnrolmentModal = ({
  user,
  role,
  mode,
  classes,
  isLoadingClasses,
  onClose,
  onSuccess,
}: ClassEnrolmentModalProps) => {
  const { token } = useUser();
  const [classId, setClassId] = useState("");
  const [oldClassId, setOldClassId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isChange = mode === "change";
  const canSubmit = isChange
    ? !!oldClassId && !!classId && oldClassId !== classId
    : !!classId;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSaving(true);
    setError(null);
    try {
      if (isChange) {
        await changeClassEnrolment(
          oldClassId,
          { email: user.email, newClassId: classId, role },
          token,
        );
        toast.success(`${user.fullName || user.email} moved to the new class.`);
      } else {
        await enrollInClass(classId, { email: user.email, role }, token);
        toast.success(`${user.fullName || user.email} assigned to the class.`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(`Class ${mode} failed`, err);
      setError(
        readError(
          err,
          isChange
            ? "Could not change the class. Please try again."
            : "Could not assign the class. Please try again.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const classOptions = (exclude?: string) =>
    classes
      .filter((row) => row.id !== exclude)
      .map((row) => (
        <option key={row.id} value={row.id}>
          {row.name}
          {row.subject ? ` — ${row.subject}` : ""}
        </option>
      ));

  return (
    <Shell
      wide
      title={isChange ? "Change class" : "Assign to a class"}
      subtitle={`${user.fullName || "Unnamed user"} · ${user.email}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 p-4">
        <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
          Enrolling as <span className="font-semibold">{role}</span>.
        </p>

        {isLoadingClasses ? (
          <p className="text-xs text-gray-400">Loading classes…</p>
        ) : !classes.length ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            No classes exist yet. Create a class first.
          </p>
        ) : (
          <>
            {isChange && (
              <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-600">Current class</span>
                <select
                  value={oldClassId}
                  onChange={(e) => setOldClassId(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 text-sm"
                >
                  <option value="">Select their current class</option>
                  {classOptions(classId)}
                </select>
              </label>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-600">
                {isChange ? "New class" : "Class"}
              </span>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="rounded-md border border-gray-300 p-2 text-sm"
              >
                <option value="">Select a class</option>
                {classOptions(isChange ? oldClassId : undefined)}
              </select>
            </label>
          </>
        )}

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
          disabled={!canSubmit || isSaving}
          className="flex items-center gap-2 rounded-md bg-blue-950 px-3 py-2 text-xs text-white disabled:opacity-50"
        >
          {isSaving && <FaSpinner className="animate-spin" />}
          {isSaving ? "Saving…" : isChange ? "Move to class" : "Assign"}
        </button>
      </div>
    </Shell>
  );
};
