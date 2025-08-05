"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import NProgress from "nprogress";

export default function UserLogin() {
  useEffect(() => {
    document.title =
      "Welcome Back! | Transforming Education Through Innovation with Cutting-Edge STEM Learning Experiences";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser, setIsLoggedIn } = useUser();

  const handleLogin = async () => {
    try {
      NProgress.start(); // Start the loading bar
      const res = await login(email, password);
      const { user } = res;
      setUser(user); // saves user in context/localStorage
      setIsLoggedIn(true);
      router.push("/dashboard");
      NProgress.done(); // Stop the loading bar
      const localUser = localStorage.getItem("user");
      if (localUser) {
        console.log(JSON.parse(localUser));
      } else {
        console.log("No user found in localStorage");
      }
    } catch (err) {
      NProgress.done();
      console.error("Login failed", err);
      alert("Invalid login credentials");
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
          <div className="absolute h-full md:h-auto top-1 lg:top-0 flex flex-col justify-center items-center md:gap-y-1 lg:gap-y-5 md:text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-1 lg:space-y-3">
            <h1 className="text-xl md:text-2xl lg:text-4xl font-normal">Welcome Back!</h1>
            <p className="font-thin text-xs md:text-base lg:text-lg md:max-w-lg max-w-xs text-center">
              Transforming Education Through Innovation with Cutting-Edge STEM
              Learning Experiences
            </p>
          </div>
        </div>
        <form className="border max-w-2xl mx-auto flex flex-col gap-y-3 md:gap-y-5 py-5 px-3 md:px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white">
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
              htmlFor="password"
              className="font-medium text-gray-700 text-sm md:text-md"
            >
              Password
            </label>
            <input
              type="password"
              className="rounded-md border px-2 md:px-3 py-1 md:py-3 w-full text-gray-600 text-sm md:text-base"
              id="password"
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
              type="button"
              className={`text-center  rounded-md py-1 md:py-5 bg-bgBlue text-white w-full md:text-lg`}
              onClick={handleLogin}
            >
              Login
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
