interface TableData {
  [key: string]: string | number;
}

interface ReportTableProps {
  headings: string[];
  data: TableData[];
  currentPage?: number;
  totalItems?: number;
}

const ReportTable = ({ 
  headings, 
  data, 
  currentPage = 1, 
  totalItems 
}: ReportTableProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50 border">
              {headings.map((heading, index) => (
                <th key={index} className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {headings.map((heading, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-3 text-sm text-gray-900">
                    {row[heading.toLowerCase().replace(/\s+/g, '')] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination footer */}
      <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-600">
        <p>Showing page {currentPage}</p>
        <p>{totalItems || data.length} item(s) total</p>
      </div>
    </div>
  );
};

export default ReportTable;