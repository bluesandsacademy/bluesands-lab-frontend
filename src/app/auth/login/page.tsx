"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import NProgress from "nprogress";
import { toast } from "react-toastify";

export default function UserLogin() {
  useEffect(() => {
    document.title =
      "Welcome Back! | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setUser, setToken, isLoggedIn } = useUser(); //also import isLoggedin

  //Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    NProgress.start();

    try {
      const { user, token } = await login(email, password);

      // Set user and token in context (this will also save to localStorage)
      setUser(user);
      setToken(token);

      toast.success(`Welcome back, ${user.fullName}!`);

      if (user.role === "student") {
        router.push("/dashboard");
      } else if (user.role === "schoolAdmin" || user.role === "SchoolAdmin") {
        router.push("/school/dashboard");
      } else if (user.role === "globalAdmin" || user.role === "GlobalAdmin") {
        router.push("/admin/dashboard");
      } else if (user.role === "teacher" || user.role === "Teacher") {
        router.push("/teacher/dashboard");
      } else {
        // Default fallback for any other roles
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login failed", err);

      if (err.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (err.response?.status === 400) {
        toast.error("Please check your login credentials and try again.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
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
          <div className="absolute h-full md:h-auto top-1 lg:top-0 flex flex-col justify-center items-center gap-y-0 lg:gap-y-1 md:text-center text-white max-w-lg lg:max-w-none md:bottom-28 bottom-5 space-y-1 lg:space-y-3">
            <img
              src="/images/logo/blue_sands_white.png"
              alt="Logo"
              className="w-auto h-7 lg:h-12 mx-auto"
            />
            <h1 className="hidden md:flex text-xl md:text-2xl lg:text-4xl font-normal">
              Welcome Back!
            </h1>
            <p className="font-thin text-xs lg:text-lg max-w-xs md:max-w-lg lg:max-w-none text-center">
              Transforming Education Through Innovation with Cutting-Edge STEM
              Learning Experiences
            </p>
          </div>
        </div>
        <form
          className="border max-w-2xl mx-auto flex flex-col gap-y-3 md:gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white"
          onSubmit={handleLogin}
        >
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
              value={email}
              required
              id="emailAddress"
              onChange={(e) => setEmail(e.target.value)}
            />
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
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-y-3">
            <Link
              href="/auth/forgot-password"
              className="text-gray-500 text-sm md:text-md font-normal text-center"
            >
              Forget Password?
            </Link>
            <button
              type="submit"
              //disabled={isSubmitting}
              disabled
              className={`text-center  rounded-md py-1 md:py-5 bg-bgBlue text-white w-full md:text-lg ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <p className="text-gray-500 text-center text-xs md:text-base">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-500 underline font-normal"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}
