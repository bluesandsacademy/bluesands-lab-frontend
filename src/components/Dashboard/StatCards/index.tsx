import { Stat } from "@/lib/data"

export default function Stats({ stats }: any) {
    return (
        <section className="w-full grid grid-cols-4 gap-4">
            {stats.map((stat: Stat, index: number) => {
                return (
                    <div key={index} className="p-5 rounded-2xl bg-white">
                        <div className="flex justify-between">
                            <div className="space-y-1">
                                <h3 className="text-md text-gray-600 font-medium">{stat.title}</h3>
                                <p className="text-xl font-medium">{stat.percentage}</p>
                            </div>
                            <div>
                                <img src={stat.icon} alt="" />
                            </div>
                        </div>
                        <div>
                            <img src={stat.trendIcon} alt="" />
                        </div>
                        <div className="flex justify-start ml-5">
                            <p className="text-green-600 font-medium text-lg">{stat.percentageChange} <span className="text-gray-400">Up {stat.timeFrame
                            }</span></p>
                        </div>
                    </div>
                )
            })}
        </section>
    )
} 