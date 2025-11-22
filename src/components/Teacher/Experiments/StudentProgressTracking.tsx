import { SlOptionsVertical } from "react-icons/sl";

const StudentProgressTracking = () => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold">Active Assignments</p>
      <div className="flex flex-col overflow-x-scroll">
        <table className="bg-white rounded-md">
          <thead>
            <tr className="border-b border-b-gray-200 text-xs text-gray-500">
              <td className="p-2">Student Name</td>
              <td className="p-2">Experiment</td>
              <td className="p-2">Attempts</td>
              <td className="p-2">Date</td>
              <td className="p-2">Time Taken</td>
              <td className="p-2">Average Score</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs border-b border-b-gray-200">
              <td className="p-2">John Student</td>
              <td className="p-2">
                <p>
                  Newtons Law
                </p>
              </td>
              <td className="p-2">
                <p>2 attempts</p>
              </td>
              <td className="p-2">
                <p>dd-mm-yyyy</p>
              </td>
              <td className="p-2">
                <p>35 mins</p>
              </td>
              <td className="p-2">
                <p className="bg-green-100 w-max text-blue-600 p-1 rounded-full">
                  85%
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProgressTracking;
