/**
 * The tickets API documents `status` and `priority` as free-text strings with
 * no enum, so these lists are the frontend's working set. Comparisons are
 * case-insensitive everywhere to survive whatever casing the backend returns.
 */
export const STATUS_OPTIONS = ["Open", "Pending", "Resolved", "Closed"];
export const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

export const ALL_STATUSES = "All";
export const ALL_PRIORITIES = "All";
export const ALL_SCHOOLS = "All Schools";

export const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

export const priorityStyle = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "critical":
      return "bg-red-100 text-red-600";
    case "high":
      return "bg-amber-100 text-amber-700";
    case "medium":
      return "bg-blue-100 text-blue-600";
    case "low":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

export const statusStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "bg-blue-100 text-blue-600";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "resolved":
      return "bg-green-100 text-green-600";
    case "closed":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
};

/** "2h ago" style label; falls back to a date once past a week. */
export const timeAgo = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value?: string) => {
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

export const readError = (err: unknown, fallback: string) => {
  const response = (err as { response?: { data?: unknown } })?.response?.data;
  if (typeof response === "string" && response.trim()) return response;
  const message = (response as { message?: string })?.message;
  return message || fallback;
};
