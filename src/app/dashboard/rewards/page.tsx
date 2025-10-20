"use client";
import StatCards, { StatCardData } from "@/components/Dashboard/StatCards";
import { getStudentRewards } from "@/services/dashboard-service";
import { useUser } from "@/services/UserContext";
import React, { useEffect, useState } from "react";
import { FaCalendar, FaStar } from "react-icons/fa";
import { ImCheckmark2 } from "react-icons/im";
import { RiStairsFill } from "react-icons/ri";

interface BadgeResponse {
  code: string;
  name: string;
  description: string;
  awardedAt: string;
}

const DashboardRewardsPage = () => {
  const [filter, setFilter] = useState("badges");
  const [rewardsData, setRewardsData] = useState<BadgeResponse[]>([]);
  const { user, token } = useUser();
  const completedExp = 0;
  const currentStreak = 0;

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStudentRewards(token);
        setRewardsData(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, [user, token]);

  const rewardStats: StatCardData[] = [
    {
      title: "Total Points",
      value: "0",
      icon: "/images/icon/kudos.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Experiments",
      value: "0",
      icon: "/images/icon/beaker_01.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "Day Streak",
      value: "0",
      icon: "/images/icon/calendar.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
    {
      title: "High Score",
      value: "0%",
      icon: "/images/icon/clipboard.svg",
      trendIcon: "/images/icon/trend_up.svg",
      percentageChange: "0%",
      timeFrame: "from last month",
    },
  ];

  return (
    <div className="mr-2 ml-2 lg:ml-5 lg:mr-5 flex flex-col gap-4 lg:gap-6">
      <div className="bg-purple-700 p-2 lg:p-4 text-white rounded-md mt-4 lg:mt-8">
        <p className="lg:text-lg font-semibold">Badges & Rewards</p>
        <p className="text-xs lg:text-sm">
          Track your progress and achievements
        </p>
      </div>
      <StatCards stats={rewardStats} />
      <div className="flex gap-2">
        <button
          className={`p-1 lg:p-2 px-4 lg:px-6 text-xs lg:text-sm rounded-md transition-colors ${
            filter === "badges"
              ? "bg-bgBlue text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
          onClick={() => setFilter("badges")}
        >
          Badges
        </button>

        <button
          className={`p-1 lg:p-2 px-4 lg:px-6 text-xs lg:text-sm rounded-md transition-colors ${
            filter === "achievements"
              ? "bg-bgBlue text-white"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
          onClick={() => setFilter("achievements")}
        >
          Achievements
        </button>
      </div>
      {filter === "badges" && (
        <div className="m-3 flex flex-[1_1_30%] flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md">
          {/* <div className="p-4 px-12 relative bg-violet-800 w-max rounded-md flex flex-col gap-2 items-center justify-center text-center">
            <div className="absolute rounded-full bg-gradient-to-b from-purple-700 to-purple-950 text-white text-xs p-2 top-2 left-2">
              <p>Common</p>
            </div>
            <div className="flex items-center justify-center p-2 bg-violet-600 rounded-md text-white text-xl">
              <RiStairsFill />
            </div>
            <p className="text-white lg:text-lg">First Steps</p>
            <p className="text-white text-xs lg:text-sm">
              Complete your first experiment
            </p>
            <p className="text-yellow-500 text-xs lg:text-sm">50 Pts</p>
          </div>

          <div className="p-4 relative bg-violet-800 w-max rounded-md flex flex-col gap-2 items-center justify-center text-center">
            <div className="absolute rounded-full bg-gradient-to-b from-purple-700 to-purple-950 text-white text-xs p-2 top-2 left-2">
              <p>Rare</p>
            </div>
            <div className="flex items-center justify-center p-2 bg-violet-600 rounded-md text-white text-xl">
              <FaCalendar />
            </div>
            <p className="text-white lg:text-lg">Consistency Champion</p>
            <p className="text-white text-xs lg:text-sm">
              Complete experiments for 7 days straight
            </p>
            <p className="text-yellow-500 text-xs lg:text-sm">200 Pts</p>
          </div>

          <div className="p-4 px-8 relative bg-violet-800 w-max rounded-md flex flex-col gap-2 items-center justify-center text-center">
            <div className="absolute rounded-full bg-gradient-to-b from-purple-700 to-purple-950 text-white text-xs p-2 top-2 left-2">
              <p>Epic</p>
            </div>
            <div className="flex items-center justify-center p-2 bg-violet-600 rounded-md text-white text-xl">
              <FaStar />
            </div>
            <p className="text-white lg:text-lg">High Achiever</p>
            <p className="text-white text-xs lg:text-sm">
              Score above 95% on any experiment
            </p>
             <p className="text-yellow-500 text-xs lg:text-sm">50 Pts</p> 
          </div> */}

          {rewardsData.map((reward, index) => (
            <div className="p-4 px-12 relative bg-violet-800 w-max rounded-md flex flex-col gap-2 items-center justify-center text-center">
              <div className="absolute rounded-full bg-gradient-to-b from-purple-700 to-purple-950 text-white text-xs p-2 top-2 left-2">
                <p>Common</p>
              </div>
              <div className="flex items-center justify-center p-2 bg-violet-600 rounded-md text-white text-xl">
                <RiStairsFill />
              </div>
              <p className="text-white lg:text-lg">{reward.name}</p>
              <p className="text-white text-xs lg:text-sm">
                {reward.description}
              </p>
              <p className="text-yellow-500 text-xs lg:text-sm">{reward.awardedAt}</p>
            </div>
          ))}
        </div>
      )}
      {filter === "achievements" && (
        <div className="m-3 flex flex-col gap-4 md:gap-6 lg:gap-10 bg-white p-2 lg:p-6 rounded-md text-gray-600">
          <div className="flex flex-col gap-3">
            <p className="lg:text-lg">Experiments</p>

            <div className="flex flex-col md:flex-row bg-blue-50 rounded-md justify-between p-2 md:p-3 text-xs md:text-sm">
              <div className="flex gap-2 md:gap-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-blue-700">
                  <FaStar />
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="font-semibold">Complete 10 Experiments</p>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-300 h-2 rounded-full w-40 overflow-hidden">
                      <div
                        className={`h-full bg-bgBlue`}
                        style={{ width: `${completedExp * 10}%` }}
                      ></div>
                    </div>
                    <p>{completedExp}/10</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-yellow-500">300 pts</p>
                {completedExp >= 10 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <ImCheckmark2 />
                    <p>Completed</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row bg-blue-50 rounded-md justify-between p-2 md:p-3 text-xs md:text-sm">
              <div className="flex gap-2 md:gap-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-blue-700">
                  <FaStar />
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="font-semibold">Complete 20 Experiments</p>
                  <div className="flex gap-1 md:gap-2 items-center">
                    <div className="bg-gray-300 h-2 rounded-full w-40 overflow-hidden">
                      <div
                        className={`h-full bg-bgBlue`}
                        style={{ width: `${completedExp * 5}%` }}
                      ></div>
                    </div>
                    <p>{completedExp}/20</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-yellow-500">250 pts</p>
                {completedExp >= 20 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <ImCheckmark2 />
                    <p>Completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="lg:text-lg">Streaks</p>

            <div className="flex flex-col md:flex-row bg-blue-50 rounded-md justify-between p-2 md:p-3 text-xs md:text-sm">
              <div className="flex gap-2 md:gap-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-blue-700">
                  <FaStar />
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="font-semibold">3 - day streak</p>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-300 h-2 rounded-full w-40 overflow-hidden">
                      <div
                        className={`h-full bg-bgBlue`}
                        style={{ width: `${currentStreak * 33.333}%` }}
                      ></div>
                    </div>
                    <p>{currentStreak}/3</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-yellow-500">75 pts</p>
                {currentStreak >= 3 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <ImCheckmark2 />
                    <p>Completed</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row bg-blue-50 rounded-md justify-between p-2 md:p-3 text-xs md:text-sm">
              <div className="flex gap-2 md:gap-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-blue-700">
                  <FaStar />
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="font-semibold">7 - day streak</p>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-300 h-2 rounded-full w-40 overflow-hidden">
                      <div
                        className={`h-full bg-bgBlue`}
                        style={{ width: `${currentStreak * 14.29}%` }}
                      ></div>
                    </div>
                    <p>{currentStreak}/7</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-yellow-500">200 pts</p>
                {currentStreak >= 7 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <ImCheckmark2 />
                    <p>Completed</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row bg-blue-50 rounded-md justify-between p2 md:p-3 text-xs md:text-sm">
              <div className="flex gap-2 md:gap-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-full text-white bg-blue-700">
                  <FaStar />
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <p className="font-semibold">30 - day streak</p>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-300 h-2 rounded-full w-40 overflow-hidden">
                      <div
                        className={`h-full bg-bgBlue`}
                        style={{ width: `${currentStreak * 3.333}%` }}
                      ></div>
                    </div>
                    <p>{currentStreak}/30</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-yellow-500">1000 pts</p>
                {currentStreak >= 30 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <ImCheckmark2 />
                    <p>Completed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRewardsPage;
