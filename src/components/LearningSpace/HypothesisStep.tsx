"use client";

import { useState } from "react";
import { FiMic, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { BsLightbulb } from "react-icons/bs";

export default function HypothesisStep({ data, onContinue }: any) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Step header */}
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

      {/* Framing question */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-indigo-400">
          Framing Question
        </span>
        <p className="text-base font-semibold text-gray-800">"{data.hypothesisQuestion}"</p>
      </div>

      {/* Hypothesis input */}
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
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white"
        />

        {submitted ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            <FiCheckCircle /> Hypothesis submitted!
          </div>
        ) : (
          <button
            disabled={!text.trim()}
            onClick={() => setSubmitted(true)}
            className="mt-3 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Hypothesis
          </button>
        )}
      </div>

      {/* Peer hypotheses */}
      {/* <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-800">Peer Hypotheses</p>
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-500">
            {data.peers?.length} classmates
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {data.peers?.map((peer: any) => (
            <div key={peer.id} className="flex items-start gap-3">
              <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${peer.avatarColor}`}>
                {peer.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{peer.name}</p>
                <p className="text-sm text-gray-500">{peer.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

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