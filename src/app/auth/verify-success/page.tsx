"use client";
import { useUser } from "@/services/UserContext";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";

const VerifySuccess = () => {
  const router = useRouter();
  const { logout } = useUser();

  const handleLogin = () => {
    nProgress.start;
    logout();
    router.push("/auth/login");
    nProgress.done;
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white flex flex-col p-8 items-center rounded-lg shadow-lg text-center max-w-md">
          <div className="mb-6">
            <img
              src="/images/logo/blue_sands_blue.png"
              alt="Logo"
              className="w-auto h-[80px] mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verification Successful
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has been verified successfully. Please click on the
              login button below to continue your Lab experience.
            </p>
          </div>
          <button
            className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            onClick={handleLogin}
          >
            Log in
          </button>
        </div>
      </div>
    </>
  );
};

export default VerifySuccess;
