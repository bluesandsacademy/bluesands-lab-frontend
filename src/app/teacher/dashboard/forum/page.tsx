"use client";

import { useState } from "react";
import CommunityFeed from "@/components/Teacher/Forum/feed";
import { MdSearch } from "react-icons/md";

const TeachersForumsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header Section */}
      <div className="flex flex-col border-b border-gray-300 items-center justify-center p-4 md:py-6 gap-2 md:gap-3 bg-white">
        <h1
          className="font-semibold text-lg md:text-xl lg:text-2xl text-center"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          Teacher Community
        </h1>
        <p
          className="text-xs md:text-sm text-gray-500 text-center px-4"
          style={{ fontFamily: "var(--font-jarkata)" }}
        >
          A space where teachers learn from teachers
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md px-4 md:px-0">
          <div className="bg-white rounded-lg flex items-center gap-2 px-3 py-2.5 shadow-sm border border-gray-200 w-full">
            <MdSearch className="text-gray-400 text-xl flex-shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm outline-none border-none bg-transparent text-gray-700 placeholder:text-gray-400"
              placeholder="Search discussions, resources or tips"
              style={{ fontFamily: "var(--font-jarkata)" }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 max-w-[1400px] mx-auto">
        {/* Left Sidebar - Quick Stats */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-white shadow-sm sticky top-4">
            <h2
              className="text-[#313D4F] font-semibold text-lg md:text-xl"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Quick Stats
            </h2>

            <div className="text-sm flex justify-between">
              <p className="font-semibold text-gray-600">Active Teachers</p>
              <p className="text-gray-600 font-semibold">1,246</p>
            </div>

            <div className="text-sm flex justify-between font-semibold text-gray-600">
              <p className="font-semibold text-gray-600">Discussions</p>
              <p>2,320</p>
            </div>

            <div className="text-sm flex justify-between font-semibold text-gray-600">
              <p className="font-semibold text-gray-600">Resources shared</p>
              <p className="text-gray-600">3,150</p>
            </div>
          </div>
        </aside>

        {/* Center - Community Feed */}
        <main className="flex-1 min-w-0">
          <CommunityFeed searchQuery={searchQuery} />
        </main>

        {/* Right Sidebar - Trending & Categories */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
          {/* Trending Topics */}
          <div className="rounded-xl bg-white flex flex-col gap-4 p-4 shadow-sm">
            <h2
              className="text-[#3749A6] text-lg md:text-xl font-semibold"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Trending Topics
            </h2>

            <div className="text-sm space-y-3">
              <div>
                <p className="font-semibold text-gray-900">
                  Best Free Math Resources
                </p>
                <p className="text-gray-500 text-xs">
                  (149 discussions this week)
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Gamification in Learning
                </p>
                <p className="text-gray-500 text-xs">
                  (112 discussions this week)
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Managing Large Classrooms
                </p>
                <p className="text-gray-500 text-xs">
                  (98 discussions this week)
                </p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-xl bg-white flex flex-col gap-3 p-4 shadow-sm">
            <h2
              className="font-semibold text-gray-900"
              style={{ fontFamily: "var(--font-jarkata)" }}
            >
              Categories
            </h2>

            <div className="space-y-2.5">
              <div className="text-sm flex justify-between text-gray-600 hover:text-primary cursor-pointer transition-colors">
                <p>Classroom Management</p>
                <p className="text-xs">49 Post(s)</p>
              </div>

              <div className="text-sm flex justify-between text-gray-600 hover:text-primary cursor-pointer transition-colors">
                <p>Lesson Planning</p>
                <p className="text-xs">38 Post(s)</p>
              </div>

              <div className="text-sm flex justify-between text-gray-600 hover:text-primary cursor-pointer transition-colors">
                <p>Technology</p>
                <p className="text-xs">56 Post(s)</p>
              </div>

              <div className="text-sm flex justify-between text-gray-600 hover:text-primary cursor-pointer transition-colors">
                <p>Assessment</p>
                <p className="text-xs">42 Post(s)</p>
              </div>

              <div className="text-sm flex justify-between text-gray-600 hover:text-primary cursor-pointer transition-colors">
                <p>Development</p>
                <p className="text-xs">31 Post(s)</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TeachersForumsPage;
