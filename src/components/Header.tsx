import Link from "next/link";
import Image from "next/image";
import { UserIcon } from "lucide-react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";

export function Header() {
  return (
    <header className="flex justify-between items-center w-full">
      <Link href="/" className="space-x-2 flex items-center w-fit">
        <Image src="/icons/logo.svg" alt="logo" width={20} height={20} className="w-6 h-6 invert" />
        <h1 className="font-bold text-lg">Volunteer Step Events</h1>
      </Link>

      <div className="flex items-center justify-center gap-5 md:gap-10 w-fit text-sm">
        <Link href="/" className="hidden md:block">Home</Link>
        <Link href="/events">Events</Link>
        <FaUser className="w-5 h-5 mb-0.5" />
        <PiSignOutBold className="w-5 h-5 mb-0.5" />
      </div>
    </header>

  )
}