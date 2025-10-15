import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
} from "recharts";

const TeacherReportOverview = () => {
     const barChartData = [
        { subject: "Math", average: 0, attendance: 0, lab_completion: 0 },
        { subject: "Physics", average: 0, attendance: 0, lab_completion: 0 },
        { subject: "Chemistry", average: 0, attendance: 0, lab_completion: 0 },
        { subject: "Biology", average: 0, attendance: 0, lab_completion: 0 },
      ];
    
      const lineChartData = [
        { month: "Jan", attendance: 0 },
        { month: "Feb", attendance: 0 },
        { month: "Mar", attendance: 0 },
        { month: "Apr", attendance: 0 },
        { month: "May", attendance: 0 },
        { month: "Jun", attendance: 0 },
        { month: "Jul", attendance: 0 },
        { month: "Aug", attendance: 0 },
        { month: "Sep", attendance: 0 },
        { month: "Oct", attendance: 0 },
        { month: "Nov", attendance: 0 },
        { month: "Dec", attendance: 0 },
      ];
  return (
    <div className="flex flex-col gap-4 p-2 lg:p-4">
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-4">Performance By Subject</h3>
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
        <h3 className="text-sm font-semibold mb-4">Attendance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeacherReportOverview;
