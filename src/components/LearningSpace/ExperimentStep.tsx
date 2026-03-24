"use client";

import { useEffect, useState } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { FaFlask } from "react-icons/fa";
import { getPhetSimulationsById } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";

interface PostSimQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface PostSimAssessment {
  quizTitle: string;
  description: string;
  points: string;
  questions: PostSimQuestion[];
}

interface PhetSimResponseObject {
  id: string;
  title: string;
  type: string;
  numberOfScreens: number;
  screenNames: string;
  simPage: string;
  simString: string;
  teacherTipsDoc: string;
  pdfUrl: string;
  physics: boolean;
  mathStatistics: boolean;
  chemistry: boolean;
  earthSpace: boolean;
  biology: boolean;
  lowGradeLevel: string;
  highGradeLevel: string;
  mainTopics: string;
  keywords: string;
  description: string;
  sampleLearningGoals: string;
  translations: string;
  published: string;
  runnableResource: string;
  cheerpJRunnable: string;
  filename: string;
}

export default function ExperimentStep({
  data,
  onContinue,
  onStepComplete,
}: any) {
  const [observation, setObservation] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [simulationUrl, setSimulationUrl] = useState("");
  const [simId, setSimId] = useState(data.simulationId);
  const [loading, setLoading] = useState(false);
  const { token } = useUser();

  const questions: PostSimQuestion[] = data?.postSimAssessment?.questions ?? [];

  const allQuizAnswered =
    questions.length > 0 &&
    questions.every((_: PostSimQuestion, i: number) => quizAnswers[i] !== undefined);

  useEffect(() => {
    async function fetchSimulation() {
      setLoading(true);
      try {
        const simObject: PhetSimResponseObject = await getPhetSimulationsById(
          simId,
          token,
        );
        setSimulationUrl(simObject.runnableResource);
      } catch (err) {
        console.error("Error fetching experiment:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSimulation();
  }, [simId, token]);

  const handleSubmit = () => {
    if (!observation.trim() || !allQuizAnswered) return;
    setSubmitted(true);

    const correctCount = questions.filter(
      (q: PostSimQuestion, i: number) => quizAnswers[i] === q.correctAnswer,
    ).length;

    onStepComplete?.({
      stepId: data.id,
      observation,
      postSimAssessment: {
        answers: quizAnswers,
        score: correctCount,
        total: questions.length,
      },
    });
  };

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
          <h2 className="text-lg font-bold text-gray-800">
            Run the Experiment
          </h2>
        </div>
      </div>

      {/* Procedures */}
      <div className="rounded-xl border border-teal-100 bg-teal-50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
          Experiment Procedures
        </p>
        <ul className="flex flex-col gap-2">
          {data?.experimentProcedures?.map((obj: string, i: number) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <BsCheckCircleFill
                className="mt-0.5 flex-shrink-0 text-teal-400"
                size={14}
              />
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* PhET Simulation iframe */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Live Simulation — PhET Interactive
          </span>
          <a
            href={simulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-indigo-500 hover:underline"
          >
            Open full screen ↗
          </a>
        </div>
        <iframe
          src={simulationUrl? simulationUrl : undefined}
          title="PhET Simulation"
          className="w-full"
          style={{ height: 480 }}
          allowFullScreen
        />
      </div>

      {/* Observation */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-gray-800">
          {/* {data?.discussionPrompt} */}
        </p>
        <p className="mb-3 mt-0.5 text-xs text-gray-400">
          Record what you observed while running the simulation.
        </p>
        <textarea
          rows={3}
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          placeholder={data.observationPlaceholder}
          disabled={submitted}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white disabled:opacity-60"
        />
      </div>

      {/* Post-simulation quiz */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-1 text-sm font-semibold text-gray-800">
          {data?.postSimAssessment?.quizTitle ?? "Post-Simulation Quiz"}
        </p>
        <p className="mb-4 text-xs text-gray-400">
          {data?.postSimAssessment?.description ??
            "Answer these questions based on what you observed in the simulation."}
        </p>

        <div className="flex flex-col gap-6">
          {questions.map((q: PostSimQuestion, qi: number) => {
            const selected = quizAnswers[qi];
            const isCorrect = submitted && selected === q.correctAnswer;
            const isWrong = submitted && selected !== q.correctAnswer;

            return (
              <div key={qi}>
                <p className="mb-2 text-sm font-medium text-gray-700">
                  {qi + 1}. {q.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt;
                    let style =
                      "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50";
                    if (isSelected && !submitted)
                      style =
                        "border-indigo-400 bg-indigo-50 text-indigo-700 font-medium";
                    if (submitted && opt === q.correctAnswer)
                      style =
                        "border-emerald-400 bg-emerald-50 text-emerald-700 font-medium";
                    if (submitted && isSelected && isWrong)
                      style =
                        "border-rose-400 bg-rose-50 text-rose-700 font-medium";

                    return (
                      <button
                        key={opt}
                        disabled={submitted}
                        onClick={() =>
                          setQuizAnswers((prev) => ({ ...prev, [qi]: opt }))
                        }
                        className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${style} disabled:cursor-default`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            <FiCheckCircle />
            Quiz submitted! Score:{" "}
            {
              questions.filter(
                (q: PostSimQuestion, i: number) =>
                  quizAnswers[i] === q.correctAnswer,
              ).length
            }
            /{questions.length}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!observation.trim() || !allQuizAnswered}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit &amp; Continue <FiArrowRight />
          </button>
        ) : (
          <button
            onClick={onContinue}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue <FiArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}