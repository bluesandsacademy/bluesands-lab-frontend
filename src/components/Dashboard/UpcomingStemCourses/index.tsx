import { upcomingCourses } from "@/lib/data"

interface RecommendationProps {
    recommendations : string[]
}

export default function UpcomingStemCourses({recommendations}: RecommendationProps) {
    return (
        <section className="bg-white rounded-2xl p-5 col-span-2 min-h-full">
            <div>
                <h3 className="text-xl">Study Recmmendations</h3>
                <span className="text-gray-600 flex items-center gap-x-2"><span className="text-blue-500">+{recommendations.length}</span> new recommendations this month</span>
            </div>
            <div className="mt-3 p-5 space-y-7">
                {recommendations.map((rec, index) => {
                    return (
                        <div key={index} className="flex gap-5">
                            <img src={upcomingCourses[index].iconURI || upcomingCourses[0].iconURI} alt="" />
                            <div className="space-y-3">
                                <p className="text-black text-xl">{rec}</p>
                                {/* <span className="text-gray-600">{course.timeline}</span> */}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}