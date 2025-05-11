import { getTimeSpentOnPlatform } from "@/services/dashboard-service";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TimeSpent() {
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getTimeSpentOnPlatform();
        const timeSpentArray = res[0]?.timeSpent || [];
        setTimeData(timeSpentArray);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="col-span-2">
      <div style={{ width: "100%", height: "400px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Time Spent on Platform{" "}
          <span style={{ color: "green" }}>(+23) than last week</span>
        </h2>
        <ResponsiveContainer>
          <BarChart
            data={timeData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" tick={{ fill: "#333" }} />
            <YAxis tick={{ fill: "#333" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "5px" }} />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
