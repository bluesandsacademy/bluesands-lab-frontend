"use client"
import { quizExample } from "@/components/Quiz/AnswerEval";
import QuestionBanner from "@/components/Quiz/QuestionBanner"
import { useRouter } from "next/router";
import { useState } from "react";


const QuizSession = () => {

  // const router = useRouter(); remember to update this line
  // const { id } = router.query;
  
  const quiz  = quizExample  //const [quiz, setQuiz] = useState(null); //remember to update this line
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // type AnswerValue = string | string[]; // single or multiple answers
  // const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  // useEffect(() => {
  //   if (id) {
  //     fetchQuiz(id);
  //     setStartTime(new Date());
  //   }
  // }, [id]);

  // const fetchQuiz = async (quizId) => {
  //   try {
  //     setLoading(true);
  //     // Replace with  axios API endpoint
  //     const response = await fetch(`/api/quiz/${quizId}`);
  //     const quizData = await response.json();
  //     setQuiz(quizData);
  //   } catch (error) {
  //     console.error('Error fetching quiz:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleAnswer = (questionId: number, selectedAnswer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const endTime = new Date();
   // const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
    let correctAnswers = 0;
    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        options: question.options,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    const results = {
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      //timeSpent, //remember to update this line
      questionResults,
      quizTitle: quiz.title
    };

    // Navigate to results page with data
    // router.push({
    //   pathname: '/quiz/results',
    //   query: { data: JSON.stringify(results) }     remember to update this line
    // });     
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Quiz not found</div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;


  const ques = {
        id: "q1",
        question:
          "What is the correct way to declare a variable in JavaScript?",
        options: [
          "var myVar = 5;",
          "variable myVar = 5;",
          "v myVar = 5;",
          "declare myVar = 5;",
        ],
        correctAnswer: "A",
        userAnswer: "A",
        isCorrect: true,
        explanation:
          "In JavaScript, variables are declared using var, let, or const keywords.",
      }
  return (
    <div className="px-8">
      <div className="flex justify-between mb-4 p-8">
        <p>Quiz Heading</p>
        <p className="text-blue-600">Time Left: 60 Minutes</p>
      </div>
      <QuestionBanner question={ques} selectedAnswer={""} onAnswer={function (questionId: string, optionValue: string): void {
        throw new Error("Function not implemented.")
      } }/>
    </div>
  )
}

export default QuizSession