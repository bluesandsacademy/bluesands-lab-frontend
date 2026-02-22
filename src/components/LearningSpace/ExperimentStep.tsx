"use client";

import { useState } from "react";
import { FiRefreshCw, FiArrowRight, FiSave, FiPlusCircle } from "react-icons/fi";
import { FaFlask } from "react-icons/fa";

export default function ExperimentStep({ data, onContinue }: any) {
  const initialValues = Object.fromEntries(data.controls.map((c: any) => [c.id, c.default]));
  const [values, setValues] = useState(initialValues);
  const [hasRun, setHasRun] = useState(false);
  const [observation, setObservation] = useState("");

  const handleReset = () => { setValues(initialValues); setHasRun(false); };

  // Visual: object sinks lower as density increases past 1.0
  const density = values["density"] ?? 1.0;
  const objectBottom = density >= 1.2 ? "10%" : density >= 0.9 ? "38%" : "62%";

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Step header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-500">
          <FaFlask size={18} />
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
            Step {data.stepNumber} of {data.totalSteps}
          </span>
          <h2 className="text-lg font-bold text-gray-800">Run the Experiment</h2>
        </div>
      </div>

      {/* Simulation + controls side by side */}
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        {/* Sim visual */}
        <div className="relative flex flex-col gap-3 bg-gradient-to-br from-indigo-900 to-indigo-600 p-5">
          <span className="w-fit rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            Live Simulation
          </span>
          <div className="relative flex-1" style={{ minHeight: 140 }}>
            {/* Water body */}
            <div className="absolute bottom-0 left-0 right-0 h-2/3 rounded-b-xl bg-blue-400/25" />
            {/* Floating / sinking object */}
            <div
              className="absolute left-1/2 w-10 h-16 -translate-x-1/2 rounded-t-md bg-emerald-300/90 shadow-lg transition-all duration-700"
              style={{ bottom: hasRun ? objectBottom : "62%", opacity: hasRun ? 1 : 0.45 }}
            />
          </div>
          <p className="text-xs text-indigo-200">Adjust variables to observe changes</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 p-5">
          <p className="text-sm font-semibold text-gray-800">Variable Controls</p>

          {data.controls.map((ctrl: any) => (
            <div key={ctrl.id} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{ctrl.label}</span>
                <span className="font-semibold text-indigo-600">
                  {values[ctrl.id]} {ctrl.unit}
                </span>
              </div>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={values[ctrl.id]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [ctrl.id]: parseFloat(e.target.value) }))
                }
                className="w-full accent-indigo-500"
              />
            </div>
          ))}

          <div className="mt-auto flex gap-2 pt-2">
            <button
              onClick={() => setHasRun(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FiPlusCircle size={14} /> Run Trial
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-gray-500 transition hover:bg-gray-50"
            >
              <FiRefreshCw size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Observation */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-800">{data.observationPrompt}</p>
        <p className="mb-3 text-xs text-gray-400">What did you notice when density increased?</p>
        <textarea
          rows={3}
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder={data.observationPlaceholder}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50">
          <FiSave size={14} /> Save Progress
        </button>
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