import React from "react";

interface ReportTypeCardProps {
 title: string;
 description: string;
 availability: string; 
}

const ReportTypeCard = ({title, description, availability}: ReportTypeCardProps) => {
  return (
    <div className="flex flex-col w-52 md:w-64 lg:w-72 gap-2 rounded-md border border-gray-300 p-2 text-[#263238]">
      <p className="text-base lg:text-lg font-semibold">
        {title}
      </p>
      <div className="flex flex-col gap-1">
        <p className="text-xs lg:text-sm">{description}</p>
        <p className="text-gray-400 text-xs">{availability}</p>
      </div>
      <button className="rounded-md bg-blue-950 text-white text-xs p-2">Generate Report</button>
    </div>
  );
};

export default ReportTypeCard;
