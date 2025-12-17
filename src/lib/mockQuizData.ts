// lib/mockQuizData.ts

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  type: 'pre-sim' | 'post-sim';
  questions: Question[];
}

export const mockQuizzes: Quiz[] = [
  {
    id: "physics-pre-sim-1",
    title: "Physics Pre-Simulation Assessment",
    description: "Test your knowledge before the simulation",
    duration: 60,
    category: "Physics",
    type: "pre-sim",
    questions: [
      {
        id: "q1",
        question: "What is The Diels-Alder reaction is one of the most important reactions of organic chemistry since they are used in synthesizing six-membered ringed cyclic organic compounds.",
        options: [
          "It is a [4+2] cycloaddition reaction.",
          "It is a free radical substitution reaction.",
          "It involves a [2+2] cycloaddition process",
          "It occurs only in the presence of ultraviolet light."
        ],
        correctAnswer: "A",
        explanation: "The Diels-Alder reaction is a [4+2] cycloaddition reaction between a conjugated diene and a dienophile."
      },
      {
        id: "q2",
        question: "Which of the following best describes Newton's Second Law of Motion?",
        options: [
          "An object at rest stays at rest",
          "Force equals mass times acceleration",
          "For every action, there is an equal and opposite reaction",
          "Energy cannot be created or destroyed"
        ],
        correctAnswer: "B",
        explanation: "Newton's Second Law states that F = ma, where force equals mass times acceleration."
      },
      {
        id: "q3",
        question: "What is the SI unit of electric current?",
        options: [
          "Volt",
          "Ampere",
          "Ohm",
          "Watt"
        ],
        correctAnswer: "B",
        explanation: "The Ampere (A) is the SI unit of electric current, measuring the flow of electric charge."
      },
      {
        id: "q4",
        question: "Which type of electromagnetic radiation has the longest wavelength?",
        options: [
          "Gamma rays",
          "X-rays",
          "Visible light",
          "Radio waves"
        ],
        correctAnswer: "D",
        explanation: "Radio waves have the longest wavelength in the electromagnetic spectrum."
      },
      {
        id: "q5",
        question: "What is the law of conservation of energy?",
        options: [
          "Energy always increases in a system",
          "Energy can be created but not destroyed",
          "Energy cannot be created or destroyed, only transformed",
          "Energy decreases over time"
        ],
        correctAnswer: "C",
        explanation: "The law of conservation of energy states that energy cannot be created or destroyed, only converted from one form to another."
      }
    ]
  },
  {
    id: "physics-post-sim-1",
    title: "Physics Post-Simulation Assessment",
    description: "Test your knowledge after the simulation",
    duration: 60,
    category: "Physics",
    type: "post-sim",
    questions: [
      {
        id: "q1",
        question: "What did you observe about projectile motion in the simulation?",
        options: [
          "The horizontal velocity remains constant",
          "The vertical velocity remains constant",
          "Both velocities increase over time",
          "The object moves in a straight line"
        ],
        correctAnswer: "A",
        explanation: "In projectile motion, the horizontal velocity remains constant (ignoring air resistance), while the vertical velocity changes due to gravity."
      },
      {
        id: "q2",
        question: "How does increasing the launch angle affect the range of a projectile?",
        options: [
          "Range always increases",
          "Range is maximum at 45 degrees",
          "Range always decreases",
          "Angle has no effect on range"
        ],
        correctAnswer: "B",
        explanation: "For a given initial velocity, the maximum range is achieved at a 45-degree launch angle."
      },
      {
        id: "q3",
        question: "What happens to kinetic energy as a pendulum reaches its highest point?",
        options: [
          "It is at maximum",
          "It is at minimum",
          "It remains constant",
          "It becomes negative"
        ],
        correctAnswer: "B",
        explanation: "At the highest point, the pendulum momentarily stops, so kinetic energy is at minimum (zero) and potential energy is at maximum."
      },
      {
        id: "q4",
        question: "In the collision simulation, what is conserved in an elastic collision?",
        options: [
          "Only momentum",
          "Only kinetic energy",
          "Both momentum and kinetic energy",
          "Neither momentum nor kinetic energy"
        ],
        correctAnswer: "C",
        explanation: "In an elastic collision, both momentum and kinetic energy are conserved."
      },
      {
        id: "q5",
        question: "How does mass affect the period of a simple pendulum?",
        options: [
          "Greater mass increases the period",
          "Greater mass decreases the period",
          "Mass has no effect on the period",
          "Mass only affects amplitude"
        ],
        correctAnswer: "C",
        explanation: "The period of a simple pendulum depends only on length and gravity, not on mass."
      }
    ]
  }
];

export const getQuizById = (id: string): Quiz | undefined => {
  return mockQuizzes.find(quiz => quiz.id === id);
};