"use client";
import { useEffect, useState } from "react";
// import Link from "next/link";
import { forgotPassword } from "@/services/auth-service";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function isValidEmail(email: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isValidEmail(formData.email)){
        try {
      setIsLoading(true);

      await forgotPassword(
        {
          email: formData.email,
        },
        // token
      );

      toast.success("Request sent. Check your mail for reset link");

      // Reset form
      setFormData({
        email: "",
      });
    } catch (error: any) {
      toast.error(
        <div>
          <p className="font-semibold">Failed to send request</p>
          <p>{error?.message || "Something went wrong"}</p>
        </div>,
      );
    } finally {
      setIsLoading(false);
    }
    } else {
        toast.error("Invalid email, please verify that email entered is correct")
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
          <div className="absolute text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-3">
            <h1 className="text-2xl md:text-4xl font-normal">Reset Password</h1>
            <p className="font-thin md:text-lg text-sm md:max-w-lg max-w-xs">
              Please enter your details to receive a link for
              resetting your password.
            </p>
          </div>
        </div>
        <form className="border max-w-2xl mx-auto flex flex-col gap-y-5 py-5 px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white">
          <div className="flex flex-col w-full gap-y-4">
            <label
              htmlFor="emailAddress"
              className="font-medium text-gray-700 text-md"
            >
              Email Address
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
              className="rounded-md border px-3 py-3 w-full text-gray-600"
              id="emailAddress"
            />
          </div>
          <div className="w-full flex flex-col gap-y-3">
            <button
              type="button"
              onClick={handleSubmit}
              className={
                !formData.email
                  ? `bg-gray-400 cursor-not-allowed  rounded-md py-3 text-white text-lg`
                  : `text-center flex justify-center  rounded-md py-3 bg-bgBlue text-white w-full text-lg`
              }
              disabled={!formData.email}
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
