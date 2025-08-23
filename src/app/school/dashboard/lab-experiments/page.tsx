"use client"
import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import { useUser } from "@/services/UserContext";


const SchoolLabPage = () => {
    const { user } = useUser();
    const firstName = user?.fullName?.split(" ")[0];
  return (
    <div className="p-4">
        <WelcomeBanner firstName={firstName || ""}/>
        <p className="mt-12 font-bold text-bgBlue">We're Sorry. Page is checked out for maintenance, Try again later</p>
    </div>
  )
}

export default SchoolLabPage