"use client";

import CreateLearningSpacePage from "@/components/Teacher/LearningSpaces/CreateLearningSpacePage";
import { useRouter } from "next/navigation";

export default function CreateSpacePage() {
  const router = useRouter();

  return (
    <CreateLearningSpacePage
      onSuccess={() => router.push("/teacher/dashboard/classes")}
      onCancel={() => router.back()}
    />
  );
}