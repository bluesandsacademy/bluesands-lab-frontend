"use client";
import PhETSimulation from "@/components/Dashboard/PhET/PhETDemoSimulation";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionEndedRef = useRef(false);

  const simUrl = searchParams.get("simulationUrl") ?? "";
  const title = searchParams.get("title") ?? "";

  const endExperiment = () => {
    if (sessionEndedRef.current) return; // Prevent multiple calls
    sessionEndedRef.current = true;
    
    //session ending logic here
    console.log("Session ended");
    //Save session data, log analytics, etc.
  };

  useEffect(() => {
    return () => {
      endExperiment();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      endExperiment();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        endExperiment();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleBack = () => {
    endExperiment();
    router.back();
  };

  return (
    <div className="flex flex-col gap-2 p-2 lg:p-4">
      <button
        onClick={handleBack}
        className="w-max rounded-full border border-bgBlue text-bgBlue p-2 text-sm lg:text-base"
      >
        <FaArrowLeft />
      </button>
      <PhETSimulation simulationUrl={simUrl} title={title} />
    </div>
  );
};

export default page;