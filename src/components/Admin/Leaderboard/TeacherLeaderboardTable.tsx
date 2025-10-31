import { SlOptionsVertical } from "react-icons/sl";

const TeacherLeaderboardTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll gap-2">
      <p className="text-sm font-semibold text-gray-500">
        Top Teachers Ranking
      </p>
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Name</td>
            <td className="p-2">School</td>
            <td className="p-2">Country</td>
            <td className="p-2">Subject</td>
            <td className="p-2">Students</td>
            <td className="p-2">Rating</td>
            <td className="p-2">Points</td>
            <td className="p-2">Average</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Teacher's Name</td>
            <td className="p-2">School</td>
            <td className="p-2">Country</td>
            <td className="p-2">Math</td>
            <td className="p-2">00</td>
            <td className="p-2">0.0</td>
            <td className="p-2">00</td>
            <td className="p-2">0%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TeacherLeaderboardTable;
