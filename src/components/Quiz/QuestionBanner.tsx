"use client"
interface Question {
    id: string
  question: string;
  options: string[];
}

interface BannerProps {
  question: Question;
  selectedAnswer: string;
  onAnswer: (questionId :string, optionValue: string)=>  void;
}

const QuestionBanner = ({
  question,
  selectedAnswer,
  onAnswer,
}: BannerProps) => {
  //   const [selected, setSelected] = useState(Number||null);
  return (
    <div className="p-3 md:p-5 space-y-6 md:space-y-10">
      {/* Question Section */}
      <div className="relative rounded-lg overflow-hidden">
        <img
          src="/images/bg/welcome_cover.png"
          alt="welcome-background"
          className="w-full h-32 md:h-28 lg:h-20 object-cover"
        />
        <div className="absolute top-1/2 -translate-y-1/2 text-white left-4 md:left-10">
          {/* <h3 className="font-medium leading-tight md:leading-none my-0 text-lg md:text-2xl lg:text-3xl">
                Welcome Back, {question}
                </h3> */}
          <p className="my-0 text-sm md:text-md leading-normal md:leading-none">
            {question.question}
          </p>
        </div>
      </div>

      {/* Answer Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* {options.map((opt, index) => (
            <div
              key={index}
              onClick={() => setSelected(index)}
              className={
                selected === index
                  ? "p-6 bg-blue-600 text-white w-48 rounded-md"
                  : "p-6 bg-gray-200 text-black w-48 rounded-md"
              }
            >
              <p>{opt}</p>
            </div>
          ))} */}

          { Array.isArray(question?.options) &&
          question.options.map((option, index) => {
            const optionValue = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedAnswer === optionValue;

            return (
              <label
                key={optionValue}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionValue}
                  checked={isSelected}
                  onChange={() => onAnswer(question.id, optionValue)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <span
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-medium ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {optionValue}
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionBanner;
