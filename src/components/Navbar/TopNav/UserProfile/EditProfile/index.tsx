"use client";

import { updateProfile } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import { countries } from "@/lib/data";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    country: user?.country ?? "",
    gender: user?.gender ?? "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await updateProfile(formData);
      // Merge response back into user context
      setUser({
        ...user!,
        fullName: updated.fullName,
        phone: updated.phone,
        country: updated.country,
        gender: updated.gender,
      });
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Update failed.";
      toast.error(<div><p className="font-semibold">Failed to update profile</p><p>{message}</p></div>);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonColor =
    user?.role === "schoolAdmin" || user?.role === "SchoolAdmin"
      ? "bg-blue-950"
      : user?.role === "teacher" || user?.role === "Teacher"
      ? "bg-[#263238]"
      : "bg-bgBlue";

  return (
    <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-12 rounded-md">
      <p className="text-sm md:text-base lg:text-lg font-semibold text-bgBlue">
        Profile Information
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
          <label htmlFor="fullName" className="font-medium text-gray-700 text-sm md:text-md">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
            placeholder="Enter your full name"
          />
        </div>

        <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
          <label htmlFor="email" className="font-medium text-gray-700 text-sm md:text-md">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={user?.email ?? ""}
            disabled
            className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-400 text-sm md:text-base bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400">Email cannot be changed here.</p>
        </div>

        <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
          <label htmlFor="phone" className="font-medium text-gray-700 text-sm md:text-md">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base"
            placeholder="+234 800 000 0000"
          />
        </div>

        <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
          <label htmlFor="country" className="font-medium text-gray-700 text-sm md:text-md">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base bg-white"
          >
            {countries.map((c) => (
              <option key={c} value={c === "--select--" ? "" : c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full gap-y-1 md:gap-2 lg:gap-y-4">
          <label htmlFor="gender" className="font-medium text-gray-700 text-sm md:text-md">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="rounded-md border px-2 md:px-3 py-1 lg:py-2 w-full text-gray-600 text-sm md:text-base bg-white"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div className="flex gap-2 lg:gap-4 mx-auto w-full">
          <button
            type="submit"
            disabled={isLoading}
            className={`${buttonColor} w-full p-1 lg:p-2 text-white rounded-md text-xs lg:text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin h-3 w-3" />
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
