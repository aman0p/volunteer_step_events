"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { PiSignOutBold } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { NotificationDrawer } from "./NotificationDrawer";

export function Navbar({ session }: { session: Session | null }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to sign out?");

    if (!confirmed) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await signOut({
        redirect: true,
        callbackUrl: "/sign-in"
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="z-10 flex items-center justify-between w-full max-w-6xl mx-auto px-3 mt-5">
      {/* Left: Hamburger on small screens; hidden on md+ */}
      <div className="flex items-center gap-1 md:gap-2">
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100" aria-label="Open menu">
            <Menu className="h-5 w-5 md:h-6 md:w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">

            {/* Logo */}
            <div className="flex items-center gap-2 border-b p-4">
              <Image
                src="/default/logo.svg"
                alt="logo"
                width={30}
                height={30}
                className="w-6 h-6 md:w-8 md:h-8 invert"
              />
              <span className="text-lg font-bold">Volunteer Step Events</span>
            </div>

            {/* Nav */}
            <nav className="flex flex-col p-2 text-sm">
              {/* Conditional navigation based on authentication */}
              {session ? (
                <>
                  {/* Home */}
                  <Link href="/" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Home</Link>

                  {/* Events - only for volunteer users */}
                  {session.user.role === "VOLUNTEER" && (
                    <Link href="/my-events" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">My Events</Link>
                  )}

                  {/* Profile */}
                  <Link href="/profile" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Profile</Link>

                  {/* Admin Panel - only for admin and organizer users */}
                  {(session.user.role === "ADMIN" || session.user.role === "ORGANIZER") && (
                    <Link href="/admin" className="text-base rounded-md px-3 py-2 hover:bg-gray-100 text-blue-600 font-medium">Admin Panel</Link>
                  )}

                  {/* Sign out */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-100 disabled:opacity-50"
                  >
                    <PiSignOutBold className="w-5 h-5" />
                    <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Sign in */}
                  <Link href="/sign-in" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Sign In</Link>

                  {/* Sign up */}
                  <Link href="/sign-up" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Sign Up</Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Center: Logo + Title */}
        <Link href="/" className="gap-2 flex items-center w-fit">
          <Image
            src="/default/logo.svg"
            alt="logo"
            width={30}
            height={30}
            className="w-6 h-6 md:w-8 md:h-8 invert"
          />
          <h1 className="font-bold text-base md:text-xl">Volunteer Step Events</h1>
        </Link>
      </div>

      {/* Right: Profile + desktop nav/actions */}
      <div className="flex items-center justify-center gap-4 md:gap-8 w-fit text-sm">
        {/* Desktop nav visible only on md+; on mobile these live in the sidebar */}
        {session && (
          <>
            <Link href="/" className="hidden md:block">Home</Link>
            {/* Events - only for volunteer users */}
            {session.user.role === "VOLUNTEER" && (
              <Link href="/my-events" className="hidden md:block">My Events</Link>
            )}
            {/* Admin Panel - only for admin and organizer users */}
            {(session.user.role === "ADMIN" || session.user.role === "ORGANIZER") && (
              <Link href="/admin" className="hidden md:block text-blue-600 font-medium">Admin Panel</Link>
            )}
          </>
        )}

        {/* Conditional right side based on authentication */}
        {session ? (
          <>
            {/* Notifications (desktop) */}
            <NotificationDrawer />

            <Link href="/profile" aria-label="Profile">
              <Avatar className="w-7 h-7 md:w-7 md:h-7 mb-1 md:mb-0.5">
                {/* <AvatarImage src={session?.user?.image || ""} /> */}
                <AvatarFallback >
                  {getInitials(session?.user?.name || "V")}
                </AvatarFallback>
              </Avatar>
            </Link>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sign out"
            >
              <PiSignOutBold className="w-5 h-5" />
              <span className="hidden md:block">
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Sign in */}
            <Link href="/sign-in" className="hidden md:inline-flex items-center gap-2 py-2 rounded-md transition-colors duration-200">
              Sign In
            </Link>

            {/* Sign up */}
            <Link href="/sign-up" className="hidden md:inline-flex items-center gap-2 px-7 py-2 rounded-md bg-black text-white hover:bg-black/90 transition-colors duration-200">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}