"use client";
import { useEffect, useState } from "react";
// import Link from "next/link";
import { resetPassword } from "@/services/auth-service";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import router from "next/router";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPasswordMatch(
      formData.newPassword !== "" &&
        formData.confirmPassword !== "" &&
        formData.newPassword === formData.confirmPassword,
    );
  }, [formData.newPassword, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await resetPassword(
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
          //   remember to handle this token when backend updates the server it should come as response from forgotpassword then pass here as token not as parameter
          token: "",
        },
        // token
      );

      toast.success("Password changed successfully, proceed to login");

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      //re-route to login page
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(
        <div>
          <p className="font-semibold">Failed to reset password</p>
          <p>{error?.message || "Something went wrong"}</p>
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title =
      "Reset Password | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  return (
    <>
      <section className="min-h-screen p-3 mb-10">
        <div className="w-full flex justify-center relative z-0">
          <img
            src="/images/bg/cover.png"
            className="w-full object-contain z-0"
            alt=""
          />
          <div className="absolute text-center text-white max-w-lg md:bottom-36 bottom-5 lg:space-y-3">
            <h1 className="text-lg md:text-2xl lg:text-4xl font-normal">
              Reset Password
            </h1>
            <p className="font-thin text-sm lg:text-lg md:max-w-lg max-w-xs">
              Please enter your new password.
            </p>
          </div>
        </div>
        <form className="border max-w-2xl mx-auto flex flex-col gap-y-3 md:gap-y-5 py-5 px-5 lg:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white">
          <div className="flex flex-col w-full gap-y-2 lg:gap-y-4">
            <label
              htmlFor="newPassword"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              New Password
            </label>
            <input
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              type="password"
              className="rounded-md border px-3 py-2 md:py-3 w-full text-gray-600"
              id="newPassword"
              required
            />

            <label
              htmlFor="confirmPassword"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              className={`rounded-md border px-3 py-2 md:py-3 w-full text-gray-600 ${
                formData.confirmPassword && !passwordMatch
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              id="confirmPassword"
              required
            />
            {formData.confirmPassword && !passwordMatch && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <div className="w-full flex flex-col gap-y-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!passwordMatch || isLoading}
              className={
                !passwordMatch || isLoading
                  ? `bg-gray-400 cursor-not-allowed  rounded-md py-2 md:py-3 text-white text-sm md:text-lg`
                  : `text-center flex justify-center  rounded-md py-2 md:py-3 bg-bgBlue text-white w-full text-sm md:text-lg`
              }
            >
              {isLoading ? (
                <FaSpinner className="text-lg md:text-xl lg:text-3xl text-white animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
