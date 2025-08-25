import { authOptions } from "@/auth";
import { Header } from "@/components/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Providers } from "@/components/Providers";
import { prisma } from "@/lib/prisma";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  // Update lastActiveAt once per day
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
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto h-full px-3 py-5">
        <Header session={session} />
        <div className="mt-10">{children}</div>
      </div>
    </Providers>
  );
}

export default Layout;