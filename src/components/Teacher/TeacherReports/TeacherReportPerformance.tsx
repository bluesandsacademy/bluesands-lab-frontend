import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

const TeacherReportPerformance = () => {
  const lineChartData = [
    { month: "Jan", average: 0 },
    { month: "Feb", average: 0 },
    { month: "Mar", average: 0 },
    { month: "Apr", average: 0 },
    { month: "May", average: 0 },
    { month: "Jun", average: 0 },
    { month: "Jul", average: 0 },
    { month: "Aug", average: 0 },
    { month: "Sep", average: 0 },
    { month: "Oct", average: 0 },
    { month: "Nov", average: 0 },
    { month: "Dec", average: 0 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Performance Trends</h3>
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
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-semibold">Subject Performance Details</p>
        <div className="flex flex-col overflow-x-scroll">
          <table className="bg-white rounded-md">
            <thead>
              <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                <td className="p-2">Subject</td>
                <td className="p-2">Average Score</td>
                <td className="p-2">Students</td>
                <td className="p-2">Trend</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs border-b border-b-gray-200">
                <td className="p-2">Mathematics</td>
                <td className="p-2">
                  <p className="bg-green-100 w-max text-green-600 p-1 rounded-full">
                    72%
                  </p>
                </td>
                <td className="p-2">45</td>
                <td className="p-2 text-green-600">+2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherReportPerformance;
