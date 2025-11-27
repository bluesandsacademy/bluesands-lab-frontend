
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TimeSpentImproved() {
  //const [timeData, setTimeData] = useState([]);
  // const { width } = useWindowSize();
  // const isMobile = width < 768;
  const defaultData = [
  { name: "Lab", hours: 0 },
  { name: "Quiz", hours: 0 },
  { name: "Course", hours: 0 },
  { name: "Report", hours: 0 },
  ];
  // const data = timeData && timeData.length > 0 ? timeData : defaultData;

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await getTimeSpentOnPlatform();
  //       const timeSpentArray = res[0]?.timeSpent || [];
  //       setTimeData(timeSpentArray);
  //     } catch (err) {
  //       console.error("Error fetching data", err);
  //     }
  //   }
  //   fetchData();
  // }, []);

  return (
    <div className="col-span-1 md:col-span-1 xl:col-span-2 bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
          Time Spent on Platform
        </h2>
        {/* <span className="text-sm text-green-500 font-medium">
          (+23) than last week
        </span> */}
      </div>
      
      <div className="h-[200px] md:h-[240px] lg:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={defaultData}
            margin={{ 
              top: 10, 
              // right: isMobile ? 10 : 30, 
              // left: isMobile ? 0 : 20, 
              // bottom: 20 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              angle={ -45 }
              textAnchor={"middle"}
              height={ 40}
            />
            <YAxis 
              tick={{ fill: "#6b7280", fontSize: 12}}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                fontSize: "14px"
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: "10px",
                fontSize: 12 
              }} 
            />
            <Bar 
              dataKey="hours" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}