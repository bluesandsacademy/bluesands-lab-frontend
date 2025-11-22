import { BiAtom } from "react-icons/bi";
import { LuClock } from "react-icons/lu";

interface CardProps {
    title: string;
    gradeLevel?: string;
    description?: string;
    subject?: string;
    keywords?: string[];
}

const TeacherExperimentCard = ({title, gradeLevel, description, subject, keywords}: CardProps) => {
  return (
    <div className="bg-white rounded-md p-2 flex flex-col gap-4 w-max md:w-[30rem]">
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex flex-col gap-2 md:gap-0">
            <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex items-center gap-1">
              <p className="text-sm lg:text-base font-semibold">
                {title}
              </p>
              <p className="flex items-center h-max p-1 px-2 bg-yellow-100 text-yellow-600 text-[0.5rem] rounded-full">
                {gradeLevel}
              </p>
            </div>
            <button className="bg-teal-600 text-white rounded p-1 px-2 text-xs w-max">
              Assign
            </button>
          </div>
          <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex gap-2">
          <p className="flex items-center gap-1">
            <BiAtom /> {subject}
          </p>
          <p className="flex items-center gap-1">
            <LuClock /> 90 Min
          </p>
        </div>
      </div>

      <div>
        {keywords?.map((keyword, index)=>(
            <p className="bg-gray-200 rounded-full text-gray-600 p-1 px-2 text-xs w-max" key={index}>
          {keyword}
        </p>
        ))}
      </div>
    </div>
  );
};

export default TeacherExperimentCard;
