"use client";

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  BarChart,
} from "recharts";

const TeacherPerformanceMetricsPage = () => {
  const lineChartData = [
    { month: "Jan", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Feb", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Mar", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Apr", average: 0, attendance: 0, lab_completion: 0 },
    { month: "May", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Jun", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Jul", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Aug", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Sep", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Oct", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Nov", average: 0, attendance: 0, lab_completion: 0 },
    { month: "Dec", average: 0, attendance: 0, lab_completion: 0 },
  ];

  const barChartData = [
    { subject: "Math", average: 0, attendance: 0, lab_completion: 0 },
    { subject: "Physics", average: 0, attendance: 0, lab_completion: 0 },
    { subject: "Chemistry", average: 0, attendance: 0, lab_completion: 0 },
    { subject: "Biology", average: 0, attendance: 0, lab_completion: 0 },
  ];

  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      {/* Line chart */}
      <div className=" flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Average Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#0483E2" />
              <Bar dataKey="average" fill="#10B981" />
              <Bar dataKey="average" fill="#263238" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">
            Class Improvement Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#0483E2"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="lab_completion"
                stroke="#263238"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col w-full lg:flex-row gap-3">
        {/* Table */}
        <div className="flex flex-col gap-2 lg:w-[49%]">
          <p className="text-sm font-semibold">Top Performing Students</p>
          <div
            className="flex flex-col
                     overflow-x-scroll"
          >
            <table className="bg-white rounded-md">
              <thead>
                <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                  <td className="p-2">Student Name</td>
                  <td className="p-2">Last Login</td>
                  <td className="p-2">Best Subject</td>
                  <td className="p-2">Average Score</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs border-b border-b-gray-200">
                  <td className="p-2">John Doe</td>
                  <td className="p-2">2 hours ago</td>
                  <td className="p-2">Mathematics</td>
                  <td className="p-2 text-blue-600">88%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-2 lg:w-[49%]">
          <p className="text-sm font-semibold text-red-700">At Risk Students</p>
          <div
            className="flex flex-col
                 overflow-x-scroll"
          >
            <table className="bg-white rounded-md">
              <thead>
                <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                  <td className="p-2">Student Name</td>
                  <td className="p-2">Average Score</td>
                  <td className="p-2">Last activity</td>
                  <td className="p-2">Status</td>
                </tr>
              </thead>
              <tbody>
                <tr className="text-xs border-b border-b-gray-200">
                  <td className="p-2">Jaydee Jamie</td>
                  <td className="p-2">
                    <p className="flex w-max p-0.5 px-2 bg-red-200 text-red-600 items-center justify-center rounded-full">
                      {" "}
                      31
                    </p>
                  </td>
                  <td className="p-2">3 days ago</td>
                  <td className="p-2">
                    <p className="flex w-max p-0.5 px-2 bg-red-200 text-red-600 items-center justify-center rounded-full">
                      {" "}
                      Critical
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPerformanceMetricsPage;
