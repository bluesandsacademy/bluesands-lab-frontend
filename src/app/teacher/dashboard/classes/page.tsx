"use client";

import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import LearningSpace from "@/components/LearningSpace/LearningSpace";
import { CreateLearningSpaceModal } from "@/components/Teacher/LearningSpaces/CreateLearningSpace";
import Link from "next/link";
import { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";

const statsConfig: StatCardData[] = [
  {
    title: "Total Students",
    value: "0",
    icon: "/images/icon/teacher/students.svg",
    //trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "across all classes",
  },
  {
    title: "Active Students",
    value: "0",
    icon: "/images/icon/teacher/active-students.svg",
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "out of total enrolled",
  },
  {
    title: "Average Performance",
    value: "0",
    icon: "/images/icon/teacher/avg-score.svg",
    // trendIcon: "/images/icon/trend_up.svg",
    percentageChange: "0%",
    timeFrame: "from last month",
  },
  {
    title: "Active Assignments",
    value: "0",
    icon: "/images/icon/teacher/orange-quiz.svg",
    //trendIcon: "/images/icon/trend_up.svg",
    percentageChange: " ",
    timeFrame: "All classes",
  },
];

const TeacherClassManagementPage = () => {
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 p-2 lg:p-4">
        <div className="flex justify-end">
          {/* <button className="bg-[#303C48] text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5">
            <FaPlus /> Create New Class
          </button> */}
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap gap-2 justify-between p-2 rounded-md bg-white">
          <div className="flex flex-col md:flex-row  gap-2 md:gap-4">
            <button
              onClick={() => setIsCreateSpaceOpen(true)}
              className="bg-[#00B69B] w-fit text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5"
            >
              {" "}
              <CgNotes /> Create Learning Space
            </button>
            <Link href={"/teacher/dashboard/classes/learning-space"}>
              <button className="bg-[#006FCC] text-xs lg:text-sm h-full p-2 rounded-md text-white flex items-center gap-1.5">
                <FaRegEdit /> My Learning Spaces
              </button>
            </Link>
          </div>

          <div className="flex gap-2 lg:gap-4 flex-col md:flex-row">
            <select
              name="class"
              id="class"
              className="text-sm p-2 rounded border border-gray-100"
            >
              <option value="Physics 101">Physics 101</option>
              <option value="Chemistry 101">Chemistry 101</option>
              <option value="Math 101">Math 101</option>
            </select>

            <button className="flex flex-col text-xs bg-blue-50 rounded-md p-1.5 items-start">
              <p className="text-[7px]">CLASS CODE</p>
              <p className="italic flex items-center gap-1.5 text-bgBlue">
                PHY101 <IoCopyOutline />
              </p>
            </button>
          </div>
        </div>
        <StatCards stats={statsConfig} />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <p className="text-sm font-semibold">Student List</p>
            <button className="bg-[#006FCC] text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5">
              <FaPlus /> Add Student
            </button>
          </div>
          <div className="flex flex-col overflow-x-scroll">
            <table className="bg-white rounded-md">
              <thead>
                <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                  <td className="p-2">Student Name</td>
                  <td className="p-2">Student Email</td>
                  <td className="p-2">Phone Number</td>
                  <td className="p-2">Date Joined</td>
                  <td className="p-2">Performance</td>
                  <td className="p-2">Status</td>
                  <td className="p-2">Action</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs border-b border-b-gray-200">
                  <td className="p-2">Jaydee Doe</td>
                  <td className="p-2">john@doe</td>
                  <td className="p-2">0900000000</td>
                  <td className="p-2">dd-mm-yyyy</td>
                  <td className="p-2 text-blue-600">88%</td>
                  <td className="p-2">
                    <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                      {" "}
                      Active
                    </p>
                  </td>
                  <td className="p-2">
                    <button className=" flex gap-1 items-center">
                      <SlOptionsVertical />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Recent Assignments</p>
          <div
            className="flex flex-col
         overflow-x-scroll"
          >
            <table className="bg-white rounded-md">
              <thead>
                <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                  <td className="p-2">Topic</td>
                  <td className="p-2">Type</td>
                  <td className="p-2">Due Date</td>
                  <td className="p-2">Turned In</td>
                  <td className="p-2">Performance</td>
                  <td className="p-2">Status</td>
                  <td className="p-2">Action</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs border-b border-b-gray-200">
                  <td className="p-2">Acid-Base</td>
                  <td className="p-2">Experiment</td>
                  <td className="p-2">dd-mm-yyyy at hh:mm</td>
                  <td className="p-2">21/24 Turned in</td>
                  <td className="p-2 text-blue-600">88%</td>
                  <td className="p-2">
                    <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                      {" "}
                      Active
                    </p>
                  </td>
                  <td className="p-2">
                    <button className=" flex gap-1 items-center">
                      <SlOptionsVertical />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateSpaceOpen && (
        <CreateLearningSpaceModal
          isOpen={isCreateSpaceOpen}
          onClose={() => setIsCreateSpaceOpen(false)}
          //onSuccess={() => refetchSpaces()}
        />
      )}
    </>
  );
};

export default TeacherClassManagementPage;
