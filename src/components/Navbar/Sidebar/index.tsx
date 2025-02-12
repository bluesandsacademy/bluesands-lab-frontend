"use client"

import Link from "next/link";
import { sidebarLinks } from "@/lib/data";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <nav className="min-h-screen max-w-5xl py-10 px-5 bg-white shadow-md flex flex-col justify-start items-center gap-y-10">
            <img src="/images/logo/blue-sands.png" alt="" />
            <div className="flex flex-col gap-y-7">
                {sidebarLinks.map((link, index) => {
                    return (
                        <>
                            <Link key={index} href={link.url} className={`flex items-center text-sm gap-x-3 px-3 py-4 rounded-md ${pathname === link.url ? "bg-bgBlue text-white" : ""}`}>
                                <img
                                    src={link.icon}
                                    alt={link.title}
                                    className={`${pathname === link.url ? "filter brightness-0 invert" : index === 0 ? "filter brightness-0" : ""}`}
                                />
                                {link.title}
                            </Link>
                        </>
                    )
                })}

                <hr />

                <button className="flex items-center text-sm gap-x-3 px-3 py-3 rounded-md">
                    <img src="/images/icon/logout.svg" alt="Logout" />
                    <p>Logout</p>
                </button>
            </div>
        </nav>
    )
}