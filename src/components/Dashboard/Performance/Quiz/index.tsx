import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', value: 5 },
    { name: 'Feb', value: 7 },
    { name: 'Mar', value: 6 },
    { name: 'Apr', value: 8 },
    { name: 'May', value: 7 },
    { name: 'Jun', value: 9 },
    { name: 'Jul', value: 8 },
    { name: 'Aug', value: 10 },
    { name: 'Sep', value: 9 },
    { name: 'Oct', value: 11 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 12 },
];
export default function QuizPerformance() {
    return (
        <div className="w-full h-[300px] col-span-3 space-y-3 bg-white rounded-2xl p-5">
            <div>
                <h2 className="text-left text-md font-normal">
                    Quiz performance
                </h2>
                <span className="text-green-500">(+5) more in 2021</span>
            </div>
            <ResponsiveContainer className="w-full p-0 m-0">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fill: '#333' }} />
                    <YAxis tick={{ fill: '#333' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}