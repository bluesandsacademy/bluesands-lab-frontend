import React from "react";
import { BsBook } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { FaClock, FaPlus } from "react-icons/fa";

const spaces = [
  {
    title: "Newton first law",
    preSim: false,
    postSim: true,
    draft: true,
    published:true,
    points: 100,
    time: "30 minutes",
  },
  {
    title: "Newton first law",
    preSim: true,
    postSim: true,
    draft: true,
    published:false,
    points: 100,
    time: "30 minutes",
  },
  {
    title: "Newton first law",
    preSim: true,
    postSim: true,
    draft: true,
    published:false,
    points: 100,
    time: "30 minutes",
  },
  {
    title: "Newton first law",
    preSim: false,
    postSim: true,
    draft: true,
    published: true,
    points: 100,
    time: "30 minutes",
  },
  {
    title: "Newton first law",
    preSim: false,
    postSim: true,
    draft: true,
    published:false,
    points: 100,
    time: "30 minutes",
  },
  {
    title: "Newton first law",
    preSim: true,
    postSim: true,
    draft: true,
    published:false,
    points: 100,
    time: "30 minutes",
  },
];


const TeacherLearningSpacePage = () => {
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
          // onClick={() => setIsCreateSpaceOpen(true)}
          className="bg-blue-800 text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5"
        >
          {" "}
          <FaPlus /> Create Learning Space
        </button>
      </div>

      {/* Section */}
      <div>
        <input type="search" name="" id="" />
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
              // onClick={() => setIsCreateSpaceOpen(true)}
              className="bg-blue-800 text-xs lg:text-sm p-2 rounded-md text-white flex items-center gap-1.5"
            >
              {" "}
              <FaPlus /> Create Learning Space
            </button>
          </div>
        )}
        {spaces.map((space, index) => (
          // Card
          <div className="flex flex-col gap-2 bg-white rounded-md border border-gray-200 p-4">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <p>icon</p>
                <p>{space.title}</p>
              </div>
              <div>
                <p>opt</p>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <p>{space.points} Points</p>
              <p className="flex gap-2 items-center">
                <FaClock /> {space.time}
              </p>
            </div>
            <div>
              {space.preSim && <p>Pre-sim quiz available</p>}
              {space.postSim && <p>Post-sim quiz available</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherLearningSpacePage;
