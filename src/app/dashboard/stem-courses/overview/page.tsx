"use client"

import React, { useState } from "react";
import { BsHandIndexThumb } from "react-icons/bs";
import { FaQuestionCircle, FaRegHandPointUp } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import { RiFileCheckLine } from "react-icons/ri";

const CourseOverviewPage = () => {
    const [activeLesson, setActiveLesson] = useState("")
  return (
    <div className="flex flex-col p-1 md:p-2 lg:p-4">
      <iframe
        src="https://www.youtube.com/embed/6R8EFrK0Vk0"
        className="flex self-center rounded w-full h-52 md:h-80 lg:h-[315px] m-1 md:m-2 lg:m-4 mb-32"
        width="560"
        height="315"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Demo Video"
      ></iframe>
      <div className="flex flex-col md:flex-row flex-wrap justify-between gap-6">
        <div className="bg-white flex flex-col gap-4 p-3 rounded-md text-xs lg:text-sm lg:w-[48%]">
            <p className="font-semibold">Chapter 1</p>
            <div onClick={()=> setActiveLesson("lesson 01")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 01"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson One Topic</p>
                    <p className="text-gray-400">Lesson 01</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 01" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>

             <div onClick={()=> setActiveLesson("lesson 02")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 02"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Two Topic</p>
                    <p className="text-gray-400">Lesson 02</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 02" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>

             <div onClick={()=> setActiveLesson("lesson 03")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 03"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Three Topic</p>
                    <p className="text-gray-400">Lesson 03</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 03" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>
        </div>

         <div className="bg-white flex flex-col gap-4 p-3 rounded-md text-xs lg:text-sm lg:w-[48%]">
            <p className="font-semibold">Chapter 2</p>
            <div onClick={()=> setActiveLesson("lesson 04")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 04"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Four Topic</p>
                    <p className="text-gray-400">Lesson 04</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 04" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>

             <div onClick={()=> setActiveLesson("lesson 05")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 05"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Five Topic</p>
                    <p className="text-gray-400">Lesson 05</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 05" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>

             <div onClick={()=> setActiveLesson("lesson 06")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 06"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Six Topic</p>
                    <p className="text-gray-400">Lesson 06</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 06" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>
        </div>

         <div className="bg-white flex flex-col gap-4 p-3 rounded-md text-xs lg:text-sm lg:w-[48%]">
            <p className="font-semibold">Chapter 3</p>
            <div onClick={()=> setActiveLesson("lesson 07")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 07"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Seven Topic</p>
                    <p className="text-gray-400">Lesson 07</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 07" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>

             <div onClick={()=> setActiveLesson("lesson 08")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 08"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Eight Topic</p>
                    <p className="text-gray-400">Lesson 08</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 08" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>

             <div onClick={()=> setActiveLesson("lesson 09")} className={`flex justify-between p-2 gap-8 md:gap-16 lg:gap-28 border  ${activeLesson === "lesson 09"? "border-bgBlue" : "border-gray-200"} rounded`}>
                <div className="flex flex-col">
                    <p>Lesson Nine Topic</p>
                    <p className="text-gray-400">Lesson 09</p>
                </div>
                <p className={`flex items-center gap-1 rounded-md px-2  ${activeLesson === "lesson 09" ?"bg-bgBlue text-white":"bg-gray-200 text-gray-600"}`}><LuClock3 /> Duration</p>
            </div>
        </div>

         <div className="bg-white flex flex-col gap-4 p-3 rounded-md text-xs lg:text-sm lg:w-[48%]">
            <p className="font-semibold">Practice Questions</p>
            <div className={`flex justify-between items-center p-2 gap-8 md:gap-16 lg:gap-28 border border-gray-200 rounded`}>
                <div className="flex flex-col">
                    <p>Unattempt</p>
                    <p className="text-gray-400">Lesson 01</p>
                </div>
                <FaQuestionCircle className="text-bgBlue text-lg"/>
            </div>

             <div className={`flex justify-between items-center p-2 gap-8 md:gap-16 lg:gap-28 border border-gray-200 rounded`}>
                <div className="flex flex-col">
                    <p>Number Of Attempts</p>
                    <p className="text-gray-400">0</p>
                </div>
                <FaRegHandPointUp className="text-bgBlue text-lg"/>
            </div>

             <div className={`flex items-center justify-between p-2 gap-8 md:gap-16 lg:gap-28 border border-gray-200 rounded`}>
                <div className="flex flex-col">
                    <p>Grade</p>
                    <p className="text-gray-400">N/A</p>
                </div>
                <RiFileCheckLine className="text-bgBlue text-lg"/>
            </div>

            <button className="p-2 rounded-md bg-bgBlue text-white text-xs md:text-sm"> Start Practice Questions</button>
        </div> 
      </div>
    </div>
  );
};

export default CourseOverviewPage;
