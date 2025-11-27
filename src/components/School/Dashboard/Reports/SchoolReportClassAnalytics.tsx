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

const SchoolReportClassAnalytics = () => {
  const barChartData = [
    { subject: "Biology", average_score: 0, attendance: 0, lab_completion: 0 },
    { subject: "Math", average_score: 0, attendance: 0, lab_completion: 0 },
    { subject: "Physics", average_score: 0, attendance: 0, lab_completion: 0 },
    {
      subject: "Chemistry",
      average_score: 0,
      attendance: 0,
      lab_completion: 0,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">
          Class Performance Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="average_score" fill="#0483E2" />
            <Bar dataKey="attendance" fill="#10B981" />
            <Bar dataKey="lab_completion" fill="#263238" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm font-semibold text-[#003C6E] ml-4">
        Detailed Class Metrics
      </p>
      <div className="flex flex-col overflow-x-scroll">
        <table className="bg-white rounded-md">
          <thead>
            <tr className="border-b border-b-gray-200 text-xs text-gray-500">
              <td className="p-2">Class</td>
              <td className="p-2">Students</td>
              <td className="p-2">Average Score</td>
              <td className="p-2">Attendance</td>
              <td className="p-2">Status</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs border-b border-b-gray-200">
              <td className="p-2">Class Name</td>
              <td className="p-2">student no</td>
              <td className="p-2">
                <p className="flex w-max p-0.5 px-2 bg-green-200 text-green-600 items-center justify-center rounded-md">
                  {" "}
                  28
                </p>
              </td>
              <td className="p-2">14</td>
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

export default SchoolReportClassAnalytics;
