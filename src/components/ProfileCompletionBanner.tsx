"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils"; 
import { useProfile } from "@/hooks/useProfile";

export default function ProfileCompletionBanner({className}: {className?: string}) {
  const { data: session } = useSession();
  const { isVerified } = useProfile();

  // Only show for USER role users who are not verified
  if (session?.user?.role !== "USER" || isVerified) {
    return null;
  }

  return (
    <div className={cn("z-10 h-fit w-full bg-gradient-to-r from-gray-800 via-gray-300 to-gray-800", className)}>
      <Link href="/profile" className="flex items-center justify-center gap-2 px-8 py-1.5 text-center text-[10px] font-semibold text-black md:text-[13px]">
           Complete your profile to enroll in events - Apply for Verification
      </Link>
    </div>
  );
}














// import { Icon } from '@/components/ui/icon'

// export default function AnnoncementBanner() {
//      return (
//           <div className="fixed top-0 z-50 h-fit w-full bg-gradient-to-r from-lime-400 to-emerald-400">
//                <div className="flex items-center justify-center gap-2 px-8 py-1.5 text-center text-[10px] font-semibold text-black md:text-[13px]">
//                     <Icon name="Sparkles" className="h-6 w-6 md:h-4 md:w-4" />
//                     Access an ever-growing collection of premium, meticulously crafted components
//                     <Icon name="Sparkles" className="h-6 w-6 md:h-4 md:w-4" />
//                </div>
//           </div>
//      )
// }
