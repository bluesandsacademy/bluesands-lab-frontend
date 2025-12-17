// "use client"
// import { quizExample } from "@/components/Quiz/AnswerEval";
// import QuestionBanner from "@/components/Quiz/QuestionBanner"
// import { useRouter } from "next/router";
// import { useState } from "react";


// const QuizSession = () => {

//   // const router = useRouter(); remember to update this line
//   // const { id } = router.query;
  
//   const quiz  = quizExample  //const [quiz, setQuiz] = useState(null); //remember to update this line
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
  
//   // type AnswerValue = string | string[]; // single or multiple answers
//   // const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

//   const [showResults, setShowResults] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [startTime, setStartTime] = useState(null);

//   // useEffect(() => {
//   //   if (id) {
//   //     fetchQuiz(id);
//   //     setStartTime(new Date());
//   //   }
//   // }, [id]);

//   // const fetchQuiz = async (quizId) => {
//   //   try {
//   //     setLoading(true);
//   //     // Replace with  axios API endpoint
//   //     const response = await fetch(`/api/quiz/${quizId}`);
//   //     const quizData = await response.json();
//   //     setQuiz(quizData);
//   //   } catch (error) {
//   //     console.error('Error fetching quiz:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleAnswer = (questionId: number, selectedAnswer: string) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: selectedAnswer
//     }));
//   };

//   const handleNext = () => {
//     if (currentQuestion < quiz.questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     } else {
//       calculateResults();
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const calculateResults = () => {
//     const endTime = new Date();
//    // const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
//     let correctAnswers = 0;
//     const questionResults = quiz.questions.map(question => {
//       const userAnswer = answers[question.id];
//       const isCorrect = userAnswer === question.correctAnswer;
//       if (isCorrect) correctAnswers++;
      
//       return {
//         question: question.question,
//         userAnswer,
//         correctAnswer: question.correctAnswer,
//         options: question.options,
//         isCorrect,
//         explanation: question.explanation
//       };
//     });

//     const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
//     const results = {
//       score,
//       correctAnswers,
//       totalQuestions: quiz.questions.length,
//       //timeSpent, //remember to update this line
//       questionResults,
//       quizTitle: quiz.title
//     };

//     // Navigate to results page with data
//     // router.push({
//     //   pathname: '/quiz/results',
//     //   query: { data: JSON.stringify(results) }     remember to update this line
//     // });     
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading quiz...</div>
//       </div>
//     );
//   }

//   if (!quiz) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl text-red-600">Quiz not found</div>
//       </div>
//     );
//   }

//   const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;


//   const ques = {
//         id: "q1",
//         question:
//           "What is the correct way to declare a variable in JavaScript?",
//         options: [
//           "var myVar = 5;",
//           "variable myVar = 5;",
//           "v myVar = 5;",
//           "declare myVar = 5;",
//         ],
//         correctAnswer: "A",
//         userAnswer: "A",
//         isCorrect: true,
//         explanation:
//           "In JavaScript, variables are declared using var, let, or const keywords.",
//       }
//   return (
//     <div className="px-8">
//       <div className="flex justify-between mb-4 p-8">
//         <p>Quiz Heading</p>
//         <p className="text-blue-600">Time Left: 60 Minutes</p>
//       </div>
//       <QuestionBanner question={ques} selectedAnswer={""} onAnswer={function (questionId: string, optionValue: string): void {
//         throw new Error("Function not implemented.")
//       } }/>
//     </div>
//   )
// }

// export default QuizSession

// app/quiz-session/[id]/page.tsx
"use client";

import QuestionBanner from "@/components/Quiz/QuestionBanner";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { getQuizById, Quiz } from "@/lib/mockQuizData";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const QuizSession = ({ params }: PageProps) => {
  // Unwrap params using React.use() for Next.js 15
  const { id } = use(params);
  
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Fetch quiz data (currently from mock data)
    const quizData = getQuizById(id);
    if (quizData) {
      setQuiz(quizData);
      setStartTime(new Date());
      setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
    }
    setLoading(false);
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          calculateResults();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, timeLeft]);

  const handleAnswer = (questionId: string, selectedAnswer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const calculateResults = () => {
    if (!quiz || !startTime) return;

    const endTime = new Date();
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    let correctAnswers = 0;
    const questionResults = quiz.questions.map((question) => {
      const userAnswer = answers[question.id] || "";
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        id: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        options: question.options,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    const results = {
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeSpent,
      questionResults,
      quizTitle: quiz.title,
      quizId: quiz.id,
    };

    // Navigate to results page with data
    router.push(
      `/dashboard/stem-quizzes/report?data=${encodeURIComponent(
        JSON.stringify(results)
      )}`
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <div className="text-xl text-red-600 mb-4">Quiz not found</div>
          <button
            onClick={() => router.push("/dashboard/stem-quizzes")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            {quiz.title}
          </h1>
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm md:text-base">
              TIME LEFT: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar with Numbered Circles */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto pb-2">
          {quiz.questions.map((_, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <div
                className={`
                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300
                ${
                  index < currentQuestion
                    ? "bg-blue-600 text-white"
                    : index === currentQuestion
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : answers[quiz.questions[index].id]
                    ? "bg-blue-200 text-blue-700"
                    : "bg-gray-200 text-gray-500"
                }
              `}
              >
                {index + 1}
              </div>
              {index < quiz.questions.length - 1 && (
                <div
                  className={`w-4 md:w-8 h-1 mx-0.5 md:mx-1 transition-all duration-300 ${
                    index < currentQuestion ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question Banner */}
      <div className="max-w-6xl mx-auto">
        <QuestionBanner
          question={currentQ}
          selectedAnswer={answers[currentQ.id] || ""}
          onAnswer={handleAnswer}
         // questionNumber={currentQuestion + 1}
         // totalQuestions={quiz.questions.length}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-6xl mx-auto mt-8 flex justify-between items-center flex-wrap gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
            ${
              currentQuestion === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <button
          onClick={handleSkip}
          className="text-blue-600 font-medium hover:underline flex items-center gap-1"
        >
          Skip
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          {currentQuestion === quiz.questions.length - 1 ? "Submit" : "Next"}
          {currentQuestion < quiz.questions.length - 1 && (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Question Progress Text */}
      <div className="max-w-6xl mx-auto mt-4 text-center text-gray-500 text-sm">
        Question {currentQuestion + 1} of {quiz.questions.length}
      </div>
    </div>
  );
};

export default QuizSession;