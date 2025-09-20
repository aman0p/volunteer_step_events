import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserEventsTable } from "@/components/user/UserEventsTable";
import { requireVolunteer } from "@/lib/utils/role-check";
import { Status } from "@/generated/prisma";
import Section from "@/components/ui/section";

export default async function VolunteerEventsPage() {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   // Check if user has volunteer role using cached role check
   const volunteerCheck = await requireVolunteer();
   if (!volunteerCheck) {
      redirect("/profile");
   }

   // Get only enrolled events for the current user
   const eventsWithEnrollmentStatus = await prisma.event.findMany({
      where: {
         enrollments: {
            some: {
               userId: session.user.id,
               status: {
                  in: [Status.APPROVED, Status.PENDING, Status.WAITLISTED],
               },
            },
         },
      },
      include: {
         enrollments: {
            where: { userId: session.user.id },
            select: { status: true },
         },
      },
      orderBy: { startDate: "asc" },
   });

   // Transform data to include enrollment status
   const eventsData = eventsWithEnrollmentStatus.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      maxVolunteers: event.maxVolunteers,
      enrollmentStatus:
         event.enrollments.length > 0
            ? event.enrollments[0].status
            : "NOT_ENROLLED",
   }));

   return (
      <Section className="space-y-6 px-2">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
                  My Enrolled Events
               </h1>
               <p className="text-muted-background text-sm font-light md:text-base">
                  View your enrolled events and their status
               </p>
            </div>
            <div className="text-muted-background flex text-sm font-light md:text-base">
               {eventsData.length} enrolled event
               {eventsData.length !== 1 ? "s" : ""}
            </div>
         </div>

         {eventsData.length === 0 ? (
            <div className="text-muted-background py-12 text-center font-light md:text-base">
               <p className="text-lg">No enrolled events</p>
               <p className="text-sm">
                  You haven&apos;t enrolled in any events yet
               </p>
            </div>
         ) : (
            <UserEventsTable events={eventsData} />
         )}
      </Section>
   );
}
