"use client"

import { CreateLearningSpaceModal } from "@/components/Teacher/LearningSpaces/CreateLearningSpace";
import React, { useState } from "react";
import { BsBook } from "react-icons/bs";
//import { CgNotes } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import { SlOptionsVertical } from "react-icons/sl";

const spaces: any[] = [
  // {
  //   title: "Newton first law",
  //   preSim: false,
  //   postSim: true,
  //   draft: true,
  //   published: true,
  //   points: 100,
  //   time: "30 minutes",
  // },
  // {
  //   title: "Newton first law",
  //   preSim: true,
  //   postSim: true,
  //   draft: true,
  //   published: false,
  //   points: 100,
  //   time: "30 minutes",
  // },
  // {
  //   title: "Newton first law",
  //   preSim: true,
  //   postSim: true,
  //   draft: true,
  //   published: false,
  //   points: 100,
  //   time: "30 minutes",
  // },
  // {
  //   title: "Newton first law",
  //   preSim: false,
  //   postSim: true,
  //   draft: true,
  //   published: true,
  //   points: 100,
  //   time: "30 minutes",
  // },
  // {
  //   title: "Newton first law",
  //   preSim: false,
  //   postSim: true,
  //   draft: true,
  //   published: false,
  //   points: 100,
  //   time: "30 minutes",
  // },
  // {
  //   title: "Newton first law",
  //   preSim: true,
  //   postSim: true,
  //   draft: true,
  //   published: false,
  //   points: 100,
  //   time: "30 minutes",
  // },
];

const TeacherLearningSpacePage = () => {
  const [isCreateSpaceOpen, setIsCreateSpaceOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 lg:gap-12 p-2 md:p-4 lg:p-8">
      {/* Section */}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col lg:gap-1.5">
          <p className="lg:text-lg font-semibold">Learning Spaces</p>
          <p className="text-xs md:text-sm text-gray-400">
            Create and manage simulation based lessons.
          </p>
        </div>

        <button
          onClick={() => setIsCreateSpaceOpen(true)}
          className="bg-blue-800 text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5"
        >
          {" "}
          <FaPlus /> Create Learning Space
        </button>
      </div>

      {/* Section */}
      <div>
        <input
          type="search"
          name=""
          id=""
          placeholder="Search learning spaces"
          className="p-2 rounded-md border border-gray-200"
        />
      </div>

      {/* Section */}
      <div
        className={
          spaces.length < 1
            ? "flex flex-col w-full h-full items-center justify-center"
            : "grid w-full h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        }
      >
        {/* Fallback for empty array */}
        {spaces.length < 1 && (
          <div className="flex flex-col items-center gap-2 mx-auto bg-white rounded-xl border border-gray-200 p-2 lg:p-5">
            <div className="rounded-2xl p-3 bg-violet-100 flex items-center justify-center">
              <BsBook className="text-blue-800 text-2xl" />
            </div>
            <p className="lg:text-lg font-semibold">No Learning Space yet.</p>
            <p className="text-gray-400 text-sm lg:text-base text-center lg:text-wrap lg:w-[70%]">
              Create your first learning space to get started with simulations
              based teaching.
            </p>
            <button
              onClick={() => setIsCreateSpaceOpen(true)}
              className="bg-blue-800 text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5"
            >
              {" "}
              <FaPlus /> Create Learning Space
            </button>
          </div>
        )}
        {spaces.map((space, index) => (
          // Card
          <div className="flex flex-col gap-2 lg:gap-4 bg-white rounded-md border border-gray-200 p-4">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <div className="flex items-center justify-center rounded-full bg-indigo-200 p-2">
                  <BsBook className="text-2xl text-indigo-700" />
                </div>
                <p className="lg:text-lg font-semibold">{space.title}</p>
              </div>
              <div>
                <button>
                  <SlOptionsVertical />
                </button>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <p className="p-0.5 px-1 rounded bg-gray-200">
                {space.points} Points
              </p>
              <p className="flex gap-2 items-center">
                <LuClock3 /> {space.time}
              </p>
            </div>
            <div>
              {space.preSim && (
                <p className="text-gray-400">Pre-sim quiz available</p>
              )}
              {/* {space.postSim && <p>Post-sim quiz available</p>} */}
            </div>
          </div>
        ))}
      </div>

      {isCreateSpaceOpen && (
        <CreateLearningSpaceModal
          isOpen={isCreateSpaceOpen}
          onClose={() => setIsCreateSpaceOpen(false)}
          //onSuccess={() => refetchSpaces()}
        />
      )}
    </div>
  );
};

export default TeacherLearningSpacePage;
