const MostEngagedSubjectsTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll gap-2">
      <p className="Text-sm lg:text-base font-semibold">
        Highest Engagement Subjects
      </p>
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Subject</td>
            <td className="p-2">Experiments Completed</td>
            <td className="p-2">Rate</td>
            <td className="p-2">Average</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Subject Name</td>
            <td className="p-2">00</td>
            <td className="p-2">0%</td>
            <td className="p-2">
              <p className="text-bgBlue">0.00</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MostEngagedSubjectsTable;
