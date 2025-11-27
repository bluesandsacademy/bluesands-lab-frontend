interface BannerProps {
    firstName: string;
}
const WelcomeBanner = ({firstName}: BannerProps) => {
  return (
    <div className="p-3 md:p-5 space-y-6 md:space-y-10">
        {/* Welcome Section */}
        <div className="relative rounded-lg overflow-hidden">
            <img 
                src="/images/bg/welcome_cover.png" 
                alt="welcome-background" 
                className="w-full h-32 md:h-28 lg:h-20 object-cover"
            />
            <div className="absolute top-1/2 -translate-y-1/2 text-white left-4 md:left-10">
                <h3 className="font-medium leading-tight md:leading-none my-0 text-lg md:text-2xl lg:text-3xl">
                Welcome Back, {firstName}
                </h3>
                <p className="my-0 text-sm md:text-md leading-normal md:leading-none">Ready for your next STEM adventure?</p>
            </div>
        </div>
    </div>
  )
}

export default WelcomeBanner;