import { SlOptionsVertical } from "react-icons/sl";

const ExperimentTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Experiment Name</td>
            <td className="p-2">Subject</td>
            <td className="p-2">Uploaded By</td>
            <td className="p-2">Status</td>
            <td className="p-2">Created Date</td>
            <td className="p-2">Engagement</td>
            <td className="p-2">Rating</td>
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Newton's Law</td>
            <td className="p-2">Physics</td>
            <td className="p-2">Uploader Name</td>
            <td className="p-2">Published</td>
            <td className="p-2">dd-mm-yyyy</td>
            <td className="p-2">00</td>
            <td className="p-2">No Rating</td>
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

export default ExperimentTable;
