import { authOptions } from "@/auth";
import { Providers } from "@/components/Providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Header from "@/components/admin/Header";
import { prisma } from "@/lib/prisma";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
    }

    // Check if user has admin role - use database role instead of session role
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
        redirect("/");
    }

    // Sidebar badge should reflect current number of pending enrollment requests
    const enrollmentCount = await prisma.enrollment.count({ where: { status: "PENDING" } });
    
    // Count pending verification requests
    const verificationCount = await prisma.verificationRequest.count({ where: { status: "PENDING" } });

    return (
        <Providers session={session}>
            <SidebarProvider>
                <main className="flex min-h-screen w-full">
                    <Sidebar session={session} enrollmentCount={enrollmentCount} verificationCount={verificationCount} />
                    <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* <div className="border-b">
                        <Header session={session} />
                    </div> */}
                        <div className="flex items-center gap-2 p-2 border-b">
                            <SidebarTrigger />
                        </div>
                        <div className="w-full p-4 md:p-7 md:pr-13 flex-1 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </SidebarProvider>
        </Providers>
    );
}

export default AdminLayout;