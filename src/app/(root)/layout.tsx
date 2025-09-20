import { authOptions } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { Providers } from "@/components/Providers";
import { prisma } from "@/lib/prisma";
import ProfileCompletionBanner from "@/components/ProfileCompletionBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Volunteer Step Events",
   description: "Manage your events and volunteers",
   icons: {
      icon: "/default/logo.svg",
   },
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
   const session = await getServerSession(authOptions);

   // Update lastActiveAt once per day for authenticated users (moved to background)
   if (session?.user?.id) {
      // Run this asynchronously without blocking the page render
      setImmediate(async () => {
         try {
            const user = await prisma.user.findUnique({
               where: { id: session.user.id },
               select: { lastActiveAt: true },
            });

            if (user) {
               const today = new Date().toISOString().slice(0, 10);
               const lastActiveDate = user.lastActiveAt
                  ? new Date(user.lastActiveAt).toISOString().slice(0, 10)
                  : null;

               if (lastActiveDate !== today) {
                  await prisma.user.update({
                     where: { id: session.user.id },
                     data: { lastActiveAt: new Date() },
                  });
               }
            }
         } catch (error) {
            console.error("Error updating user lastActiveAt:", error);
         }
      });
   }

   return (
      <Providers session={session || undefined}>
         <div className="fixed inset-0 z-[-1] bg-[url('/default/gradient-background.svg')] bg-cover bg-center opacity-80" />
         <div className="font-noto-sans mx-auto flex h-full w-full flex-col items-center justify-center">
            {session && (
               <ProfileCompletionBanner className="sticky top-0 w-full" />
            )}
            <Navbar session={session} />
            <div className="w-full">{children}</div>
         </div>
      </Providers>
   );
};

export default Layout;
