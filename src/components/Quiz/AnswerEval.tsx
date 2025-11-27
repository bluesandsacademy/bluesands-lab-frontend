import React from "react";

const AnswerEval = () => {
  const mockQuiz = {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: [
      {
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
      },
      {
        id: "q2",
        question:
          "Which method is used to add an element to the end of an array?",
        options: ["append()", "push()", "add()", "insert()"],
        correctAnswer: "B",
        userAnswer: "A",
        isCorrect: false,
        explanation:
          "The push() method adds one or more elements to the end of an array.",
      },
      {
        id: "q3",
        question: 'What does "===" operator do in JavaScript?',
        options: [
          "Checks for equality only",
          "Checks for strict equality (value and type)",
          "Assigns a value",
          "Compares strings only",
        ],
        correctAnswer: "B",
        userAnswer: "B",
        isCorrect: true,
        explanation:
          "The === operator checks for strict equality, comparing both value and type.",
      },
    ],
  };

  return (
    <div className="p-4 mt-4 lg:mt-12">
      <div className="border-b pb-4 mb-4 flex justify-between">
        <p>Your Answers</p>
        <div className="flex gap-2">
          <p>share</p>
          <p>prnt</p>
          <p>dwnld</p>
        </div>
      </div>
      <div className="w-full lg:w-[70%]">
        {mockQuiz.questions.map((ques, quesIndex) => {
          const questionLabel = String.fromCharCode(49 + quesIndex); // 49 = '1'
          const selectedIndex = ques.userAnswer.charCodeAt(0) - 65;
          const correctIndex = ques.correctAnswer.charCodeAt(0) - 65;
          return (
            <div key={ques.id} className="p-4">
              <p
                className={`font-bold mb-2 ${
                  ques.isCorrect ? "text-green-500" : "text-red-500"
                }`}
              >
                {ques.isCorrect ? "Correct" : "Incorrect"}
              </p>

              <p className="font-semibold mb-4"><span className="font-semibold">{questionLabel}.</span>{" "}{ques.question}</p>
              {ques.options.map((option, optIndex) => {
                const optionLabel = String.fromCharCode(65 + optIndex); // 65 = 'A'
                const isSelected = optIndex === selectedIndex;
                const isCorrectAnswer = optIndex === correctIndex;

                let textColor = "text-gray-800";
                let annotation = "";

                if (ques.isCorrect && isSelected) {
                  textColor = "text-green-600";
                  annotation = "✅ Your answer";
                } else if (!ques.isCorrect && isSelected) {
                  textColor = "text-red-600";
                  annotation = "❌ Your answer";
                } else if (!ques.isCorrect && isCorrectAnswer) {
                  textColor = "text-green-600";
                  annotation = "✅ Correct Answer";
                }

                return (
                  <p key={optIndex} className={`mb-2 ${textColor}`}>
                    <span className="font-semibold">{optionLabel}.</span>{" "}
                    {option}
                    {annotation && (
                      <span className="ml-2 italic">{annotation}</span>
                    )}
                  </p>
                );
              })}
               {ques.explanation && (
          <p className="mt-2 text-sm text-gray-600 italic">Explanation: {ques.explanation}</p>
        )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerEval;

export const quizExample = {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: [
      {
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
      },
      {
        id: "q2",
        question:
          "Which method is used to add an element to the end of an array?",
        options: ["append()", "push()", "add()", "insert()"],
        correctAnswer: "B",
        userAnswer: "A",
        isCorrect: false,
        explanation:
          "The push() method adds one or more elements to the end of an array.",
      },
      {
        id: "q3",
        question: 'What does "===" operator do in JavaScript?',
        options: [
          "Checks for equality only",
          "Checks for strict equality (value and type)",
          "Assigns a value",
          "Compares strings only",
        ],
        correctAnswer: "B",
        userAnswer: "B",
        isCorrect: true,
        explanation:
          "The === operator checks for strict equality, comparing both value and type.",
      },
    ],
  };