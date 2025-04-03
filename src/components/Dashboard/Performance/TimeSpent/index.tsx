import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Experiments', hours: 5 },
    { name: 'Quizzes', hours: 15 },
    { name: 'STEM Courses', hours: 2 },
    { name: 'Reports', hours: 3 },
];



export default function TimeSpent() {
    return (
        <div className="col-span-2">
            <div style={{ width: '100%', height: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                    Time Spent on Platform <span style={{ color: 'green' }}>(+23) than last week</span>
                </h2>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" tick={{ fill: '#333' }} />
                        <YAxis tick={{ fill: '#333' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Bar dataKey="hours" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}