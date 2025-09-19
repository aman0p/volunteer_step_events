"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
// import LenisScroll from "@/components/LenisScroll";

interface ProvidersProps {
   children: React.ReactNode;
   session?: Session;
}

export function Providers({ children, session }: ProvidersProps) {
   return (
      <SessionProvider session={session}>
         <Toaster />
         {/* <LenisScroll /> */}
         {children}
      </SessionProvider>
   );
}
