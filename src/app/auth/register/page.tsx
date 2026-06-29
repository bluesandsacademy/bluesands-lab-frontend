"use client";

import { googleAuth } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";
import { toast } from "react-toastify";

const linkOptions = [
  { title: "Individual", url: "/auth/register/individual" },
  { title: "School", url: "/auth/register/school" },
];

export default function RegisterUser() {
  const { setSession } = useUser();
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    NProgress.start();
    try {
      const session = await googleAuth(credentialResponse.credential);
      setSession(session);
      toast.success(`Welcome, ${session.user.fullName}!`);
      const role = session.user.role;
      if (role === "schoolAdmin" || role === "SchoolAdmin") return router.push("/school/dashboard");
      if (role === "globalAdmin" || role === "GlobalAdmin") return router.push("/admin/dashboard");
      if (role === "teacher" || role === "Teacher") return router.push("/teacher/dashboard");
      router.push("/dashboard");
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

  return (
    <section className="min-h-screen p-3">
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
            Get Started
          </h1>
          <p className="font-thin text-xs lg:text-lg max-w-xs md:max-w-lg lg:max-w-none text-center">
            Choose your role to begin your journey on Blue Sands STEM Labs.
          </p>
        </div>
      </div>

      <div className="border max-w-2xl mx-auto flex flex-col gap-y-5 py-20 px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white">
        {linkOptions.map((link, index) => (
          <Link
            href={link.url}
            key={index}
            className={`text-center text-sm md:text-base rounded-md py-2 md:py-3 lg:py-5 ${
              index === 0 ? "bg-bgBlue text-white" : "bg-bgGrey"
            }`}
          >
            {link.title}
          </Link>
        ))}
        <div className="flex items-center gap-3">
          <hr className="flex-1 border-gray-300" />
          <span className="text-xs text-gray-400">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Google sign-in failed. Please try again.")}
        />
      </div>
    </section>
  );
}
