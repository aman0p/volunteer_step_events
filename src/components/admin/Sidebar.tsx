"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";

import { Home, Users, Book, Bookmark, UserCheck } from "lucide-react";

import { adminSideBarLinks } from "@/constants";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Sidebar as UISidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
    SidebarRail,
} from "@/components/ui/sidebar";

export function Sidebar({ session }: { session: Session }) {
    const pathname = usePathname();

    return (
            <UISidebar side="left" variant="sidebar" collapsible="icon" className="border-r">
                <SidebarHeader>
                    <Link href="/" className="mt-1 md:mt-0 flex items-center gap-2 px-2 py-1.5">
                        <Image
                            src="/icons/logo.svg"
                            alt="logo"
                            width={28}
                            height={28}
                            className="w-7 h-7 invert"
                        />
                        <h1 className="hidden md:block font-bold text-lg group-data-[collapsible=icon]:hidden">Volunteer Step Events</h1>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {adminSideBarLinks.map((link) => {
                                    const isSelected =
                                        (link.route === "/admin" && pathname === "/admin") ||
                                        (link.route !== "/admin" && pathname.includes(link.route) && link.route.length > 1);

                                    const Icon =
                                        link.text === "Home" ? Home :
                                        link.text === "All Volunteers" ? Users :
                                        link.text === "All Events" ? Book :
                                        link.text === "Event Enrollments" ? Bookmark :
                                        link.text === "Account Requests" ? UserCheck : Home;

                                    return (
                                        <SidebarMenuItem key={link.route}>
                                            <SidebarMenuButton asChild isActive={isSelected}>
                                                <Link href={link.route}>
                                                    <Icon className="size-4" />
                                                    <span>{link.text}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarSeparator />

                <SidebarFooter>
                    <div className="pb-1 flex items-center justify-center md:justify-start gap-2 px-1">
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
                </SidebarFooter>

                <SidebarRail />
            </UISidebar>
    );
}