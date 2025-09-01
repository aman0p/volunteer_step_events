import { authOptions } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { Providers } from "@/components/Providers";
import { prisma } from "@/lib/prisma";
import ProfileCompletionBanner from "@/components/ProfileCompletionBanner";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  // Update lastActiveAt once per day for authenticated users
  if (session?.user?.id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { lastActiveAt: true },
      });

      // Only proceed if user exists
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
      // Log error but don't crash the layout
      console.error('Error updating user lastActiveAt:', error);
    }
  }

  return (
    <Providers session={session}>
      <div className="flex flex-col items-center justify-center w-full mx-auto h-full">
        {session && <ProfileCompletionBanner className="w-full sticky top-0" />}
        <Navbar session={session} />
        <div className="mt-10 px-3 md:px-0 w-full md:w-4xl lg:w-6xl">{children}</div>
      </div>
    </Providers>
  );
}

export default Layout;