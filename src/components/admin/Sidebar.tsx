"use client";

import Image from "next/image";
import { adminSideBarLinks } from "@/constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

export function Sidebar({ session }: { session: Session }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col justify-between border-r h-screen w-fit flex-shrink-0 p-2 md:p-4">

            <div className="space-y-10 flex flex-col justify-center items-center md:items-start">
                <Link href="/" className=" mt-2 md:mt-0 md:space-x-2 flex items-center w-fit">
                    <Image
                        src="/icons/logo.svg"
                        alt="logo"
                        width={20}
                        height={20}
                        className="w-7 h-7 invert"
                    />
                    <h1 className="hidden md:block font-bold text-lg">Volunteer Step Events</h1>
                </Link>

                <div className="flex flex-col gap-3 ">
                    {adminSideBarLinks.map((link) => {
                        const isSelected =
                            (link.route === "/admin" && pathname === "/admin") ||
                            (link.route !== "/admin" &&
                                pathname.includes(link.route) &&
                                link.route.length > 1);

                        return (
                            <Link href={link.route} key={link.route} className="flex items-center text-sm">
                                <div
                                    className={cn(
                                        "link flex items-center gap-2 p-1.5 md:px-3 md:py-2.5 w-full rounded-lg transition-colors",
                                        isSelected 
                                            ? "bg-black text-white md:ml-2" 
                                            : "hover:bg-gray-100"
                                    )}
                                >
                                    <div className="size-5 flex items-center justify-center">
                                        <Image
                                            src={link.img}
                                            alt="icon"
                                            width={20}
                                            height={20}
                                            className={`${isSelected ? "brightness-0 invert" : ""}  object-contain size-4`}
                                        />
                                    </div>

                                    <p className={`hidden md:block ${isSelected ? "text-white font-medium" : "text-gray-700"}`}>
                                        {link.text}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </div>
            <div className="pb-1 flex items-center justify-center md:justify-start gap-2">
                <Avatar>
                    <AvatarFallback className="bg-amber-100">
                        {getInitials(session?.user?.name || "IN")}
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col max-md:hidden">
                    <p className="font-semibold text-dark-200">{session?.user?.name}</p>
                    <p className="text-xs text-light-500">{session?.user?.email}</p>
                </div>
            </div>
        </div>
    );
};