"use client";

import { CreateLearningSpacePage } from "@/components/Teacher/LearningSpaces/CreateLearningSpacePage";
import { getLearningSpaceById } from "@/services/learningSpaceService";
import { useUser } from "@/services/UserContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { normalizeSpace } from "@/utils/NormalizeSpace";

export default function EditSpacePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { token } = useUser();

  const [initialData, setInitialData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const raw = await getLearningSpaceById(id, token);
        setInitialData(normalizeSpace(raw));
      } catch (err: any) {
        setError(err?.message ?? "Failed to load learning space");
      } finally {
        setLoading(false);
      }
    }
    if (id && token) load();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <FaSpinner className="animate-spin w-8 h-8" />
          <p className="text-sm font-medium">Loading learning space…</p>
        </div>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <FaExclamationTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-gray-800">Could not load this learning space</p>
          <p className="text-xs text-gray-500">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <CreateLearningSpacePage
      mode="edit"
      initialData={initialData}
      onSuccess={() => router.push("/teacher/dashboard/classes")}
      onCancel={() => router.back()}
    />
  );
}