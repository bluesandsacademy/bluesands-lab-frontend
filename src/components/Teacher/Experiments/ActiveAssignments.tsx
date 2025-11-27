import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import React, { useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";

const ActiveAssignments = () => {
    const [isLoading, setIsLoading] = useState(false)

  const statsConfig: StatCardData[] = [
    {
      title: "Total Assignments",
      value: "0",
      icon: "/images/icon/teacher/students.svg",
      //trendIcon: "/images/icon/trend_up.svg",
    //   percentageChange: " ",
    //   timeFrame: "of 450 total",
    },
    {
      title: "Students Assigned",
      value: "0",
      icon: "/images/icon/teacher/avg-score.svg",
      // trendIcon: "/images/icon/trend_up.svg",
    //   percentageChange: "0%",
    //   timeFrame: "from last month",
    },
    {
      title: "Completion Rate",
      value: "0",
      icon: "/images/icon/teacher/purple-lab.svg",
      // trendIcon: "/images/icon/trend_up.svg",
    //   percentageChange: " ",
    //   timeFrame: "total attempts this month",
    },
    {
      title: "Average Score",
      value: "0",
      icon: "/images/icon/teacher/orange-quiz.svg",
      //trendIcon: "/images/icon/trend_up.svg",
    //   percentageChange: " ",
    //   timeFrame: "Average completion rate",
    },
  ];

  return (
    <div className="flex flex-col gap-3 lg:gap-6">
      <StatCards stats={statsConfig} isLoading={isLoading}/>

      <div className="flex flex-col">
        <p className="text-sm font-semibold">Active Assignments</p>
        <div className="flex flex-col overflow-x-scroll">
          <table className="bg-white rounded-md">
            <thead>
              <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                <td className="p-2">Experiment</td>
                <td className="p-2">Type</td>
                <td className="p-2">Assigned To</td>
                <td className="p-2">Due Date</td>
                <td className="p-2">Turned In</td>
                <td className="p-2">Average Score</td>
                <td className="p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs border-b border-b-gray-200">
                <td className="p-2">Exp Title</td>
                <td className="p-2">
                  <p className="flex bg-yellow-100 text-yellow-600 p-1 w-20 rounded-full items-center justify-center">
                    Test
                  </p>
                </td>
                <td className="p-2">
                  <p>Class</p>
                </td>
                <td className="p-2">
                  <p>dd-mm-yyyy</p>
                </td>
                <td className="p-2">
                  <p>22/30</p>
                </td>
                <td className="p-2">
                  <p className="bg-green-100 w-max text-blue-600 p-1 rounded-full">
                    85%
                  </p>
                </td>
                <td>
                  <button>
                    <SlOptionsVertical />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveAssignments;
