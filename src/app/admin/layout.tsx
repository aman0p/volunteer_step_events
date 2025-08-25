import { authOptions } from "@/auth";
import { Providers } from "@/components/Providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import "@/styles/admin.css";
import { Sidebar } from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
    }
    

    return (
        <Providers session={session}>
            <main className="flex min-h-screen w-full">
                <Sidebar session={session} />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <div className="py-4 px-6 border-b">
                        <Header session={session} />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {children}
                    </div>
                </div>
            </main>
        </Providers>
    );
}

export default AdminLayout;