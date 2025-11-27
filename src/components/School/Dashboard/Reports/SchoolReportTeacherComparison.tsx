import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SchoolReportTeacherComparison = () => {
  const barChartData = [
    { teacher: "Mike", score: 0 },
    { teacher: "Jane", score: 0 },
    { teacher: "Kunle", score: 0 },
    { teacher: "Joseph", score: 0 },
    { teacher: "May", score: 0 },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Downtime History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="teacher" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#003A6C" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm font-semibold text-[#003C6E] ml-4">
        Teacher Comparison Table
      </p>
      <div className="flex flex-col overflow-x-scroll">
        <table className="bg-white rounded-md">
          <thead>
            <tr className="border-b border-b-gray-200 text-xs text-gray-500">
              <td className="p-2">Teacher</td>
              <td className="p-2">Classes</td>
              <td className="p-2">Average Score</td>
              <td className="p-2">Student Ranking</td>
              <td className="p-2">Status</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs border-b border-b-gray-200">
              <td className="p-2">Teacher Name</td>
              <td className="p-2">3</td>
              <td className="p-2">
                <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                  {" "}
                  78
                </p>
              </td>
              <td className="p-2">40%</td>
              <td className="p-2">
                <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                  {" "}
                  Excellent
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolReportTeacherComparison;
