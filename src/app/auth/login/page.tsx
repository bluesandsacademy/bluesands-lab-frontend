"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, googleAuth } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import NProgress from "nprogress";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import PasswordInput from "@/components/PasswordInput";

export default function UserLogin() {
  useEffect(() => {
    document.title =
      "Welcome Back! | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const router = useRouter();
  const { setSession, isLoggedIn } = useUser();

  //Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

   function handleRememberPassword() {
    setRememberPassword(!rememberPassword);
  }

  const redirectByRole = (role?: string) => {
    if (role === "schoolAdmin" || role === "SchoolAdmin") return router.push("/school/dashboard");
    if (role === "globalAdmin" || role === "GlobalAdmin") return router.push("/admin/dashboard");
    if (role === "teacher" || role === "Teacher") return router.push("/teacher/dashboard");
    return router.push("/dashboard");
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    NProgress.start();
    try {
      const session = await googleAuth(credentialResponse.credential);
      setSession(session);
      toast.success(`Welcome back, ${session.user.fullName}!`);
      redirectByRole(session.user.role);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        toast.error(err.response.data?.message ?? "An account with this email already exists. Please log in with your password.");
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    } finally {
      NProgress.done();
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    NProgress.start();

    try {
      const { user, token, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = await login(email, password);

      setSession({ user, token, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt });

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
        toast.error("Login failed.", err.response.message);
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
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            required
          />
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
            <Link
              href="/auth/forgot-password"
              className="text-gray-500 text-sm md:text-md font-normal text-center"
            >
              Forget Password?
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`text-center  rounded-md py-1 md:py-5 bg-bgBlue text-white w-full md:text-lg ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed. Please try again.")}
            />
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
