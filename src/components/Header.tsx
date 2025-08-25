"use client";

import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import { getInitials } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

export function Header({ session }: { session: Session }) {
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
    <header className="flex justify-between items-center w-full">
      <Link href="/" className="space-x-2 flex items-center w-fit">
        <Image src="/icons/logo.svg" alt="logo" width={20} height={20} className="w-6 h-6 invert" />
        <h1 className="font-bold text-lg">Volunteer Step Events</h1>
      </Link>

      <div className="flex items-center justify-center gap-5 md:gap-10 w-fit text-sm">
        <Link href="/" className="hidden md:block">Home</Link>
        <Link href="/events">Events</Link>

        <Link href="/profile">
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
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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