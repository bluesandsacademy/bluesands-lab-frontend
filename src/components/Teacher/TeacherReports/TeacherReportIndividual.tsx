const TeacherReportIndividual = () => {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-semibold">Individual Student Performance</p>
      <div className="flex flex-col overflow-x-scroll">
        <table className="bg-white rounded-md">
          <thead>
            <tr className="border-b border-b-gray-200 text-xs text-gray-500">
              <td className="p-2">Student Name</td>
              <td className="p-2">Math</td>
              <td className="p-2">Chemistry</td>
              <td className="p-2">Physics</td>
              <td className="p-2">Biology</td>
              <td className="p-2">Attendance</td>
              <td className="p-2">Performance</td>
              <td className="p-2">Action</td>
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs border-b border-b-gray-200">
              <td className="p-2">John Doe</td>
              <td className="p-2">
                <p className="bg-green-100 w-max text-green-600 p-1 rounded-full">
                  72%
                </p>
              </td>
               <td className="p-2">
                <p className="bg-green-100 w-max text-green-600 p-1 rounded-full">
                  72%
                </p>
              </td>
               <td className="p-2">
                <p className="bg-green-100 w-max text-green-600 p-1 rounded-full">
                  72%
                </p>
              </td>
               <td className="p-2">
                <p className="bg-green-100 w-max text-green-600 p-1 rounded-full">
                  72%
                </p>
              </td>
              <td className="p-2">85%</td>
               <td className="p-2">
                <p className="bg-blue-100 w-max text-blue-600 p-1 rounded-full">
                  72%
                </p>
              </td>
              <td className="p-2 text-blue-600"><a href="#">View Profile</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherReportIndividual;
