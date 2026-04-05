"use client";

import { ViewLearningSpacePage } from "@/components/Teacher/LearningSpaces/ViewLearningSpacePage";
import { useRouter, useParams } from "next/navigation";

export default function ViewSpacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  return (
    <ViewLearningSpacePage
      spaceId={id}
      onBack={() => router.back()}
      onEdit={() => router.push(`/teacher/dashboard/classes/edit-space/${id}`)}
    />
  );
}