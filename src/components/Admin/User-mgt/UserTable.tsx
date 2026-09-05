"use client";
import type { GlobalUser } from "@/services/globalAdminDashboardService";
import { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import UserActionsModal from "./UserActionsModal";

export type SortKey =
  | "fullName"
  | "roleName"
  | "schoolName"
  | "isActive"
  | "dateCreated"
  | "lastLogin";

interface SortState {
  key: SortKey;
  direction: "asc" | "desc";
}

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "fullName", label: "User" },
  { key: "roleName", label: "Role" },
  { key: "schoolName", label: "School" },
  { key: "isActive", label: "Status" },
  // { key: "dateCreated", label: "Created" },
  // { key: "lastLogin", label: "Last Login" },
];

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

/** Dates sort chronologically, booleans by truthiness, everything else by label. */
const sortValue = (user: GlobalUser, key: SortKey): string | number => {
  if (key === "isActive") return user.isActive ? 1 : 0;
  if (key === "dateCreated" || key === "lastLogin") {
    const raw = user[key];
    const time = raw ? new Date(raw).getTime() : 0;
    return Number.isNaN(time) ? 0 : time;
  }
  return (user[key] ?? "").toString().toLowerCase();
};

interface UserTableProps {
  users: GlobalUser[];
  isLoading?: boolean;
  onUserChanged: () => void;
}

const UserTable = ({ users, isLoading, onUserChanged }: UserTableProps) => {
  const [sort, setSort] = useState<SortState>({
    key: "dateCreated",
    direction: "desc",
  });
  const [activeUser, setActiveUser] = useState<GlobalUser | null>(null);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );

  const sortedUsers = useMemo(() => {
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...users].sort((a, b) => {
      const left = sortValue(a, sort.key);
      const right = sortValue(b, sort.key);
      if (left < right) return -1 * factor;
      if (left > right) return 1 * factor;
      return 0;
    });
  }, [users, sort]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sort.key !== column) return <FaSort className="text-gray-300" />;
    return sort.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="flex flex-col gap-2">
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
                  Loading users…
                </td>
              </tr>
            ) : !sortedUsers.length ? (
              <tr className="text-xs">
                <td className="p-4 text-center text-gray-400" colSpan={7}>
                  No users match this search
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-xs border-b border-b-gray-200 align-top"
                >
                  <td className="p-2">
                    <p className="font-medium text-gray-900">
                      {user.fullName || "—"}
                    </p>
                    <p className="text-gray-500">{user.email}</p>
                  </td>
                  <td className="p-2">{user.roleName || "—"}</td>
                  <td className="p-2">{user.schoolName || "—"}</td>
                  <td className="p-2">
                    <div className="flex flex-col gap-1">
                      <p
                        className={`p-1 px-1.5 rounded-3xl flex w-max ${
                          user.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </p>
                      {!user.isEmailVerified && (
                        <p className="p-1 px-1.5 rounded-3xl bg-yellow-100 text-yellow-700 flex w-max">
                          Unverified
                        </p>
                      )}
                    </div>
                  </td>
                  {/* <td className="p-2">{formatDate(user.dateCreated)}</td>
                  <td className="p-2">{formatDate(user.lastLogin)}</td> */}
                  <td className="p-2">
                    <button
                      onClick={() => setActiveUser(user)}
                      aria-label={`Actions for ${user.fullName || user.email}`}
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
      </div>

      {/* <p className="text-[11px] text-gray-400">
        Sorting applies to the users on this page.
      </p> */}

      {activeUser && (
        <UserActionsModal
          user={activeUser}
          onClose={() => setActiveUser(null)}
          onUserChanged={onUserChanged}
        />
      )}
    </div>
  );
};

export default UserTable;
