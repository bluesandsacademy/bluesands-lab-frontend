"use client"

import WelcomeBanner from "@/components/Dashboard/WelcomeBanner";
import EditProfile from "@/components/Navbar/TopNav/UserProfile/EditProfile";
import { useUser } from "@/services/UserContext";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";

const DashboardEditProfilePage = () => {
   const { user } = useUser();
   const firstName = user?.fullName?.split(" ")[0];
  return (
    <div>
        <WelcomeBanner firstName={firstName? firstName : ""}/>
        <Link href="/dashboard" className="flex flex-row">
          <p className="font-bold ml-5 flex items-center gap-1 lg:gap-2"><FaAngleLeft className="text-bgBlue"/> Profile </p>
        </Link>
        <EditProfile/>
    </div>
  )
}

export default DashboardEditProfilePage