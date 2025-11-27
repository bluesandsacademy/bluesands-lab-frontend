import { SlOptionsVertical } from "react-icons/sl";

const EngagementTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll ">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Subject</td>
            <td className="p-2">Total Users</td>
            <td className="p-2">Active Users</td>
            <td className="p-2">Completion Rate</td>
            <td className="p-2">Average Rating</td>
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Biology</td>
            <td className="p-2">00</td>
            <td className="p-2">00</td>
            <td className="p-2">0.0</td>
            <td className="p-2">
              <p className="p-1 px-1.5 rounded-3xl bg-green-100 text-green-600 flex w-max">
                Active
              </p>
            </td>
            <td className="p-2">
              <button className=" flex gap-1 items-center">
                <SlOptionsVertical />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EngagementTable;
