
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { languageOptions } from "@/lib/data";
import { RxCaretDown } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import UserProfile from "./UserProfile";

interface TopNavProps {
  onMenuClick?: () => void;
}

export default function TopNav({ onMenuClick }: TopNavProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0])
    const [openLanguageDropdown, setOpenLanguageDropdown] = useState<boolean>(false);
    const [openSearchDropdown, setOpenSearchDropdown] = useState<boolean>(false);
    const pathname = usePathname();
    // const breadcrumb = pathname.split("/").filter((val) => val !== "")
    const breadcrumb = pathname .split("/") .filter((val) => val !== "") .slice(0, 2);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
    }

    function handleLanguageSelect(language: string) {
        setSelectedLanguage(language);
        setOpenLanguageDropdown(false)
    }

    return (
        <nav className="bg-white h-16 md:h-20 flex px-3 md:px-5 py-3 items-center justify-between relative">
            {/* Mobile menu button */}
            <button 
                className="md:hidden pr-2 hover:bg-gray-100 rounded-md"
                onClick={onMenuClick}
            >
                <HiMenu size={24} />
            </button>

            {/* Breadcrumb - hidden on mobile */}
            <h3 className="hidden md:flex font-semibold text-xl lg:text-2xl items-center gap-x-3 lg:mr-6">
                {breadcrumb.map((crumb, index) => {
                    return (
                        <span key={index} className={`capitalize flex items-center gap-x-3 ${index !== 0 ? "font-medium text-sm text-gray-500" : ""}`}>
                            {crumb} {breadcrumb.length > 1 && index === 0 ? <span className="font-normal text-sm">{">"}</span> : ""}
                        </span>
                    )
                })}
            </h3>

            {/* Mobile breadcrumb - simplified */}
            <h3 className="md:hidden font-semibold">
                 {(breadcrumb[breadcrumb.length - 1] || "Dashboard").charAt(0).toUpperCase() + (breadcrumb[breadcrumb.length - 1] || "Dashboard").slice(1)}
            </h3>

            <div className="flex items-center gap-x-2 md:gap-x-6 lg:gap-x-10">
                {/* Search - hidden on mobile, show on tablet+ */}
                <form action="" onSubmit={handleSubmit} className="hidden lg:flex p-3 border-2 border-gray-400 rounded-lg gap-x-3">
                    <img src="/images/icon/magnifying_glass.svg" alt="" />
                    <input 
                        type="text" 
                        id="search" 
                        placeholder="Search Dashboard" 
                        className="h-full w-[280px] xl:w-[380px] object-contain outline-none" 
                    />
                </form>

                {/* Search icon for mobile */}
                <div className="relative">
                    {openSearchDropdown && <div className="fixed inset-0 z-10" onClick={()=> setOpenSearchDropdown(false)}></div>}
                    {/* <button className="lg:hidden p-2 hover:bg-gray-100 rounded-md" onClick={()=> setOpenSearchDropdown(!openSearchDropdown)}> */}
                    <button className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
                        <img src="/images/icon/magnifying_glass.svg" alt="Search" className="w-5 h-5" />
                    </button>
                    {
                        openSearchDropdown && (
                    <div className="absolute bg-white">
                        <form action="" onSubmit={handleSubmit} className="p-3 border-2 border-gray-400 rounded-lg gap-x-3">
                            <img src="/images/icon/magnifying_glass.svg" alt="" />
                            <input 
                                type="text" 
                                id="search" 
                                placeholder="Search Dashboard" 
                                className="h-full w-[280px] xl:w-[380px] object-contain outline-none" 
                            />
                        </form>
                    </div>
                        )
                    }
                </div>
                
                {/* Language selector - simplified on mobile */}
                <div className="relative">
                    {
                        openLanguageDropdown && <div className="fixed inset-0 z-10" onClick={()=> setOpenLanguageDropdown(false)}></div>
                    }
                    <button 
                        onClick={() => setOpenLanguageDropdown(!openLanguageDropdown)} 
                        className="flex items-center gap-x-1 md:gap-x-3 group p-1 md:p-0"
                    >
                        <img src="/images/icon/language_globe.svg" alt="" className="w-5 h-5" />
                        <span className="hidden sm:inline text-sm md:text-base">{selectedLanguage}</span>
                        <RxCaretDown size={20} className="hidden sm:inline md:w-6 md:h-6" />
                    </button>
                    {openLanguageDropdown && (
                        <div className="absolute top-8 md:top-10 right-0 bg-white rounded-lg w-32 md:w-40 text-left space-y-2 shadow-md border py-3 z-50">
                            {languageOptions.map((language, index) => {
                                return (
                                    <div key={index} className="hover:cursor-pointer" onClick={() => handleLanguageSelect(language)}>
                                        <span className="px-3 text-sm md:text-base">{language}</span>
                                        {index !== languageOptions.length - 1 && (
                                            <div className="border-t border-gray-200 my-2"></div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <UserProfile/>
                </div>
            </div>
        </nav>
    )
}