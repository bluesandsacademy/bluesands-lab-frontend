"use client";

import { FiArrowRight, FiUploadCloud } from "react-icons/fi";
import { BsGlobe } from "react-icons/bs";
import { useRef, useState } from "react";

export default function RealWorldStep({ data, onContinue }: any) {
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
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
          <h2 className="text-lg font-bold text-gray-800">Science in the Real World</h2>
        </div>
      </div>

      {/* Example cards */}
      <div className="grid grid-cols-3 gap-3">
        {data.examples.map((ex: any) => (
          <div key={ex.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="h-32 w-full overflow-hidden bg-gray-100">
              {ex.imageUrl
                ? <img src={ex.imageUrl} alt={ex.title} className="h-full w-full object-cover" />
                : <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
              }
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-gray-800">{ex.title}</p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{ex.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Optional task */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-indigo-600">Optional Task</p>
        <p className="mb-3 mt-1 text-sm text-gray-500">{data.optionalTask.prompt}</p>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={data.optionalTask.placeholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white"
        />

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

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
          onClick={onContinue}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue <FiArrowRight />
        </button>
      </div>

    </div>
  );
}