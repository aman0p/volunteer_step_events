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

export function Navbar({ session }: { session: Session }) {
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
    <header className="z-10 flex items-center justify-between w-full">
      {/* Left: Hamburger on small screens; hidden on md+ */}
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex items-center gap-2 border-b p-4">
              <Image src="/icons/logo.svg" alt="logo" width={20} height={20} className="w-6 h-6 invert" />
              <span className="text-lg font-bold">Volunteer Step Events</span>
            </div>
            <nav className="flex flex-col p-2 text-sm">
              <Link href="/" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Home</Link>
              <Link href="/events" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Events</Link>
              <Link href="/profile" className="text-base rounded-md px-3 py-2 hover:bg-gray-100">Profile</Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-100 disabled:opacity-50"
              >
                <PiSignOutBold className="w-5 h-5" />
                <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
              </button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Center: Logo + Title */}
        <Link href="/" className="space-x-2 flex items-center w-fit">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={20}
            height={20}
            className="w-6 h-6 invert"
          />
          <h1 className="font-bold text-lg">Volunteer Step Events</h1>
        </Link>
      </div>

      {/* Right: Profile + desktop nav/actions */}
      <div className="flex items-center justify-center gap-4 md:gap-8 w-fit text-sm">
        {/* Desktop nav visible only on md+; on mobile these live in the sidebar */}
        <Link href="/" className="hidden md:block">Home</Link>
        <Link href="/events" className="hidden md:block">Events</Link>

        <Link href="/profile" aria-label="Profile">
          <Avatar>
            {/* <AvatarImage src={session?.user?.image || ""} /> */}
            <AvatarFallback>
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
      </div>
    </header>
  )
}