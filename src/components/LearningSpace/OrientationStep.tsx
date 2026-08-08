// "use client";

// import { useState } from "react";
// import { FiPlay, FiArrowRight, FiMic, FiCheckCircle } from "react-icons/fi";

// export default function OrientationStep({ data, onContinue }: any) {
//   const [selected, setSelected] = useState(data?.poll?.defaultSelected);
//   const [text, setText] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   return (
//     <div className="flex flex-col gap-4 p-6">

//       {/* Banner */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 to-indigo-500 p-7 text-white">
//         <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-200">
//           Step {data.stepNumber} of {data.totalSteps}
//         </span>
//         <h1 className="text-2xl font-bold">{data.title}</h1>
//         <p className="mt-1 text-sm text-indigo-200">{data.subtitle}</p>
//         <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
//       </div>

//       {/* Guiding question */}
//       <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
//         <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-400">
//           Guiding Question
//         </span>
//         <p className="text-base font-semibold text-gray-800">"{data.engagementQuestion}"</p>
//       </div>

//       {/* Media */}
//       {/* <div className="flex min-h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
//         {data.mediaUrl ? (
//           <video src={data.mediaUrl} controls className="w-full rounded-xl" />
//         ) : (
//           <div className="flex flex-col items-center gap-2 text-gray-400">
//             <FiPlay size={28} />
//             <p className="text-sm">Media content will appear here</p>
//           </div>
//         )}
//       </div> */}

//       {/* Poll */}
//       {/* <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
//         <p className="text-xs font-bold uppercase tracking-widest text-gray-700">{data.poll.prompt}</p>
//         <p className="mb-4 mt-1 text-sm text-gray-400">{data.poll.subtext}</p>
//         <div className="flex flex-col gap-3">
//           {data.poll.options.map((opt: any) => (
//             <label
//               key={opt.id}
//               onClick={() => setSelected(opt.id)}
//               className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${
//                 selected === opt.id
//                   ? "border-indigo-400 bg-indigo-50 font-medium text-indigo-700"
//                   : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/50"
//               }`}
//             >
//               <span className={`h-4 w-4 flex-shrink-0 rounded-full border-2 transition-all ${
//                 selected === opt.id
//                   ? "border-indigo-500 bg-indigo-500 shadow-[inset_0_0_0_2px_white]"
//                   : "border-gray-300"
//               }`} />
//               {opt.label}
//             </label>
//           ))}
//         </div>
//       </div> */}

//       {/* Orientation answer input */}
//             <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
//               <div className="mb-3 flex items-start justify-between">
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">What do you think?</p>
//                   <p className="text-xs text-gray-400">{data?.poll?.subtext}</p>
//                 </div>
//                 <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition hover:border-indigo-300 hover:text-indigo-500">
//                   <FiMic size={12} /> Voice
//                 </button>
//               </div>
      
//               <textarea
//                 rows={3}
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder={data.inputPlaceholder}
//                 className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white"
//               />
      
//               {submitted ? (
//                 <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
//                   <FiCheckCircle /> Your answer is submitted!
//                 </div>
//               ) : (
//                 <button
//                   disabled={!text.trim()}
//                   onClick={() => setSubmitted(true)}
//                   className="mt-3 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Submit Answer
//                 </button>
//               )}
//             </div>

//       <div className="flex justify-end">
//         <button
//           onClick={onContinue}
//           className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
//         >
//           Continue <FiArrowRight />
//         </button>
//       </div>

//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { FiArrowRight, FiMic, FiCheckCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { submitOrientation } from "@/services/learningSpaceService";
import { saveErrorMessage, withSession } from "./sessionHelpers";
import { toast } from "react-toastify";

export default function OrientationStep({
  data,
  onContinue,
  onStepComplete,
  sessionId,
  ensureSession,
}: any) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmitAnswer = async (): Promise<boolean> => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    setIsSaving(true);
    try {
      await withSession(sessionId, ensureSession, (id) =>
        submitOrientation(id, trimmed),
      );
      // Only confirm once the answer actually reached the server.
      setSubmitted(true);
      return true;
    } catch (err) {
      toast.error(saveErrorMessage(err, "Failed to save answer. Please try again."));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Continuing with an unsaved answer used to drop it silently, so Continue
  // saves first and only advances if that succeeded.
  const handleContinue = async () => {
    if (!submitted) {
      const saved = await handleSubmitAnswer();
      if (!saved) return;
    }
    const payload = { stepId: data.id, engagementAnswer: text.trim() || null };
    onStepComplete(payload);
    onContinue(payload);
  };

  const canContinue = submitted || !!text.trim();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-800 to-indigo-500 p-7 text-white">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-200">
          Step {data.stepNumber} of {data.totalSteps}
        </span>
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="mt-1 text-sm text-indigo-200">{data.subtitle}</p>
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Guiding Question
        </span>
        <p className="text-base font-semibold text-gray-800">"{data.engagementQuestion}"</p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">What do you think?</p>
            <p className="text-xs text-gray-400">{data?.poll?.subtext}</p>
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
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white"
        />

        {submitted ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            <FiCheckCircle /> Your answer is submitted!
          </div>
        ) : (
          <button
            disabled={!text.trim() || isSaving}
            onClick={handleSubmitAnswer}
            className="mt-3 flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? <><FaSpinner className="animate-spin" /> Saving…</> : "Submit Answer"}
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        {!canContinue && (
          <p className="text-xs text-gray-400">
            Answer the question to continue
          </p>
        )}
        <button
          onClick={handleContinue}
          disabled={!canContinue || isSaving}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? (
            <><FaSpinner className="animate-spin" /> Saving…</>
          ) : (
            <>{submitted ? "Continue" : "Submit & Continue"} <FiArrowRight /></>
          )}
        </button>
      </div>
    </div>
  );
}