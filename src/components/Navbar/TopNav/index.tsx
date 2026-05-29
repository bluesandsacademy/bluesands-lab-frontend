
"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    adminSideNavLinks,
    languageOptions,
    profileDropdown,
    sidebarLinks,
    sideNavLinks,
    teacherProfileDropdown,
    teacherSideNavLinks,
} from "@/lib/data";
import { RxCaretDown } from "react-icons/rx";
import { HiMenu } from "react-icons/hi";
import UserProfile from "./UserProfile";
import { useUser } from "@/services/UserContext";

interface TopNavProps {
  onMenuClick?: () => void;
}

type SearchTarget = {
    title: string;
    url: string;
    keywords?: string[];
};

function normalize(value = "") {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getSearchTargets(role?: string): SearchTarget[] {
    const normalizedRole = normalize(role);

    if (normalizedRole === "schooladmin") {
        return [
            ...sideNavLinks,
            { title: "Contact Support", url: "/school/dashboard/contact-support", keywords: ["help", "admin support"] },
        ];
    }

    if (normalizedRole === "globaladmin") {
        return [
            ...adminSideNavLinks,
            { title: "System Settings", url: "/admin/dashboard/system-settings", keywords: ["settings", "configuration"] },
            { title: "Customer Support", url: "/admin/dashboard/customer-support", keywords: ["support", "help"] },
        ];
    }

    if (normalizedRole === "teacher") {
        return [
            ...teacherSideNavLinks,
            ...teacherProfileDropdown,
            { title: "Contact Support", url: "/teacher/dashboard/contact-support", keywords: ["help", "admin support"] },
            { title: "Learning Space", url: "/teacher/dashboard/classes/learning-space", keywords: ["spaces", "assignments"] },
            { title: "Create Learning Space", url: "/teacher/dashboard/classes/create-space", keywords: ["create space", "new class space"] },
        ];
    }

    return [
        ...sidebarLinks,
        ...profileDropdown,
        { title: "Admin Support", url: "/dashboard/support", keywords: ["support", "help"] },
        { title: "Subscriptions", url: "/dashboard/profile/subscriptions", keywords: ["subscription", "plan"] },
    ];
}

export default function TopNav({ onMenuClick }: TopNavProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(languageOptions[0])
    const [openLanguageDropdown, setOpenLanguageDropdown] = useState<boolean>(false);
    const [openSearchDropdown, setOpenSearchDropdown] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUser();
    // const breadcrumb = pathname.split("/").filter((val) => val !== "")
    const breadcrumb = pathname .split("/") .filter((val) => val !== "") .slice(0, 2);

    const searchTargets = useMemo(() => getSearchTargets(user?.role), [user?.role]);
    const searchResults = useMemo(() => {
        const query = normalize(searchQuery);

        if (!query) {
            return [];
        }

        return searchTargets
            .filter((target) => {
                const searchableText = normalize([
                    target.title,
                    target.url,
                    ...(target.keywords || []),
                ].join(" "));

                return searchableText.includes(query);
            })
            .sort((first, second) => {
                const firstTitle = normalize(first.title);
                const secondTitle = normalize(second.title);

                if (firstTitle.startsWith(query) && !secondTitle.startsWith(query)) return -1;
                if (!firstTitle.startsWith(query) && secondTitle.startsWith(query)) return 1;
                return first.title.localeCompare(second.title);
            })
            .slice(0, 6);
    }, [searchQuery, searchTargets]);

    function navigateToSearchTarget(target: SearchTarget) {
        setSearchQuery("");
        setOpenSearchDropdown(false);
        router.push(target.url);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const [firstResult] = searchResults;

        if (firstResult) {
            navigateToSearchTarget(firstResult);
        }
    }

    function handleLanguageSelect(language: string) {
        setSelectedLanguage(language);
        setOpenLanguageDropdown(false)
    }

    function renderSearchForm(formClassName: string, inputClassName: string, inputId: string) {
        return (
            <form action="" onSubmit={handleSubmit} className={formClassName}>
                <img src="/images/icon/magnifying_glass.svg" alt="" />
                <input
                    type="search"
                    id={inputId}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setOpenSearchDropdown(true);
                    }}
                    onFocus={() => setOpenSearchDropdown(true)}
                    placeholder="Search Dashboard"
                    className={inputClassName}
                    autoComplete="off"
                />
            </form>
        );
    }

    function renderSearchResults(dropdownClassName: string) {
        if (!openSearchDropdown || !searchQuery.trim()) return null;

        return (
            <div className={dropdownClassName}>
                {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                        <button
                            type="button"
                            key={result.url}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => navigateToSearchTarget(result)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                            <span className="block text-sm font-medium text-gray-800">{result.title}</span>
                            <span className="block text-xs text-gray-400 truncate">{result.url}</span>
                        </button>
                    ))
                ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                        No dashboard feature found
                    </div>
                )}
            </div>
        );
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
                <div className="relative hidden lg:block">
                    {openSearchDropdown && <div className="fixed inset-0 z-10" onClick={()=> setOpenSearchDropdown(false)}></div>}
                    {renderSearchForm(
                        "relative z-20 flex p-3 border-2 border-gray-400 rounded-lg gap-x-3 bg-white",
                        "h-full w-[280px] xl:w-[380px] object-contain outline-none",
                        "desktop-dashboard-search"
                    )}
                    {renderSearchResults("absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-lg border bg-white shadow-lg")}
                </div>

                {/* Search icon for mobile */}
                <div className="block md:hidden relative">
                    {openSearchDropdown && <div className="fixed inset-0 z-10" onClick={()=> setOpenSearchDropdown(false)}></div>}
                    <button className="lg:hidden p-2 hover:bg-gray-100 rounded-md" onClick={()=> setOpenSearchDropdown(!openSearchDropdown)}>
                        <img src="/images/icon/magnifying_glass.svg" alt="Search" className="w-5 h-5" />
                    </button>
                    {
                        openSearchDropdown && (
                    <div className="absolute -right-20 top-10 z-50 w-[calc(100vw-1.5rem)] max-w-sm bg-white">
                        {renderSearchForm(
                            "relative z-20 flex p-3 border-2 border-gray-400 rounded-lg gap-x-3 bg-white",
                            "h-full min-w-0 flex-1 object-contain outline-none",
                            "mobile-dashboard-search"
                        )}
                        {renderSearchResults("mt-2 overflow-hidden rounded-lg border bg-white shadow-lg")}
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
