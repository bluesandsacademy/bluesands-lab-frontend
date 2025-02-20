import { upcomingCourses } from "@/lib/data"

export default function UpcomingStemCourses() {
    return (
        <section className="bg-white rounded-2xl p-5 col-span-2 min-h-full">
            <div>
                <h3 className="text-xl">Performance by STEM Courses</h3>
                <span className="text-gray-600 flex items-center gap-x-2"><span className="text-blue-500">+3</span> new course this month</span>
            </div>
            <div className="mt-3 p-5 space-y-7">
                {upcomingCourses.map((course, index) => {
                    return (
                        <div key={index} className="flex gap-5">
                            <img src={course.iconURI} alt="" />
                            <div className="space-y-3">
                                <p className="text-black text-xl">{course.title}</p>
                                <span className="text-gray-600">{course.timeline}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}