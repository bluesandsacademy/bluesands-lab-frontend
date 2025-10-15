import { FaFilter } from "react-icons/fa";
import { RiExportFill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";

const TeacherQuizSubmissions = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row justify-between items-center p-2 rounded-md bg-white">
        <div className="flex justify-between gap-2">
            <input type="search" name="searchStudent" id="searchStudent" className="border border-gray-200 rounded-md text-xs p-2 focus:ring-0" placeholder="Search student by name" />
            <button className="flex items-center gap-1 text-xs lg:text-sm border border-gray-100 rounded-md p-2 shadow-sm"><FaFilter />Filter</button>
        </div>
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
                <td className="p-2">Student Name</td>
                <td className="p-2">Student Id</td>
                <td className="p-2">Submissions</td>
                <td className="p-2">Status</td>
                <td className="p-2">Grade</td>
                <td className="p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xs border-b border-b-gray-200">
                <td className="p-2">John Doe</td>
                <td className="p-2">ID-3</td>
                <td className="p-2">DD-MM-YYYY</td>
                <td className="p-2">
                  <p className=" text-teal-600">On Time</p>
                </td>
                <td className="p-2"><p className="p-1.5 rounded-full bg-teal-600 text-white w-max">72%</p></td>
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
    </div>
  );
};

export default TeacherQuizSubmissions;
