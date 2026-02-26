"use client";

import QuestionBanner from "@/components/Quiz/QuestionBanner";
import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  title: string;
  duration: number; // minutes
  questions: QuizQuestion[];
}

export interface QuizResults {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  quizTitle: string;
  questionResults: {
    id: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    options: string[];
    isCorrect: boolean;
    explanation: string;
  }[];
}

// ── Core quiz UI ───────────────────────────────────────────────

export function QuizCore({
  quiz,
  onFinish,
}: {
  quiz: QuizData;
  onFinish: (results: QuizResults) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startTime] = useState<Date>(() => new Date());
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) { calculateResults(); return; }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { calculateResults(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleAnswer = (questionId: string, selectedAnswer: string) =>
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const calculateResults = () => {
    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
    let correctAnswers = 0;

    const questionResults = quiz.questions.map((q) => {
      const userAnswer = answers[q.id] || "";
      const isCorrect  = userAnswer === q.correctAnswer;
      if (isCorrect) correctAnswers++;
      return {
        id: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        options: q.options,
        isCorrect,
        explanation: q.explanation,
      };
    });

    onFinish({
      score: Math.round((correctAnswers / quiz.questions.length) * 100),
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent,
      quizTitle: quiz.title,
      questionResults,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="flex flex-col gap-6 p-4">

      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">{quiz.title}</h2>
        <span className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Progress circles */}
      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-1">
        {quiz.questions.map((_, index) => (
          <div key={index} className="flex flex-shrink-0 items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
              index < currentQuestion           ? "bg-blue-600 text-white" :
              index === currentQuestion         ? "bg-blue-600 text-white ring-4 ring-blue-200" :
              answers[quiz.questions[index].id] ? "bg-blue-200 text-blue-700" :
                                                 "bg-gray-100 text-gray-500"
            }`}>
              {index + 1}
            </div>
            {index < quiz.questions.length - 1 && (
              <div className={`mx-0.5 h-0.5 w-4 transition-all ${index < currentQuestion ? "bg-blue-600" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Question */}
      <QuestionBanner
        question={currentQ}
        selectedAnswer={answers[currentQ.id] || ""}
        onAnswer={handleAnswer}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button onClick={handleNext} className="text-sm font-medium text-blue-500 hover:underline">
          Skip
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
        >
          {currentQuestion === quiz.questions.length - 1 ? "Submit" : "Next"}
          {currentQuestion < quiz.questions.length - 1 && (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Question {currentQuestion + 1} of {quiz.questions.length}
      </p>

    </div>
  );
}

// ── Embedded version — used inside LearningSpace ───────────────

export function QuizSessionEmbedded({
  quiz,
  onComplete,
}: {
  quiz: QuizData;
  onComplete: (results: QuizResults) => void;
}) {
  return <QuizCore quiz={quiz} onFinish={onComplete} />;
}