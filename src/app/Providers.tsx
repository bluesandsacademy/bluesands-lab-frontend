"use client";

import { TourProvider } from "@reactour/tour";
import { useState } from "react";

// const steps = [
//   {
//     selector: ".step-1",
//     content: "Click here to create a new course",
//   },
//   {
//     selector: ".step-2",
//     content: "This is your dashboard overview",
//   },
// ];

export default function Providers({ children }: { children: React.ReactNode }) {
    const [steps, setSteps] = useState([])
  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ ...base, borderRadius: "12px", padding: "20px", paddingTop:"40px"}),
      }}
    >
      {children}
    </TourProvider>
  );
}
