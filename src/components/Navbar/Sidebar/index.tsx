// "use client"

// import Link from "next/link";
// import { sidebarLinks } from "@/lib/data";
// import { usePathname } from "next/navigation";

// export default function Sidebar() {
//     const pathname = usePathname();

//     return (
//         <nav className="min-h-screen max-w-5xl py-10 px-5 bg-white shadow-md flex flex-col justify-start items-center gap-y-10 ">
//             <img src="/images/logo/blue-sands.png" alt="" />
//             <div className="flex flex-col gap-y-3">
//                 {sidebarLinks.map((link, index) => {
//                     return (
//                         //<>
//                             <Link key={index} href={link.url} className={`flex items-center text-[0.85rem] gap-x-3 px-3 py-2 rounded-md ${pathname === link.url ? "bg-bgBlue text-white" : ""}`}>
//                                 <img
//                                     src={link.icon}
//                                     alt={link.title}
//                                     className={`${pathname === link.url ? "filter brightness-0 invert" : index === 0 ? "filter brightness-0" : ""}`}
//                                 />
//                                 {link.title}
//                             </Link>
//                        // </>
//                     )
//                 })}

//                 <hr />

//                 <button className="flex items-center text-sm gap-x-3 px-3 py-3 rounded-md text-[0.85rem]">
//                     <img src="/images/icon/logout.svg" alt="Logout" />
//                     <p>Logout</p>
//                 </button>
//             </div>
//             <div className="mt-10">
//                 <Link href="/system/chat">
//                     <img src="/images/bg/amai.svg" alt="" />
//                 </Link>
//             </div>
//         </nav>
//     )
// }


// 2. Updated Sidebar Component
"use client"

import Link from "next/link";
import { sidebarLinks } from "@/lib/data";
import { usePathname } from "next/navigation";
import { HiX } from "react-icons/hi";
import { useUser } from "@/services/UserContext";
import { useRouter } from "next/navigation";
import NProgress from "nprogress";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useUser();
    const router = useRouter();

      function handleLogout() {
        NProgress.start(); // Start the loading bar
        logout();
        router.push("/auth/login");
        NProgress.done(); // Stop the loading bar
      }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="md:hidden min-h-screen fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <nav className={`
                fixed inset-y-0 left-0 z-40 md:z-auto 
                w-64 h-screen overflow-y-auto max-w-xs md:max-w-5xl 
                py-6 md:py-10 px-4 md:px-5 
                bg-white shadow-md 
                flex flex-col justify-start items-center gap-y-6 md:gap-y-10
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Close button for mobile */}
                <button 
                    className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-md"
                    onClick={onClose}
                >
                    <HiX size={24} />
                </button>

                <div className="w-32 md:w-auto">
                    <img src="/images/logo/blue-sands.png" alt="" className="w-full h-auto" />
                </div>

                <div className="flex flex-col gap-y-3 w-full">
                    {sidebarLinks.map((link, index) => {
                        return (
                            <Link 
                                key={index} 
                                href={link.url}
                                className={`flex items-center text-sm md:text-[0.85rem] gap-x-3 px-3 py-2 rounded-md w-full ${pathname === link.url ? "bg-bgBlue text-white" : ""}`}
                                onClick={onClose} // Close sidebar on mobile when link is clicked
                            >
                                <img
                                    src={link.icon}
                                    alt={link.title}
                                    className={`w-5 h-5 ${pathname === link.url ? "filter brightness-0 invert" : index === 0 ? "filter brightness-0" : ""}`}
                                />
                                {link.title}
                            </Link>
                        )
                    })}

                    <hr className="my-2" />

                    <button className="flex items-center text-sm md:text-[0.85rem] gap-x-3 px-3 py-3 rounded-md w-full" onClick={handleLogout}>
                        <img src="/images/icon/logout.svg" alt="Logout" className="w-5 h-5" />
                        <p>Logout</p>
                    </button>
                </div>

                <div className="mt-6 md:mt-10">
                    {/* <Link href="/system/chat"> */}
                    <Link href="#">
                        <img src="/images/bg/amai.svg" alt="" className="w-24 md:w-auto h-auto" />
                    </Link>
                </div>
            </nav>
        </>
    )
}