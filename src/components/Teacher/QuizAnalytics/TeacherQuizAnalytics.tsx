import { data } from "framer-motion/client";
import { RiExportFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  LineChart,
} from "recharts";

const TeacherQuizAnalytics = () => {
  const data = [
    { month: "Jan", created: 0, submitted: 0 },
    { month: "Feb", created: 0, submitted: 0 },
    { month: "Mar", created: 0, submitted: 0 },
    { month: "Apr", created: 0, submitted: 0 },
    { month: "May", created: 0, submitted: 0 },
    { month: "Jun", created: 0, submitted: 0 },
    { month: "Jul", created: 0, submitted: 0 },
    { month: "Aug", created: 0, submitted: 0 },
    { month: "Sep", created: 0, submitted: 0 },
    { month: "Oct", created: 0, submitted: 0 },
    { month: "Nov", created: 0, submitted: 0 },
    { month: "Dec", created: 0, submitted: 0 },
  ];

  const lineChartData = [
    { month: "Jan", feedback: 0 },
    { month: "Feb", feedback: 0 },
    { month: "Mar", feedback: 0 },
    { month: "Apr", feedback: 0 },
    { month: "May", feedback: 0 },
    { month: "Jun", feedback: 0 },
    { month: "Jul", feedback: 0 },
    { month: "Aug", feedback: 0 },
    { month: "Sep", feedback: 0 },
    { month: "Oct", feedback: 0 },
    { month: "Nov", feedback: 0 },
    { month: "Dec", feedback: 0 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1 p-1 px-2 lg:p-2 text-xs lg:text-sm text-white bg-[#303C48] rounded-md ">
          <RiExportFill />
          Export
        </button>
      </div>
      {/* Table Div */}
      <div className="flex flex-col gap-1">
        {/* <p className="text-sm font-semibold">Table Title</p> */}
        <div className="flex flex-col overflow-x-scroll">
          <table className="bg-white rounded-md">
            <thead>
              <tr className="border-b border-b-gray-200 text-xs text-gray-500">
                <td className="p-2">Title</td>
                <td className="p-2">Created Date</td>
                <td className="p-2">Status</td>
                <td className="p-2">Submissions</td>
                <td className="p-2">Late Submissions</td>
                <td className="p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs border-b border-b-gray-200">
                <td className="p-2">Math Quiz 101</td>
                <td className="p-2">DD-MM-YYYY</td>
                <td className="p-2">
                  <p className=" text-green-600">Active</p>
                </td>
                <td className="p-2">72%</td>
                <td className="p-2">7%</td>
                <td className="p-2">
                  <button>
                    <SlOptionsVertical />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Div */}
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-semibold text-gray-600">
            Assignments Created vs Submitted
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart width={600} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="created" stackId="a" fill="#006FCC">
                {/* <LabelList dataKey="late" position="bottom" /> */}
              </Bar>
              <Bar dataKey="submitted" stackId="a" fill="#00B69B">
                {/* <LabelList dataKey="present" position="top" /> */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-4">Feedback Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="feedback"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizAnalytics;
