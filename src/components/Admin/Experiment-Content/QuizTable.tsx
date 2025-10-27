import { SlOptionsVertical } from "react-icons/sl";

const QuizTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">User</td>
            <td className="p-2">Email</td>
            <td className="p-2">School</td>
            <td className="p-2">Role</td>
            <td className="p-2">Status</td>
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">User's Name</td>
            <td className="p-2">email</td>
            <td className="p-2">School Name</td>
            <td className="p-2">Teacher</td>
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

export default QuizTable;
