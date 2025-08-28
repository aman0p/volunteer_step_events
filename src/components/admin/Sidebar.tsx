"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Session } from "next-auth";
import { NotificationCount } from "@/components/ui/notification";

export function Sidebar({ session, enrollmentCount }: { session: Session; enrollmentCount: number }) {
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
                        className="w-6.5 h-6.5 invert"
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
                                                <Icon className="size-5" />
                                                <span className="text-sm">{link.text}</span>
                                                {link.text === "Event Enrollments" && (
                                                    <div className="ml-8">
                                                        <NotificationCount count={enrollmentCount} />
                                                    </div>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className="relative right-2" />

            <SidebarFooter>
                <div className="py-2 flex items-center justify-start gap-3 px-1">
                    <Avatar className="scale-110">
                        <AvatarFallback className="bg-amber-100">
                            {getInitials(session?.user?.name || "IN")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="font-semibold text-dark-200">{session?.user?.name}</p>
                        <p className="text-xs text-light-500">{session?.user?.email}</p>
                    </div>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </UISidebar>
    );
}