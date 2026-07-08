"use client";

import { FiArrowRight, FiUploadCloud } from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import { useRef, useState } from "react";
import { FaBriefcase, FaGlobeAfrica, FaSpinner } from "react-icons/fa";
import { submitRealWorld } from "@/services/learningSpaceService";
import { toast } from "react-toastify";

export default function RealWorldStep({ data, onContinue, onStepComplete, sessionId }: any) {
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleContinue = async () => {
    if (sessionId && note.trim()) {
      setIsSaving(true);
      try {
        await submitRealWorld(sessionId, note.trim());
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message ?? "Failed to save real-world note. You can still continue.",
        );
      } finally {
        setIsSaving(false);
      }
    }
    const payload = { stepId: data.id, note, photo };
    onStepComplete(payload);
    onContinue(payload);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Step header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-500">
          <BsGlobe size={18} />
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
            Step {data.stepNumber} of {data.totalSteps}
          </span>
          <h2 className="text-lg font-bold text-gray-800">
            Science in the Real World
          </h2>
        </div>
      </div>

      {/* Example cards */}
      <div className="grid grid-cols-3 gap-3">
        {data.realWorldApplications?.map((ex: string, index: number) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="h-32 w-full overflow-hidden bg-gray-100">
              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                <FaGlobeAfrica size={70} />
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-800">{ex}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Related Careers */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm mb-2 font-semibold text-indigo-600">Related Careers</p>
        <div className="flex flex-wrap gap-3">
          {data.relatedCareers.map((career: string, index: number) => (
            <div
              key={index}
              className="flex items-center p-2 justify-center gap-2 bg-blue-200 rounded"
            >
              <FaBriefcase className="text-blue-700" />
              <p className="text-sm text-blue-700">{career}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional task */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-indigo-600">Optional Task</p>
        <p className="mb-3 mt-1 text-sm text-gray-500">{data.realWorldTask}</p>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your notes here…"
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white"
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />

        {photo ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
            <img src={photo} alt="Upload preview" className="max-h-48 w-full object-cover" />
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-500 transition hover:border-indigo-300 hover:text-indigo-500"
          >
            <FiUploadCloud size={15} /> Upload Photo
          </button>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? <><FaSpinner className="animate-spin" /> Saving…</> : <>Continue <FiArrowRight /></>}
        </button>
      </div>
    </div>
  );
}