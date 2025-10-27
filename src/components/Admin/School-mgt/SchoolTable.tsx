const SchoolTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll">
      <table className="bg-white rounded-md">
      <thead>
        <tr className="border-b border-b-gray-200 text-xs text-gray-500">
          <td className="p-2">School</td>
          <td className="p-2">Teachers</td>
          <td className="p-2">Students</td>
          <td className="p-2">Admin</td>
          <td className="p-2">Subscription</td>
          <td className="p-2">Status</td>
        </tr>
      </thead>
      <tbody>
        <tr className="text-xs border-b border-b-gray-200">
          <td className="p-2">School Name</td>
          <td className="p-2">00</td>
          <td className="p-2">00</td>
          <td className="p-2">Admin Name</td>
          <td className="p-2">
            <p className="p-1 px-1.5 rounded-3xl bg-blue-100 text-blue-600 flex w-max">
              Basic
            </p>
          </td>
          <td className="p-2">
            <p className="p-1 px-1.5 rounded-3xl bg-green-100 text-green-600 flex w-max">
              Active
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  );
};

export default SchoolTable;
