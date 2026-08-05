"use client";
import {
  publishLearningSpace,
  type LearningSpaceSummary,
} from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useEffect, useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";

type SortKey = "title" | "subject" | "createdBy" | "duration" | "status" | "createdAt";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "subject", label: "Subject" },
  { key: "createdBy", label: "Author" },
  { key: "duration", label: "Duration" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
];

const durationMap: Record<string, string> = {
  "0.25": "15 minutes",
  "0.5": "30 minutes",
  "0.75": "45 minutes",
  "1": "1 hour",
  "1.5": "1.5 hours",
  "2": "2 hours",
  "2.5": "2.5 hours",
  "3": "3 hours",
};

export const formatDuration = (hours?: number) => {
  if (typeof hours !== "number" || !Number.isFinite(hours)) return "—";
  return durationMap[String(hours)] ?? `${hours} hour(s)`;
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/** Tags carry the subject; a space can span more than one. */
export const subjectsOf = (space: LearningSpaceSummary): string[] => {
  const subjects = (space.tags ?? [])
    .map((tag) => tag?.subject)
    .filter((subject): subject is string => !!subject);
  return [...new Set(subjects)];
};

const statusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "published":
    case "approved":
      return "bg-green-100 text-green-600";
    case "draft":
      return "bg-yellow-100 text-yellow-700";
    case "archived":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-blue-100 text-blue-600";
  }
};

const sortValue = (
  space: LearningSpaceSummary,
  key: SortKey,
  authorNames: Record<string, string>,
): string | number => {
  if (key === "duration")
    return typeof space.duration === "number" ? space.duration : 0;
  if (key === "createdAt") {
    const time = space.createdAt ? new Date(space.createdAt).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  if (key === "subject") return subjectsOf(space).join(", ").toLowerCase();
  if (key === "createdBy")
    return (authorNames[space.createdBy] ?? space.createdBy ?? "").toLowerCase();
  return (space[key] ?? "").toString().toLowerCase();
};

interface LearningSpaceTableProps {
  spaces: LearningSpaceSummary[];
  isLoading?: boolean;
  /** createdBy id → display name, resolved by the page. */
  authorNames: Record<string, string>;
  onSpaceChanged: () => void;
}

const LearningSpaceTable = ({
  spaces,
  isLoading,
  authorNames,
  onSpaceChanged,
}: LearningSpaceTableProps) => {
  const { token } = useUser();
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "createdAt",
    direction: "desc",
  });
  const [activeSpace, setActiveSpace] = useState<LearningSpaceSummary | null>(
    null,
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) =>
      e.key === "Escape" && setActiveSpace(null);
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  const sorted = useMemo(() => {
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...spaces].sort((a, b) => {
      const left = sortValue(a, sort.key, authorNames);
      const right = sortValue(b, sort.key, authorNames);
      if (left < right) return -1 * factor;
      if (left > right) return 1 * factor;
      return 0;
    });
  }, [spaces, sort, authorNames]);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );

  const handlePublish = async () => {
    if (!activeSpace) return;
    setIsPublishing(true);
    setActionError(null);
    setNotice(null);
    try {
      await publishLearningSpace(activeSpace.id, token);
      setNotice("Learning space published.");
      onSpaceChanged();
    } catch (err) {
      console.error("Failed to publish learning space", err);
      setActionError("Could not publish this learning space. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sort.key !== column) return <FaSort className="text-gray-300" />;
    return sort.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const authorOf = (space: LearningSpaceSummary) =>
    authorNames[space.createdBy] || space.createdBy || "—";

  return (
    <div className="flex flex-col overflow-x-auto">
      <table className="w-full bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            {COLUMNS.map((column) => (
              <td key={column.key} className="p-2">
                <button
                  onClick={() => toggleSort(column.key)}
                  className="flex items-center gap-1 hover:text-gray-800"
                >
                  {column.label}
                  <SortIcon column={column.key} />
                </button>
              </td>
            ))}
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={7}>
                Loading learning spaces…
              </td>
            </tr>
          ) : !sorted.length ? (
            <tr className="text-xs">
              <td className="p-4 text-center text-gray-400" colSpan={7}>
                No learning spaces match this search
              </td>
            </tr>
          ) : (
            sorted.map((space) => (
              <tr
                className="text-xs border-b border-b-gray-200 align-top"
                key={space.id}
              >
                <td className="p-2">
                  <p className="font-medium text-gray-900">
                    {space.title || "Untitled"}
                  </p>
                  {!!space.grade && (
                    <p className="text-gray-500">Grade {space.grade}</p>
                  )}
                </td>
                <td className="p-2">{subjectsOf(space).join(", ") || "—"}</td>
                <td className="p-2 break-all">{authorOf(space)}</td>
                <td className="p-2">{formatDuration(space.duration)}</td>
                <td className="p-2">
                  <p
                    className={`p-1 px-1.5 rounded-3xl flex w-max capitalize ${statusStyle(space.status)}`}
                  >
                    {space.status || "—"}
                  </p>
                </td>
                <td className="p-2">{formatDate(space.createdAt)}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      setActiveSpace(space);
                      setActionError(null);
                      setNotice(null);
                    }}
                    aria-label={`Actions for ${space.title}`}
                    className="flex gap-1 items-center p-1 rounded hover:bg-gray-100"
                  >
                    <SlOptionsVertical />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {activeSpace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setActiveSpace(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-200 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {activeSpace.title || "Untitled"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {activeSpace.status}
                </p>
              </div>
              <button
                onClick={() => setActiveSpace(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 p-4">
              {!!activeSpace.objective && (
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Objective
                  </p>
                  <p className="text-xs text-gray-800">
                    {activeSpace.objective}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Subject
                  </p>
                  <p className="text-xs text-gray-800">
                    {subjectsOf(activeSpace).join(", ") || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Grade
                  </p>
                  <p className="text-xs text-gray-800">
                    {activeSpace.grade || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Duration
                  </p>
                  <p className="text-xs text-gray-800">
                    {formatDuration(activeSpace.duration)}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Author
                  </p>
                  <p className="text-xs text-gray-800 break-all">
                    {authorOf(activeSpace)}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Created
                  </p>
                  <p className="text-xs text-gray-800">
                    {formatDate(activeSpace.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] uppercase tracking-wide text-gray-400">
                    Updated
                  </p>
                  <p className="text-xs text-gray-800">
                    {formatDate(activeSpace.updatedAt)}
                  </p>
                </div>
              </div>

              {!!activeSpace.tags?.length && (
                <div className="flex flex-wrap gap-1">
                  {activeSpace.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-3xl bg-blue-50 px-2 py-1 text-[11px] text-blue-600"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {actionError && (
              <p className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {actionError}
              </p>
            )}
            {notice && (
              <p className="mx-4 mb-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                {notice}
              </p>
            )}

            <div className="flex flex-wrap gap-2 border-t border-gray-200 p-4">
              <button
                onClick={handlePublish}
                disabled={
                  isPublishing || activeSpace.status?.toLowerCase() !== "draft"
                }
                title={
                  activeSpace.status?.toLowerCase() !== "draft"
                    ? "Only drafts can be published"
                    : undefined
                }
                className="rounded-md bg-bgBlue px-3 py-2 text-xs text-white disabled:opacity-50"
              >
                {isPublishing ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningSpaceTable;
