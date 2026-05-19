"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import NProgress from "nprogress";
import { countries, genderOptions } from "@/lib/data";
import { UserObject, registerNewUser } from "@/services/auth-service";
import { toast } from "react-toastify";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterIndividualAccount() {
  useEffect(() => {
    document.title =
      "Create your Account | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const payload: UserObject = {
    fullName,
    email,
    phone,
    dob,
    gender,
    country,
    password,
    couponCode,
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submitting state to true
    NProgress.start(); 

    try {
      await registerNewUser(payload);
      setShowModal(true);
      toast.success(
        "User created successfully. Check your email for verification link"
      );
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.warning("User already exists. Try logging in instead.");
      } else {
        toast.error(
          "Registration failed. Please check your details and try again."
        );
      }
      console.error("Registration failed", err);
    } finally {
      NProgress.done();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-lg font-semibold text-center">
              Sign Up Successful
            </h2>
            <p className="text-center">
              Please check your email for the verification link.
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200 mx-auto"
              onClick={handleModalClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <section className="min-h-screen p-3 mb-10">
         <div className="w-full flex justify-center relative z-0">
          <img
            src="/images/bg/cover.png"
            className="w-full object-contain z-0"
            alt=""
          />
          <div className="absolute h-full md:h-auto top-1 lg:top-0 flex flex-col justify-center items-center gap-y-0 lg:gap-y-1 md:text-center text-white max-w-lg lg:max-w-none md:bottom-28 bottom-5 space-y-1 lg:space-y-3">
            <img
              src="/images/logo/blue_sands_white.png"
              alt="Logo"
              className="w-auto h-7 lg:h-12 mx-auto"
            />
            <h1 className="hidden md:flex text-xl md:text-2xl lg:text-4xl font-normal">Create Your Account</h1>
            <p className="font-thin text-xs lg:text-lg max-w-xs md:max-w-lg lg:max-w-none text-center">
              Transforming Education Through Innovation with Cutting-Edge STEM
              Learning Experiences
            </p>
          </div>
        </div>
        <form
          className="border max-w-2xl mx-auto flex flex-col gap-y-3 md:gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white"
          onSubmit={handleRegister}
        >
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="fullName"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Full Name
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="fullName"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="emailAddress"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Email Address
            </label>
            <input
              type="email"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="emailAddress"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="phoneNumber"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Phone Number
            </label>
            <input
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="phoneNumber"
              value={phone}
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="dob"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              DOB
            </label>
            <input
              type="date"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              value={
                dob.getFullYear().toString() +
                "-" +
                (dob.getMonth() + 1).toString().padStart(2, "0") +
                "-" +
                dob.getDate().toString().padStart(2, "0")
              }
              required
              id="dob"
              //   value={
              //     dob.getFullYear().toString() +
              //     "-" +
              //     (dob.getMonth() + 1).toString().padStart(2, 0) +
              //     "-" +
              //     dob.getDate().toString().padStart(2, 0)
              //   }
              onChange={(e) => {
                setDob(new Date(e.target.value));
              }}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="gender"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Gender
            </label>
            <select
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="gender"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="country"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Country
            </label>
            <select
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>
              {countries.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            minLength={6}
            required
          />
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
            required
          />
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="couponCode"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Coupon Code
            </label>
            <input
              type="text"
              className="rounded-md border px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>
          
          <div className="w-full flex flex-col gap-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-center rounded-md py-1 md:py-3 lg:py-5 bg-bgBlue text-white w-full text-sm md:text-lg ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
            <p className="text-gray-500 text-center text-sm md:text-base">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-500 underline font-normal"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
