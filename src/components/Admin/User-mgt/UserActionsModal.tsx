"use client";
import {
  activateGlobalUser,
  deactivateGlobalUser,
  resetGlobalUserPassword,
  updateGlobalUserRole,
  type GlobalUser,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

/**
 * PUT /users/{id}/role expects a role GUID, but no endpoint exposes the
 * name → id mapping yet. Fill this in (or replace it with a fetched roles
 * list) and the role selector below turns itself on — nothing else changes.
 */
export const ROLE_IDS: Record<string, string> = {};

const ROLE_OPTIONS = ["GlobalAdmin", "SchoolAdmin", "Teacher", "Student"];

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const readError = (err: unknown, fallback: string) => {
  const response = (err as { response?: { data?: unknown } })?.response?.data;
  if (typeof response === "string" && response.trim()) return response;
  const message = (response as { message?: string })?.message;
  if (message) return message;
  return fallback;
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
    <p className="text-xs text-gray-800 break-words">{value}</p>
  </div>
);

interface UserActionsModalProps {
  user: GlobalUser;
  onClose: () => void;
  /** Refetch the list after a mutation lands. */
  onUserChanged: () => void;
}

const UserActionsModal = ({
  user,
  onClose,
  onUserChanged,
}: UserActionsModalProps) => {
  const { token } = useUser();

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState(user.roleName ?? "");

  const roleId = ROLE_IDS[selectedRole];
  const roleUnchanged = selectedRole === user.roleName;
  const rolesConfigured = Object.keys(ROLE_IDS).length > 0;

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose]);

  const run = async (
    action: string,
    fn: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setBusy(action);
    setError(null);
    setNotice(null);
    try {
      await fn();
      setNotice(successMessage);
      onUserChanged();
    } catch (err) {
      console.error(`User action "${action}" failed`, err);
      setError(readError(err, `Could not ${action}. Please try again.`));
    } finally {
      setBusy(null);
    }
  };

  const handleToggleActive = () =>
    run(
      user.isActive ? "deactivate user" : "activate user",
      () =>
        user.isActive
          ? deactivateGlobalUser(user.id, token)
          : activateGlobalUser(user.id, token),
      user.isActive ? "User deactivated." : "User activated.",
    );

  const handleResetPassword = async () => {
    setBusy("reset password");
    setError(null);
    setNotice(null);
    setTempPassword(null);
    try {
      const result = await resetGlobalUserPassword(user.id, token);
      // Documented as text/plain but shaped like JSON — tolerate both.
      const parsed =
        typeof result === "string"
          ? (JSON.parse(result) as { temporaryPassword?: string })
          : result;
      setTempPassword(parsed?.temporaryPassword ?? "(not returned)");
      setNotice("Password reset. Share the temporary password securely.");
    } catch (err) {
      console.error("Password reset failed", err);
      setError(readError(err, "Could not reset password. Please try again."));
    } finally {
      setBusy(null);
    }
  };

  const handleRoleChange = () => {
    if (!roleId) return;
    run(
      "change role",
      () => updateGlobalUserRole(user.id, { roleId }, token),
      `Role changed to ${selectedRole}.`,
    );
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
        <div className="flex items-start justify-between border-b border-gray-200 p-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.fullName || "Unnamed user"}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4">
          <Detail label="Role" value={user.roleName || "—"} />
          <Detail label="School" value={user.schoolName || "—"} />
          <Detail label="Status" value={user.isActive ? "Active" : "Inactive"} />
          <Detail
            label="Email verified"
            value={user.isEmailVerified ? "Verified" : "Unverified"}
          />
          <Detail label="Created" value={formatDateTime(user.dateCreated)} />
          <Detail label="Last login" value={formatDateTime(user.lastLogin)} />
        </div>

        {error && (
          <p className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="mx-4 mb-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            {notice}
          </p>
        )}
        {tempPassword && (
          <div className="mx-4 mb-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              Temporary password
            </p>
            <p className="font-mono text-xs text-gray-900 break-all">
              {tempPassword}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleToggleActive}
              disabled={busy !== null}
              className={`rounded-md px-3 py-2 text-xs text-white disabled:opacity-50 ${
                user.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {busy === "activate user" || busy === "deactivate user"
                ? "Working…"
                : user.isActive
                  ? "Deactivate user"
                  : "Activate user"}
            </button>

            <button
              onClick={handleResetPassword}
              disabled={busy !== null}
              className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {busy === "reset password" ? "Working…" : "Reset password"}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="role-select"
              className="text-[11px] uppercase tracking-wide text-gray-400"
            >
              Change role
            </label>
            <div className="flex gap-2">
              <select
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={!rolesConfigured || busy !== null}
                className="flex-1 rounded-md border border-gray-300 p-2 text-xs disabled:bg-gray-50 disabled:text-gray-400"
              >
                {!ROLE_OPTIONS.includes(selectedRole) && selectedRole && (
                  <option value={selectedRole}>{selectedRole}</option>
                )}
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRoleChange}
                disabled={!roleId || roleUnchanged || busy !== null}
                className="rounded-md bg-bgBlue px-3 py-2 text-xs text-white disabled:opacity-50"
              >
                {busy === "change role" ? "Working…" : "Apply"}
              </button>
            </div>
            {!rolesConfigured && (
              <p className="text-[11px] text-amber-700">
                Role changes are disabled until the backend exposes role IDs.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActionsModal;
