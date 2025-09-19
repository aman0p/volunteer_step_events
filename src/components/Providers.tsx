'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

interface ProvidersProps {
   children: React.ReactNode;
   session?: Session;
}

export function Providers({ children, session }: ProvidersProps) {
   return (
      <SessionProvider session={session}>
         {children}
         <Toaster />
      </SessionProvider>
   );
}
