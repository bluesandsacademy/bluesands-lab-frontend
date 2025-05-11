import { useAuth } from "@/hooks/UseAuth";
import { Stat } from "@/lib/data";
import {
  getExperimentRate,
  getLabRate,
  getLoginRate,
  getQuizAverage,
} from "@/services/dashboard-service";
import { useEffect, useState } from "react";

interface StatWithValue extends Stat {
  value: string;
}

export default function Stats({ stats }: { stats: Stat[] }) {
  const [statItems, setStatItems] = useState<StatWithValue[]>([]);
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!user || !ready) return;

    async function fetchData() {
      try {
        const attendance = await getLoginRate();
        const labCompRate = await getLabRate();
        const quizAverage = await getQuizAverage();
        const expAttempt = await getExperimentRate();

        const values = (
          [
            `${attendance} %`,
            `${labCompRate} %`,
            `${quizAverage}`,
            `${expAttempt} attempts`,
          ] as string[]
        ).map((value) => value.replace(/%/g, ""));

        const enrichedStats: StatWithValue[] = stats.map((stat, idx) => ({
          ...stat,
          value: values[idx] || "0", // Fallback if mismatch
        }));

        setStatItems(enrichedStats);
      } catch (err) {
        console.error("Error fetching data", err);

        // fallback to zeroed-out values
        const fallbackStats: StatWithValue[] = stats.map((stat) => ({
          ...stat,
          value: "0",
        }));
        setStatItems(fallbackStats);
      }
    }
    fetchData();
   // console.log("Current user:", user);
   // console.log("Ready state:", ready);
  }, [user, ready, stats]);

  return (
    <section className="w-full grid grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        return (
          <div key={index} className="p-5 rounded-2xl bg-white">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h3 className="text-md text-gray-600 font-medium">
                  {stat.title}
                </h3>
                <p className="text-xl font-medium">{stat.value}</p>
              </div>
              <div>
                <img src={stat.icon} alt="" />
              </div>
            </div>
            <div>
              <img src={stat.trendIcon} alt="" />
            </div>
            <div className="flex justify-start ml-5">
              <p className="text-green-600 font-medium text-lg">
                {stat.percentageChange}{" "}
                <span className="text-gray-400">Up {stat.timeFrame}</span>
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
