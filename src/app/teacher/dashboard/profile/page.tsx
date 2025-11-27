"use client"

import EditPreferences from "@/components/Navbar/TopNav/UserProfile/EditPreferences";
import EditProfile from "@/components/Navbar/TopNav/UserProfile/EditProfile";
import SubscriptionStatus from "@/components/Navbar/TopNav/UserProfile/SubscriptionStatus";

const TeacherEditProfilePage = () => {
//    const { user } = useUser();
//    const firstName = user?.fullName?.split(" ")[0];
  return (
    <div>
        <EditProfile/>
        <EditPreferences/>
        <SubscriptionStatus/>
    </div>
  )
}

export default TeacherEditProfilePage