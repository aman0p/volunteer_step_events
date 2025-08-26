import { authOptions } from "@/auth";
import { Providers } from "@/components/Providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { prisma } from "@/lib/prisma";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
    }

    // Check if user has admin role
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
        redirect("/");
    }
    

    return (
        <Providers session={session}>
            <main className="flex min-h-screen w-full">
                <Sidebar session={session} />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* <div className="border-b">
                        <Header session={session} />
                    </div> */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </main>
        </Providers>
    );
}

export default AdminLayout;