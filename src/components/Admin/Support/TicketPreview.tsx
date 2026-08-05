"use client";
import {
  addGlobalTicketComment,
  deleteGlobalTicket,
  updateGlobalTicket,
  type GlobalTicket,
  type GlobalUser,
} from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useEffect, useState } from "react";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  formatDateTime,
  priorityStyle,
  readError,
  statusStyle,
} from "./supportHelpers";

interface TicketPreviewProps {
  ticket: GlobalTicket | null;
  isLoading?: boolean;
  schoolNames: Record<string, string>;
  requesterLabels: Record<string, string>;
  assignees: GlobalUser[];
  /** Refresh both the list and the open ticket after a mutation. */
  onTicketChanged: () => void;
  onTicketDeleted: () => void;
}

const TicketPreview = ({
  ticket,
  isLoading,
  schoolNames,
  requesterLabels,
  assignees,
  onTicketChanged,
  onTicketDeleted,
}: TicketPreviewProps) => {
  const { user, token } = useUser();

  const [mode, setMode] = useState<"reply" | "assign">("reply");
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Reset the composer whenever a different ticket is opened.
  useEffect(() => {
    setMode("reply");
    setReplyText("");
    setNoteText("");
    setAssignee(ticket?.assignedToUserId ?? "");
    setError(null);
    setNotice(null);
  }, [ticket?.id, ticket?.assignedToUserId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-5">
        <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
        <p className="text-xs text-gray-400">Loading ticket…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-5">
        <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
        <p className="text-xs text-gray-400">
          Select a ticket to see its conversation
        </p>
      </div>
    );
  }

  const run = async (
    action: string,
    fn: () => Promise<unknown>,
    successMessage: string,
    after: () => void = onTicketChanged,
  ) => {
    setBusy(action);
    setError(null);
    setNotice(null);
    try {
      await fn();
      setNotice(successMessage);
      after();
    } catch (err) {
      console.error(`Ticket action "${action}" failed`, err);
      setError(readError(err, `Could not ${action}. Please try again.`));
    } finally {
      setBusy(null);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    run(
      "send reply",
      () =>
        addGlobalTicketComment(
          ticket.id,
          { userId: user?.userId, body: replyText.trim(), isPrivate: false },
          token,
        ),
      "Reply sent.",
    ).then(() => setReplyText(""));
  };

  const handleNote = () => {
    if (!noteText.trim()) return;
    run(
      "save note",
      () =>
        addGlobalTicketComment(
          ticket.id,
          { userId: user?.userId, body: noteText.trim(), isPrivate: true },
          token,
        ),
      "Internal note saved.",
    ).then(() => setNoteText(""));
  };

  const handleAssign = () => {
    if (!assignee) return;
    run(
      "assign ticket",
      () =>
        updateGlobalTicket(ticket.id, { assignedToUserId: assignee }, token),
      "Ticket assigned.",
    );
  };

  const handleFieldUpdate = (field: "status" | "priority", value: string) =>
    run(
      `update ${field}`,
      () => updateGlobalTicket(ticket.id, { [field]: value }, token),
      `Ticket ${field} updated.`,
    );

  const handleDelete = () => {
    if (!window.confirm("Delete this ticket? This cannot be undone.")) return;
    run(
      "delete ticket",
      () => deleteGlobalTicket(ticket.id, token),
      "Ticket deleted.",
      onTicketDeleted,
    );
  };

  const school = ticket.schoolId ? schoolNames[ticket.schoolId] : undefined;
  const requester = ticket.createdByUserId
    ? requesterLabels[ticket.createdByUserId]
    : undefined;
  const subtitle = [school, requester].filter(Boolean).join(" · ");

  const comments = ticket.comments ?? [];

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-5">
      <h2 className="text-xl font-semibold text-gray-900">Preview</h2>

      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold text-gray-900">
          {ticket.subject || "Untitled ticket"}
        </p>
        {!!subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] ${priorityStyle(ticket.priority)}`}
          >
            {ticket.priority || "No priority"}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] ${statusStyle(ticket.status)}`}
          >
            {ticket.status || "No status"}
          </span>
          <span className="text-[11px] text-gray-400">
            {formatDateTime(ticket.dateCreated)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700">Conversation</p>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {ticket.body || "No message body"}
          </p>
        </div>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-lg border p-3 ${
              comment.isPrivate
                ? "border-amber-200 bg-amber-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] text-gray-500">
                {comment.userName || "Agent"}
                {comment.isPrivate && " · internal note"}
              </p>
              <p className="text-[11px] text-gray-400">
                {formatDateTime(comment.dateCreated)}
              </p>
            </div>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {comment.body}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {notice}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700">Actions</p>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("reply")}
            className={`rounded-md px-4 py-2 text-sm ${
              mode === "reply"
                ? "bg-bgBlue text-white"
                : "border border-gray-300 text-gray-700"
            }`}
          >
            Reply
          </button>
          <button
            onClick={() => setMode("assign")}
            className={`rounded-md px-4 py-2 text-sm ${
              mode === "assign"
                ? "bg-bgBlue text-white"
                : "border border-gray-300 text-gray-700"
            }`}
          >
            Assign
          </button>
        </div>

        {mode === "reply" ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply to the requester"
              rows={4}
              className="w-full rounded-md border border-gray-300 p-3 text-sm"
            />
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || busy !== null}
              className="self-end rounded-md bg-bgBlue px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {busy === "send reply" ? "Sending…" : "Send reply"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              aria-label="Assign to"
              className="w-full rounded-md border border-gray-300 p-2.5 text-sm"
            >
              <option value="">Unassigned</option>
              {assignees.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.fullName || admin.email}
                </option>
              ))}
            </select>
            <button
              onClick={handleAssign}
              disabled={!assignee || busy !== null}
              className="self-end rounded-md bg-bgBlue px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {busy === "assign ticket" ? "Assigning…" : "Assign"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-gray-400">
            Status
          </span>
          <select
            value={ticket.status ?? ""}
            onChange={(e) => handleFieldUpdate("status", e.target.value)}
            disabled={busy !== null}
            className="rounded-md border border-gray-300 p-2 text-xs"
          >
            {!STATUS_OPTIONS.some(
              (s) => s.toLowerCase() === ticket.status?.toLowerCase(),
            ) &&
              !!ticket.status && (
                <option value={ticket.status}>{ticket.status}</option>
              )}
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-gray-400">
            Priority
          </span>
          <select
            value={ticket.priority ?? ""}
            onChange={(e) => handleFieldUpdate("priority", e.target.value)}
            disabled={busy !== null}
            className="rounded-md border border-gray-300 p-2 text-xs"
          >
            {!PRIORITY_OPTIONS.some(
              (p) => p.toLowerCase() === ticket.priority?.toLowerCase(),
            ) &&
              !!ticket.priority && (
                <option value={ticket.priority}>{ticket.priority}</option>
              )}
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-700">Add internal note</p>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Private note to agents"
          rows={5}
          className="w-full rounded-md border border-gray-300 p-3 text-sm"
        />
        <button
          onClick={handleNote}
          disabled={!noteText.trim() || busy !== null}
          className="self-end rounded-md bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {busy === "save note" ? "Saving…" : "Save note"}
        </button>
      </div>

      <button
        onClick={handleDelete}
        disabled={busy !== null}
        className="self-start text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        {busy === "delete ticket" ? "Deleting…" : "Delete ticket"}
      </button>
    </div>
  );
};

export default TicketPreview;
