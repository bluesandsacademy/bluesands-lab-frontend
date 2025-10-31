import { SlOptionsVertical } from "react-icons/sl";

const SchoolLeaderboardTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll gap-2">
      <p className="text-sm font-semibold text-gray-500">
        Top Schools Ranking
      </p>
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Name</td>
            <td className="p-2">Country</td>
            <td className="p-2">Number Of Students</td>
            <td className="p-2">Experiments</td>
            <td className="p-2">Points</td>
            <td className="p-2">Average</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">School Name</td>
            <td className="p-2">Country</td>
            <td className="p-2">00</td>
            <td className="p-2">00</td>
            <td className="p-2">00</td>
            <td className="p-2">0%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SchoolLeaderboardTable;
