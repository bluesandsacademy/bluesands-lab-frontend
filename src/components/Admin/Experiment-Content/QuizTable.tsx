import { SlOptionsVertical } from "react-icons/sl";

const QuizTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Title</td>
            <td className="p-2">Subject</td>
            <td className="p-2">Author</td>
            <td className="p-2">Submitted</td>
            <td className="p-2">Content</td>
            <td className="p-2">Status</td>
            <td className="p-2">Engagement</td>
            <td className="p-2">Action</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Algebra</td>
            <td className="p-2">Mathematics</td>
            <td className="p-2">Author Name</td>
            <td className="p-2">dd-mm-yyyy</td>
            <td className="p-2">17 Lessons, 8 Quizzes</td>
            <td className="p-2">Draft or Approved</td>
            <td className="p-2">1250</td>
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
