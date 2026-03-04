"use client";
import { changePassword } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useUser();

  useEffect(() => {
    setPasswordMatch(
      formData.newPassword !== "" &&
        formData.confirmPassword !== "" &&
        formData.newPassword === formData.confirmPassword
    );
  }, [formData.newPassword, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordMatch) return;

    try {
      setIsLoading(true);

      await changePassword(
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        token
      );

      toast.success("Password changed successfully");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error: any) {
      toast.error(
        <div>
          <p className="font-semibold">Failed to change password</p>
          <p>{error?.message || "Something went wrong"}</p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-3 flex flex-col gap-6 md:gap-8 lg:gap-12 bg-white p-4 lg:p-12 rounded-md shadow-sm">
      <h2
        className={`text-base md:text-lg lg:text-xl font-semibold ${
          user?.role?.toLowerCase() === "schooladmin"
            ? "text-blue-950"
            : user?.role?.toLowerCase() === "teacher"
            ? "text-[#263238]"
            : "text-bgBlue"
        }`}
      >
        Security Settings
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="rounded-md border px-3 py-2 w-full text-gray-700 text-sm"
            required
          />
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="rounded-md border px-3 py-2 w-full text-gray-700 text-sm"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`rounded-md border px-3 py-2 w-full text-sm ${
              formData.confirmPassword && !passwordMatch
                ? "border-red-500"
                : "border-gray-300"
            } text-gray-700`}
            required
          />
          {formData.confirmPassword && !passwordMatch && (
            <p className="text-red-500 text-xs mt-1">
              Passwords do not match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!passwordMatch || isLoading}
          className={`p-2 rounded-md text-sm font-medium flex items-center justify-center ${
            passwordMatch && !isLoading
              ? user?.role?.toLowerCase() === "schooladmin"
                ? "bg-blue-950 text-white"
                : user?.role?.toLowerCase() === "teacher"
                ? "bg-[#263238] text-white"
                : "bg-bgBlue text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;