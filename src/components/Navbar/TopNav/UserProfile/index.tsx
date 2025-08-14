"use client";

import { useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { profileDropdown } from "@/lib/data";
import { useUser } from "@/services/UserContext";
import { useRouter } from "next/navigation";

import Link from "next/link";
import NProgress from "nprogress";
import Image from "next/image";

export default function UserProfile() {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const { user, logout } = useUser();
  const router = useRouter();

  function handleLogout() {
    NProgress.start(); // Start the loading bar
    logout();
    setOpenDropdown(false);
    router.push("/auth/login");
    NProgress.done(); // Stop the loading bar
  }

  function handleToggleDropdown() {
    setOpenDropdown(!openDropdown);
  }

  // function handleCloseDropdown() {
  //     setOpenDropdown(false)
  // }
  // function handleClickOutside(event: MouseEvent) {
  //     const target = event.target as HTMLElement;
  //     if (!target.closest('.relative')) {
  //         handleCloseDropdown();
  //     }
  // }
  // useEffect(() => {
  //     document.addEventListener('click', handleClickOutside);
  //     return () => {
  //         document.removeEventListener('click', handleClickOutside);
  //     };
  // }, []);

  return (
    <div className="relative">
      {openDropdown && (<div className="fixed inset-0 z-10" onClick={()=> setOpenDropdown(false)}></div>)}
      <button
        className="flex items-center gap-x-2 lg:gap-x-5"
        onClick={handleToggleDropdown}
      > 
        {user?.avatarUrl ? <Image src={user?.avatarUrl} alt="avatar-image" className="w-8 h-8 lg:w-10 lg:h-10"  width={40} height={40}/> : <Image src="/images/avatar/user01.png" alt="avatar-image" className="w-8 h-8 lg:w-10 lg:h-10"  width={40} height={40} />}
        <div className="hidden text-left lg:block">
          <h4 className="truncate text-sm lg:text-base">{user?.fullName}</h4>
          <p className="text-gray-400 font-medium text-xs lg:text-sm">Account: {user?.role}</p>
        </div>
        <RxCaretDown
          size={15}
          className="hidden md:block rounded-full border h-6 w-6 object-contain"
        />
      </button>
      {openDropdown && (
        <div className="absolute top-16 right-0 bg-white rounded-lg w-52 text-left space-y-3 shadow-md border py-3 z-50">
          {profileDropdown.map((link, index) => {
            return (
              <Link href={link.url} key={index}>
                <span className="px-3 flex items-center gap-x-3">
                  {" "}
                  <img src={link.imgSrc} alt="" />
                  {link.title}
                </span>
                <div className="border-t border-gray-200 my-2"></div>
              </Link>
            );
          })}
          <div className="w-full hover:cursor-pointer" onClick={handleLogout}>
            <span className="px-3 flex items-center gap-x-3">
              <img src="/images/icon/logout_red.svg" alt="" />
              Logout
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
