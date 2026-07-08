"use client";

import { useState } from "react";
import { FiMic, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { BsLightbulb } from "react-icons/bs";
import { submitHypothesis } from "@/services/learningSpaceService";
import { toast } from "react-toastify";

export default function HypothesisStep({ data, onContinue, onStepComplete, sessionId }: any) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (sessionId) {
      setIsSaving(true);
      try {
        await submitHypothesis(sessionId, trimmed);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ?? "Failed to save hypothesis. You can still continue.",
        );
      } finally {
        setIsSaving(false);
      }
    }
    setSubmitted(true);
  };

  const handleContinue = () => {
    const payload = { stepId: data.id, hypothesis: text.trim() || null };
    onStepComplete(payload);
    onContinue(payload);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
          <BsLightbulb size={18} />
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
            Step {data.stepNumber} of {data.totalSteps}
          </span>
          <h2 className="text-lg font-bold text-gray-800">Make a prediction</h2>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Framing Question
        </span>
        <p className="text-base font-semibold text-gray-800">"{data.hypothesisQuestion}"</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Your Hypothesis</p>
            <p className="text-xs text-gray-400">{data.inputSubtext}</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition hover:border-indigo-300 hover:text-indigo-500">
            <FiMic size={12} /> Voice
          </button>
        </div>

        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={data.inputPlaceholder}
          disabled={submitted}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white disabled:opacity-60"
        />

        {submitted ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            <FiCheckCircle /> Hypothesis submitted!
          </div>
        ) : (
          <button
            disabled={!text.trim() || isSaving}
            onClick={handleSubmit}
            className="mt-3 flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? <><FaSpinner className="animate-spin" /> Saving…</> : "Submit Hypothesis"}
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
