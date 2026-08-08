"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { GiTrophy } from "react-icons/gi";
import { submitAssessment, PostSimAnswer, AssessmentResult } from "@/services/learningSpaceService";
import {
  readAlreadySubmitted,
  saveErrorMessage,
  withSession,
} from "./sessionHelpers";
import { toast } from "react-toastify";

export default function AssessmentStep({
  data,
  onStepComplete,
  sessionId,
  ensureSession,
}: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [maxScore, setMaxScore] = useState(0);
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false);

  const progressPercent =
    result?.score != null && maxScore > 0
      ? Math.round((result.score / maxScore) * 100)
      : 0;

  const completionItems = [
    data.quiz?.questions?.length > 0 && { id: "pre-quiz", label: "Pre-Quiz Completed" },
    data.introductionMessage && { id: "orientation", label: "Introduction Reviewed" },
    data.hypothesisQuestion && { id: "hypothesis", label: "Hypothesis Submitted" },
    data.simulationId && { id: "experiment", label: "Experiment Completed" },
    data.discussionPrompt && { id: "discussion", label: "Reflection Posted" },
    (data.realWorldApplications?.length > 0 || data.realWorldTask) && {
      id: "real-world",
      label: "Real World Task Done",
    },
  ].filter(Boolean);

  const handleSubmit = async () => {
    const postSimData = data.postSimData as {
      postSimAnswers?: PostSimAnswer[];
      postSimScore?: number;
      postSimTotal?: number;
    } | null;
    const total = postSimData?.postSimTotal ?? 0;

    setIsSubmitting(true);
    try {
      const res = await withSession(sessionId, ensureSession, (id) =>
        submitAssessment(
          id,
          postSimData?.postSimAnswers ?? [],
          postSimData?.postSimScore ?? 0,
          total,
        ),
      );
      setMaxScore(total);
      setResult(res);
      if (res.badgeAwarded) toast.success("Badge awarded!");

      // The lesson is only complete once the server has recorded it.
      setDone(true);
      onStepComplete?.({ stepId: data.id, completedAt: new Date().toISOString() });
    } catch (err) {
      // A 409 means this session was already scored — the body holds the real
      // result, so show it rather than reporting a failure.
      const existing = readAlreadySubmitted(err);
      if (existing) {
        setMaxScore(total);
        setResult({
          score: existing.score,
          feedback: existing.feedback,
          badgeAwarded: existing.badgeAwarded,
          completedAt: existing.completedAt,
        });
        setWasAutoSubmitted(!!existing.autoSubmitted);
        setDone(true);
        onStepComplete?.({
          stepId: data.id,
          completedAt: existing.completedAt ?? new Date().toISOString(),
        });
        toast.info("This attempt was already submitted — showing your result.");
        return;
      }
      toast.error(saveErrorMessage(err, "Failed to submit. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Trophy banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 to-indigo-500 p-8 text-center text-white">
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <GiTrophy size={56} className="text-yellow-400 drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-bold">
              {done ? "Lesson Complete!" : "Ready to Submit?"}
            </h1>
            <p className="mt-1 text-sm text-indigo-200">
              {done
                ? "Great work on finishing the lesson"
                : "Review your work and submit when ready"}
            </p>
          </div>
          {done && result?.score != null && (
            <div className="mt-2 text-center">
              <p className="text-4xl font-bold">
                {result.score}
                <span className="text-xl font-normal text-indigo-300">/{maxScore}</span>
              </p>
              <div className="mt-3 h-2 w-48 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {wasAutoSubmitted && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">
            This attempt was submitted automatically
          </p>
          <p className="mt-1 text-xs text-amber-700">
            The session&apos;s time limit was reached, so the assessment was
            closed and scored before you pressed submit. Ask your teacher to
            reopen it if you need another attempt.
          </p>
        </div>
      )}

      {done && result?.feedback && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-gray-800">Feedback</p>
          <p className="text-sm text-gray-600">{result.feedback}</p>
        </div>
      )}

      {/* Completion summary */}
      {completionItems.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-gray-800">Completion Summary</p>
          <div className="flex flex-col gap-3">
            {completionItems.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <FiCheckCircle size={18} className="flex-shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {done ? (
        <p className="text-center text-sm text-gray-400">
          Teacher feedback will appear here once reviewed.
        </p>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <><FaSpinner className="animate-spin" /> Submitting…</>
            ) : (
              "Submit Learning Space"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
