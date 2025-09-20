import { authOptions } from "@/auth";
import { Providers } from "@/components/Providers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/role-check";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   // Check if user has admin role using cached role check
   const adminCheck = await requireAdmin();
   if (!adminCheck) {
      redirect("/");
   }

   // Sidebar badge should reflect current number of pending enrollment requests for this admin
   const enrollmentCount = await prisma.enrollment.count({
      where: { status: "PENDING", event: { createdById: session.user.id } },
   });

   // Count pending verification requests
   const verificationCount = await prisma.verificationRequest.count({
      where: { status: "PENDING" },
   });

   return (
      <Providers session={session}>
         <SidebarProvider>
            <main className="flex min-h-screen w-full">
               <Sidebar
                  session={session}
                  enrollmentCount={enrollmentCount}
                  verificationCount={verificationCount}
               />
               <div className="flex h-screen flex-1 flex-col overflow-hidden">
                  {/* <div className="border-b">
                        <Header session={session} />
                    </div> */}
                  <div className="flex items-center gap-2 border-b p-2">
                     <SidebarTrigger />
                  </div>
                  <div className="w-full flex-1 overflow-y-auto p-4 md:p-7 md:pr-13">
                     {children}
                  </div>
               </div>
            </main>
         </SidebarProvider>
      </Providers>
   );
};

export default AdminLayout;
