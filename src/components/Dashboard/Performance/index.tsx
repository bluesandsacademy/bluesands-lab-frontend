import { performance } from "@/lib/data";

export default function PerformanceByStemCourses() {
    return (
        <section className="bg-white rounded-2xl p-5 col-span-3 min-h-full space-y-10">
            <div>
                <h3 className="text-xl">Performance by STEM Courses</h3>
                <span className="text-gray-600 flex items-center gap-x-2"><img src="/images/icon/circle_tick.svg" alt="" /> 30 done this month</span>
            </div>
            <div className="overflow-y-scroll max-h-[500px]">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-600 text-xs font-normal">
                            <th className="p-3">Courses</th>
                            <th className="p-3">Time Spent</th>
                            <th className="p-3">Quiz Attempt Frequency</th>
                            <th className="p-3">Completion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performance.map((course, index) => (
                            <tr key={index} className="border-t text-md">
                                <td className="p-3 flex items-center gap-3 col-span-3">
                                    <img src={course.iconURI} alt={course.courseTitle} />
                                    <span>{course.courseTitle}</span>
                                </td>
                                <td className="p-3">{course.timeSpent}</td>
                                <td className="p-3">{course.quizAttemptFrequency} Attempts</td>
                                <td className="p-3">
                                    <span className={`text-sm ${course.completion < 60 ? 'text-red-500' :
                                        course.completion < 90 ? 'text-blue-500' :
                                            'text-green-500'
                                        }`}>{course.completion}%</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1">
                                        <div
                                            className={`h-1 rounded-full ${course.completion < 60 ? 'bg-red-500' :
                                                course.completion < 90 ? 'bg-blue-500' :
                                                    'bg-green-500'
                                                }`}
                                            style={{ width: `${course.completion}%` }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}