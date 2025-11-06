const PopularExperimentsTable = () => {
  return (
    <div className="flex flex-col overflow-x-scroll gap-2">
        <p className="Text-sm lg:text-base font-semibold">Most Popular Experiments</p>
      <table className="bg-white rounded-md">
        <thead>
          <tr className="border-b border-b-gray-200 text-xs text-gray-500">
            <td className="p-2">Experiment Name</td>
            <td className="p-2">Participants</td>
            <td className="p-2">Growth</td>
            <td className="p-2">Participation Rate</td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-xs border-b border-b-gray-200">
            <td className="p-2">Titration</td>
            <td className="p-2">00</td>
            <td className="p-2">+7%</td>
            <td className="p-2">
              <p className="text-bgBlue">
                87%s
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PopularExperimentsTable;
