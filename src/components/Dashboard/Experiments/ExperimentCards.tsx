import { useRouter } from "next/navigation";
import React from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { LuClock3 } from "react-icons/lu";

type PhETSimulationData = {
  title: string;
  url: string;
  description: string;
};

const ExperimentCard = ({ lab }: { lab: PhETSimulationData }) => {
  const router = useRouter();

  const handleClick = () => {
    const query = new URLSearchParams({
      simulationUrl: lab.url,
      title: lab.title,
    }).toString();

    router.push(`/dashboard/experiments/launch?${query}`);
  };
  return (
    <div className="flex flex-col gap-2 rounded overflow-hidden w-80 bg-white">
      <div className="flex items-center justify-center w-full bg-gray-400 text-white rounded-sm">
        <img src="\images\pictures\lab-img.jpg" alt="lab-image" />
      </div>
      <div className="flex flex-col gap-2 px-2">
        <p className="text-xs md:text-sm font-semibold">{lab.title}</p>
        {/* <p className="text-xs">
              {description.length < 16 ? description : truncatedDesc}
            </p> */}
        <p className="text-xs">{lab.description}</p>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600 flex items-center gap-1">
              {" "}
              <LuClock3 className="text-blue-600" /> {}
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              {" "}
              <IoMdCalendar className="text-blue-600" />
            </p>
          </div>
          <p className="text-xs md:text-sm flex items-center gap-2">
            {" "}
            <FaQuestionCircle className="text-blue-600" /> Unattempt
          </p>
        </div>
        <button
          className="bg-bgBlue text-white w-full p-2 rounded-md text-sm"
          onClick={handleClick}
        >
          Go to lab
        </button>
      </div>
    </div>
  );
};

export default ExperimentCard;
