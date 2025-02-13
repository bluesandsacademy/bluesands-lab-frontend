"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { languageOptions, profile } from "@/lib/data";
import { RxCaretDown } from "react-icons/rx";
import UserProfile from "./UserProfile";

export default function TopNav() {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0])
    const [openLanguageDropdown, setOpenLanguageDropdown] = useState<boolean>(false);
    const pathname = usePathname();
    const breadcrumb = pathname.split("/").filter((val) => val !== "")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
    }

    function handleLanguageSelect(language: string) {
        setSelectedLanguage(language);
        setOpenLanguageDropdown(false)
    }

    return (
        <nav className="bg-white h-20 flex p-3 items-center justify-between">
            <h3 className="font-semibold text-2xl flex items-center gap-x-3">
                {breadcrumb.map((crumb, index) => {
                    return (
                        <span key={index} className={`capitalize flex items-center gap-x-3 ${index !== 0 ? "font-medium text-sm text-gray-500" : ""}`}>{crumb} {breadcrumb
                            .length > 1 && index === 0 ? <span className="font-normal text-sm">{">"}</span> : ""} </span>
                    )
                })}
            </h3>
            <div className="flex items-center gap-x-10">
                <form action="" onSubmit={handleSubmit} className="flex p-3 border-2 border-gray-400 rounded-lg gap-x-3">
                    <img src="/images/icon/magnifying_glass.svg" alt="" />
                    <input type="text" id="search" placeholder="Search Dashboard" className="h-full w-[380px] object-contain outline-none" />
                </form>
                <div className="relative">
                    <button onClick={() => setOpenLanguageDropdown(!openLanguageDropdown)} className="flex items-center gap-x-3 group">
                        <img src="/images/icon/language_globe.svg" alt="" />
                        {selectedLanguage}
                        <RxCaretDown size={25} />
                    </button>
                    {openLanguageDropdown && <div className="absolute top-10 left-0 bg-white rounded-lg w-40 text-left space-y-2 shadow-md border py-3">
                        {languageOptions.map((language, index) => {
                            return (
                                <div key={index} className="hover:cursor-pointer" onClick={() => handleLanguageSelect(language)}>
                                    <span className="px-3">{language}</span>
                                    {index !== languageOptions.length - 1 && (
                                        <div className="border-t border-gray-200 my-2"></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>}
                </div>
                <div className="relative">
                    <UserProfile profile={profile} />
                </div>
            </div>
        </nav>
    )
}