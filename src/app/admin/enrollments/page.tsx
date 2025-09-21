import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventEnrollmentTable from "@/components/admin/tables/EnrollmentTable";

export default async function EnrollmentsPage() {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   // Check if user has admin role - use database role instead of session role
   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
   });

   if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
      redirect("/");
   }

   // Get pending enrollments only for events created by current admin
   const pendingEnrollments = await prisma.enrollment.findMany({
      where: { status: "PENDING", event: { createdById: session.user.id } },
      include: {
         event: {
            select: {
               id: true,
               title: true,
               maxVolunteers: true,
            },
         },
         user: {
            select: {
               id: true,
               fullName: true,
               email: true,
               phoneNumber: true,
               skills: true,
               profileImage: true,
            },
         },
         eventRole: {
            select: {
               id: true,
               name: true,
               payout: true,
            },
         },
      },
      orderBy: { enrolledAt: "desc" },
   });

   return (
      <div className="space-y-6">
         <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between">
            <div>
               <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                  Event Enrollment Requests
               </h1>
               <p className="text-muted-foreground text-sm md:text-base">
                  Review and approve event enrollment requests
               </p>
            </div>
            <div className="mt-3 flex items-center gap-5 text-sm text-gray-600 md:mt-0">
               Pending request{pendingEnrollments.length !== 1 ? "s" : ""} ({" "}
               {pendingEnrollments.length} )
            </div>
         </div>

         {pendingEnrollments.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
               <p className="text-lg">No pending enrollment requests</p>
               <p className="text-sm">
                  All volunteer requests have been processed
               </p>
            </div>
         ) : (
            <EventEnrollmentTable enrollments={pendingEnrollments} />
         )}
      </div>
   );
}
