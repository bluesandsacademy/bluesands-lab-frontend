import Link from 'next/link';

export const metadata = {
    title: "Get Started | Create your Blue Sands Account"
}

const linkOptions = [
    {
        title: "Individual",
        url: "/auth/register/individual"
    },
    {
        title: "School",
        url: "/auth/register/school"
    },
]

export default function RegisterUser() {
    return (
        <section className="min-h-screen p-3">
            <div className='w-full flex justify-center relative z-0'>
                <img src="/images/bg/cover.png" className="w-full object-contain z-0" alt="" />
                <div className="absolute flex flex-col items-center justify-center  top-1 md:top-0 text-center text-white max-w-lg md:bottom-36 bottom-5 space-y-1 md:space-y-3">
                    <h1 className="text-xl md:text-4xl font-normal">Get Started</h1>
                    <p className="font-thin text-xs md:text-lg md:max-w-lg max-w-xs">Choose your role to begin your journey on Blue Sands STEM Labs.</p>
                </div>
            </div>
            <div className='border max-w-2xl mx-auto flex flex-col gap-y-5 py-20 px-10 rounded-lg shadow-sm mt-0 md:-mt-28 z-30 relative bg-white'>
                {linkOptions.map((link, index) => (
                    <Link href={link.url} key={index} className={`text-center text-sm md:text-base rounded-md py-2 md:py-3 lg:py-5 ${index === 0 ? "bg-bgBlue text-white" : "bg-bgGrey"} `}>{link.title}</Link>
                ))}
            </div>
        </section>
    )
}