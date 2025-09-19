"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { NotificationDrawer } from "./NotificationDrawer";
import { ThemeToggleButton } from "./ThemeToggleButton";

export function Navbar({ session }: { session: Session | null }) {
   const [isLoggingOut, setIsLoggingOut] = useState(false);

   const handleLogout = async () => {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (!confirmed) return;

      setIsLoggingOut(true);
      try {
         await signOut({ redirect: true, callbackUrl: "/sign-in" });
         toast.success("Logged out successfully");
      } catch (error) {
         console.error("Logout error:", error);
         toast.error("Failed to logout");
         setIsLoggingOut(false);
      }
   };

   const NavLink = ({
      href,
      children,
      className = "",
   }: {
      href: string;
      children: React.ReactNode;
      className?: string;
   }) => (
      <Link
         href={href}
         className={`hover:bg-accent rounded-md px-3 py-2 transition-colors ${className}`}
      >
         {children}
      </Link>
   );

   const MobileNav = () => (
      <Sheet>
         <SheetTrigger
            className="hover:bg-accent rounded-md p-2 md:hidden"
            aria-label="Open menu"
         >
            <Menu className="h-5 w-5" />
         </SheetTrigger>
         <SheetContent side="left" className="p-0">
            <div className="flex items-center gap-2 border-b p-4">
               <Image
                  src="/default/logo.svg"
                  alt="logo"
                  width={24}
                  height={24}
                  className="invert"
               />
               <span className="font-bold">Volunteer Step Events</span>
            </div>

            <nav className="space-y-2 p-4">
               {session ? (
                  <>
                     <NavLink href="/">Home</NavLink>
                     {session.user.role === "VOLUNTEER" && (
                        <NavLink href="/my-events">My Events</NavLink>
                     )}
                     <NavLink href="/profile">Profile</NavLink>
                     {(session.user.role === "ADMIN" ||
                        session.user.role === "ORGANIZER") && (
                        <NavLink
                           href="/admin"
                           className="text-foreground font-medium"
                        >
                           Admin Panel
                        </NavLink>
                     )}

                     <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 disabled:opacity-50"
                     >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Signing out..." : "Sign out"}
                     </button>
                  </>
               ) : (
                  <>
                     <NavLink href="/sign-in">Sign In</NavLink>
                     <NavLink
                        href="/sign-up"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                     >
                        Sign Up
                     </NavLink>
                  </>
               )}
            </nav>
         </SheetContent>
      </Sheet>
   );

   return (
      <header className="bg-background sticky top-0 z-50 w-full border-b">
         <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 w-full items-center justify-between">
               {/* Left: Mobile menu + Logo */}
               <div className="flex items-center gap-4">
                  <MobileNav />

                  <Link href="/" className="flex items-center gap-2">
                     <Image
                        src="/default/logo.svg"
                        alt="logo"
                        width={32}
                        height={32}
                        className="invert-100 dark:invert-0"
                     />
                     <h1 className="text-lg font-bold sm:text-xl">
                        Volunteer Step Events
                     </h1>
                  </Link>
               </div>

               {/* Right: Desktop nav + User actions */}
               <div className="flex items-center gap-4">
                  {/* Desktop Navigation */}
                  {session && (
                     <nav className="hidden items-center gap-1 md:flex">
                        <NavLink href="/">Home</NavLink>
                        {session.user.role === "VOLUNTEER" && (
                           <NavLink href="/my-events">My Events</NavLink>
                        )}
                        {(session.user.role === "ADMIN" ||
                           session.user.role === "ORGANIZER") && (
                           <NavLink
                              href="/admin"
                              className="text-foreground font-medium"
                           >
                              Admin Panel
                           </NavLink>
                        )}
                     </nav>
                  )}

                  {/* User Actions */}
                  {session ? (
                     <div className="flex items-center gap-6">
                        <NotificationDrawer />

                        <ThemeToggleButton
                           variant="circle-blur"
                           start="top-right"
                           className="scale-95 md:scale-115"
                        />

                        <Link
                           href="/profile"
                           className="transition-opacity hover:opacity-80"
                        >
                           <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-sm">
                                 {getInitials(session.user.name || "V")}
                              </AvatarFallback>
                           </Avatar>
                        </Link>

                        <button
                           onClick={handleLogout}
                           disabled={isLoggingOut}
                           className="hover:bg-accent hidden items-center gap-2 rounded-md px-3 py-2 disabled:opacity-50 md:flex"
                           title="Sign out"
                        >
                           <LogOut className="h-4 w-4" />
                           <span className="text-sm">
                              {isLoggingOut ? "Signing out..." : "Sign out"}
                           </span>
                        </button>
                     </div>
                  ) : (
                     <div className="hidden items-center gap-3 md:flex">
                        <ThemeToggleButton
                           variant="circle-blur"
                           start="top-right"
                           className="scale-95 md:scale-115"
                        />

                        <Link
                           href="/sign-in"
                           className="hover:bg-accent rounded-md px-3 py-2 transition-colors"
                        >
                           Sign In
                        </Link>

                        <Link
                           href="/sign-up"
                           className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
                        >
                           Sign Up
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
}
