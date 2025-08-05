"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import NProgress from "nprogress";
import { countries, genderOptions } from "@/lib/data";
import { useRouter } from "next/navigation";
import { UserObject, registerNewUser } from "@/services/auth-service";

export default function RegisterIndividualAccount() {
  useEffect(() => {
    document.title =
      "Create your Account | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(new Date());
  const [sex, setSex] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const payload: UserObject = {
    fullName,
    email,
    phoneNumber,
    dob,
    sex,
    country,
    password,
  };

  function handleRememberPassword() {
    setRememberPassword(!rememberPassword);
  }

  const handleRegister = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Set submitting state to true
    NProgress.start(); // Start the loading bar

    try {
      await registerNewUser(payload);
      alert("User created successfully, Now you can login");
      router.push("/auth/login");
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert("User already exists. Try logging in instead.");
      } else {
        alert("Registration failed. Please check your details and try again.");
      }
      console.error("Registration failed", err);
    } finally {
      NProgress.done();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="min-h-screen p-3 mb-10">
        <div className="w-full flex justify-center relative z-0">
          <img
            src="/images/bg/cover.png"
            className="w-full object-contain z-0"
            alt=""
          />
          <div className="absolute flex flex-col items-center justify-center  top-1 lg:top-0 text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-1 lg:space-y-3">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-normal">
              Create your Account
            </h1>
            <p className="font-thin text-xs md:text-base lg:text-lg md:max-w-lg max-w-xs">
              Transforming Education Through Innovation with Cutting-Edge STEM
              Learning Experiences
            </p>
          </div>
        </div>
        <form className="border max-w-2xl mx-auto flex flex-col gap-y-3 md:gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white">
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
              type="text"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="emailAddress"
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
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label htmlFor="dob" className="font-medium text-gray-700 text-sm md:text-md">
              DOB
            </label>
            <input
              type="date"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
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
              onChange={(e) => setSex(e.target.value)}
            >
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
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((option, index) => (
                <option value={option} key={index}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full gap-y-1 md:gap-y-4">
            <label
              htmlFor="password"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Password
            </label>
            <input
              type="password"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-lg"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex gap-x-3 items-center">
            <input
              type="checkbox"
              className="w-4 h-4 md:w-5 md:h-5"
              id="rememberPassword"
              checked={rememberPassword}
              onChange={handleRememberPassword}
            />
            <label
              htmlFor="rememberPassword"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Remember Password
            </label>
          </div>
          <div className="w-full flex flex-col gap-y-3">
            <button
              type="button"
              className={`text-center  rounded-md py-1 md:py-3 lg:py-5 bg-bgBlue text-white w-full text-sm md:text-lg`}
              onClick={handleRegister}
            >
              Sign Up
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
