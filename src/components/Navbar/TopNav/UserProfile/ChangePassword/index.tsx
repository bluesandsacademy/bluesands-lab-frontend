"use client";
import { useUser } from "@/services/UserContext";
import React, { useState, useEffect } from "react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setPasswordMatch(
      newPassword !== "" &&
        confirmPassword !== "" &&
        newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password change submitted!");
  };

  return (
    <div className="m-3 flex flex-col gap-6 md:gap-8 lg:gap-12 bg-white p-4 lg:p-12 rounded-md shadow-sm">
      <h2 className={`text-base md:text-lg lg:text-xl font-semibold ${user?.role === "schoolAdmin" || user?.role === "SchoolAdmin" ? 'text-blue-950': user?.role === "teacher" || user?.role === "Teacher" ? 'text-[#263238]': 'text-bgBlue'}`}>
        Security Settings
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="oldPassword"
            className="text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="rounded-md border px-3 py-2 w-full text-gray-700 text-sm"
            required
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="rounded-md border px-3 py-2 w-full text-gray-700 text-sm"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`rounded-md border px-3 py-2 w-full text-sm ${
              confirmPassword && !passwordMatch
                ? "border-red-500"
                : "border-gray-300"
            } text-gray-700`}
            required
            aria-invalid={!passwordMatch}
          />
          {confirmPassword && !passwordMatch && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!passwordMatch}
          className={`w-full p-2 rounded-md text-sm font-medium ${
            passwordMatch
              ? user?.role === "schoolAdmin" || user?.role === "SchoolAdmin"
                ? "bg-blue-950 text-white"
                : user?.role === "teacher" || user?.role === "Teacher"
                ? "bg-[#263238] text-white"
                : "bg-bgBlue text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
