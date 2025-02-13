"use client"

import { useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { profileDropdown } from "@/lib/data";

import Link from 'next/link';

export default function UserProfile({ profile }: any) {
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);

    function handleToggleDropdown() {
        setOpenDropdown(!openDropdown)
    }


    return (
        <div className="relative">
            <button className="flex items-center gap-x-5" onClick={handleToggleDropdown}>
                <img src={profile.avatarUrl} alt="" />
                <div className="text-left">
                    <h4 className="truncate">{profile.fullName}</h4>
                    <p className="text-gray-400 font-medium">Account: {profile.accountType}</p>
                </div>
                <RxCaretDown size={15} className="rounded-full border h-6 w-6 object-contain" />
            </button>
            {openDropdown && <div className="absolute top-16 right-0 bg-white rounded-lg w-52 text-left space-y-3 shadow-md border py-3">
                {profileDropdown.map((link, index) => {
                    return (
                        <Link href={link.url} key={index}>
                            <span className="px-3 flex items-center gap-x-3"> <img src={link.imgSrc} alt="" />
                                {link.title}</span>
                            <div className="border-t border-gray-200 my-2"></div>
                        </Link>
                    )
                })}
                <div className="w-full hover:cursor-pointer">
                    <span className="px-3 flex items-center gap-x-3">
                        <img src="/images/icon/logout_red.svg" alt="" />
                        Logout
                    </span>
                </div>
            </div>}
        </div>
    )
}