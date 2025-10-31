"use client";
import PhETSimulation from "@/components/Dashboard/PhET/PhETDemoSimulation";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const simUrl = searchParams.get("simulationUrl") ?? "";
  const title = searchParams.get("title") ?? "";

  const handleBack = () => {
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
