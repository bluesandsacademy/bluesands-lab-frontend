import { SlOptionsVertical } from "react-icons/sl";

const DisputeTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">User</td>
            <td className="p-2">Role</td>
            <td className="p-2">Type</td>
            <td className="p-2">Description</td>
            <td className="p-2">Priority</td>
            <td className="p-2">Status</td>
            <td className="p-2">Created Date</td>
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">User's Name</td>
            <td className="p-2">Role</td>
            <td className="p-2">Grade Dispute</td>
            <td className="p-2">Student claims incorrect grade assignment</td>
            <td className="p-2">
              <p className="p-1 px-1.5 rounded-3xl bg-yellow-100 text-yellow-600 flex w-max">
                Medium
              </p>
            </td>
            <td className="p-2">
              <p className="p-1 px-1.5 rounded-3xl bg-green-100 text-green-600 flex w-max">
                Resolved
              </p>
            </td>
            <td className="p-2">DD-MM-YYYY</td>
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

export default DisputeTable;
