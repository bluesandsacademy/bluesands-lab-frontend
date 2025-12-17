// import React from "react";

// const AnswerEval = () => {
//   const mockQuiz = {
//     id: "1",
//     title: "JavaScript Fundamentals",
//     description: "Test your knowledge of JavaScript basics",
//     questions: [
//       {
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
//       },
//       {
//         id: "q2",
//         question:
//           "Which method is used to add an element to the end of an array?",
//         options: ["append()", "push()", "add()", "insert()"],
//         correctAnswer: "B",
//         userAnswer: "A",
//         isCorrect: false,
//         explanation:
//           "The push() method adds one or more elements to the end of an array.",
//       },
//       {
//         id: "q3",
//         question: 'What does "===" operator do in JavaScript?',
//         options: [
//           "Checks for equality only",
//           "Checks for strict equality (value and type)",
//           "Assigns a value",
//           "Compares strings only",
//         ],
//         correctAnswer: "B",
//         userAnswer: "B",
//         isCorrect: true,
//         explanation:
//           "The === operator checks for strict equality, comparing both value and type.",
//       },
//     ],
//   };

//   return (
//     <div className="p-4 mt-4 lg:mt-12">
//       <div className="border-b pb-4 mb-4 flex justify-between">
//         <p>Your Answers</p>
//         <div className="flex gap-2">
//           <p>share</p>
//           <p>prnt</p>
//           <p>dwnld</p>
//         </div>
//       </div>
//       <div className="w-full lg:w-[70%]">
//         {mockQuiz.questions.map((ques, quesIndex) => {
//           const questionLabel = String.fromCharCode(49 + quesIndex); // 49 = '1'
//           const selectedIndex = ques.userAnswer.charCodeAt(0) - 65;
//           const correctIndex = ques.correctAnswer.charCodeAt(0) - 65;
//           return (
//             <div key={ques.id} className="p-4">
//               <p
//                 className={`font-bold mb-2 ${
//                   ques.isCorrect ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {ques.isCorrect ? "Correct" : "Incorrect"}
//               </p>

//               <p className="font-semibold mb-4"><span className="font-semibold">{questionLabel}.</span>{" "}{ques.question}</p>
//               {ques.options.map((option, optIndex) => {
//                 const optionLabel = String.fromCharCode(65 + optIndex); // 65 = 'A'
//                 const isSelected = optIndex === selectedIndex;
//                 const isCorrectAnswer = optIndex === correctIndex;

//                 let textColor = "text-gray-800";
//                 let annotation = "";

//                 if (ques.isCorrect && isSelected) {
//                   textColor = "text-green-600";
//                   annotation = "✅ Your answer";
//                 } else if (!ques.isCorrect && isSelected) {
//                   textColor = "text-red-600";
//                   annotation = "❌ Your answer";
//                 } else if (!ques.isCorrect && isCorrectAnswer) {
//                   textColor = "text-green-600";
//                   annotation = "✅ Correct Answer";
//                 }

//                 return (
//                   <p key={optIndex} className={`mb-2 ${textColor}`}>
//                     <span className="font-semibold">{optionLabel}.</span>{" "}
//                     {option}
//                     {annotation && (
//                       <span className="ml-2 italic">{annotation}</span>
//                     )}
//                   </p>
//                 );
//               })}
//                {ques.explanation && (
//           <p className="mt-2 text-sm text-gray-600 italic">Explanation: {ques.explanation}</p>
//         )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default AnswerEval;

// export const quizExample = {
//     id: "1",
//     title: "JavaScript Fundamentals",
//     description: "Test your knowledge of JavaScript basics",
//     questions: [
//       {
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
//       },
//       {
//         id: "q2",
//         question:
//           "Which method is used to add an element to the end of an array?",
//         options: ["append()", "push()", "add()", "insert()"],
//         correctAnswer: "B",
//         userAnswer: "A",
//         isCorrect: false,
//         explanation:
//           "The push() method adds one or more elements to the end of an array.",
//       },
//       {
//         id: "q3",
//         question: 'What does "===" operator do in JavaScript?',
//         options: [
//           "Checks for equality only",
//           "Checks for strict equality (value and type)",
//           "Assigns a value",
//           "Compares strings only",
//         ],
//         correctAnswer: "B",
//         userAnswer: "B",
//         isCorrect: true,
//         explanation:
//           "The === operator checks for strict equality, comparing both value and type.",
//       },
//     ],
//   };

// components/Quiz/AnswerEval.tsx
import React from "react";

interface QuestionResult {
  id: string;
  question: string;
  options: string[];
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface AnswerEvalProps {
  questions: QuestionResult[];
}

const AnswerEval: React.FC<AnswerEvalProps> = ({ questions }) => {
  const handleShare = () => {
    // Implement share functionality
    alert("Share functionality coming soon!");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement download as PDF functionality
    alert("Download functionality coming soon!");
  };

  return (
    <div className="p-4 mt-4 lg:mt-12">
      <div className="border-b pb-4 mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Answers</h2>
        <div className="flex gap-4">
          <button
            onClick={handleShare}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
          <button
            onClick={handlePrint}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
          <button
            onClick={handleDownload}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        </div>
      </div>

      <div className="w-full lg:w-[70%]">
        {questions.map((ques, quesIndex) => {
          const questionLabel = quesIndex + 1;
          const selectedIndex = ques.userAnswer
            ? ques.userAnswer.charCodeAt(0) - 65
            : -1;
          const correctIndex = ques.correctAnswer.charCodeAt(0) - 65;

          return (
            <div key={ques.id} className="p-4 mb-6 bg-white rounded-lg shadow">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    ques.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ques.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </div>
              </div>

              <p className="font-semibold mb-4 text-gray-800">
                <span className="font-bold">{questionLabel}.</span>{" "}
                {ques.question}
              </p>

              <div className="space-y-2">
                {ques.options.map((option, optIndex) => {
                  const optionLabel = String.fromCharCode(65 + optIndex);
                  const isSelected = optIndex === selectedIndex;
                  const isCorrectAnswer = optIndex === correctIndex;

                  let bgColor = "bg-gray-50";
                  let textColor = "text-gray-800";
                  let borderColor = "border-gray-200";
                  let annotation = "";

                  if (ques.isCorrect && isSelected) {
                    bgColor = "bg-green-50";
                    textColor = "text-green-700";
                    borderColor = "border-green-300";
                    annotation = "✅ Your answer";
                  } else if (!ques.isCorrect && isSelected) {
                    bgColor = "bg-red-50";
                    textColor = "text-red-700";
                    borderColor = "border-red-300";
                    annotation = "❌ Your answer";
                  } else if (!ques.isCorrect && isCorrectAnswer) {
                    bgColor = "bg-green-50";
                    textColor = "text-green-700";
                    borderColor = "border-green-300";
                    annotation = "✅ Correct Answer";
                  }

                  return (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor}`}
                    >
                      <p className={`${textColor} flex items-start gap-2`}>
                        <span className="font-semibold min-w-[24px]">
                          {optionLabel}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {annotation && (
                          <span className="font-medium text-sm whitespace-nowrap">
                            {annotation}
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              {ques.explanation && (
                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-700">
                      Explanation:
                    </span>{" "}
                    {ques.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerEval;