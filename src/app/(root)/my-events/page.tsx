import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserEventsTable } from "@/components/UserEventsTable";

export default async function VolunteerEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has volunteer role - use database role instead of session role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || (user.role !== "VOLUNTEER")) {
    redirect("/profile");
  }

  // Get only enrolled events for the current user
  const eventsWithEnrollmentStatus = await prisma.event.findMany({
    where: {
      enrollments: {
        some: {
          userId: session.user.id,
          status: { in: ['APPROVED', 'PENDING', 'WAITLISTED'] }
        }
      }
    },
    include: {
      enrollments: {
        where: { userId: session.user.id },
        select: { status: true }
      }
    },
    orderBy: { startDate: 'asc' }
  });

  // Transform data to include enrollment status
  const eventsData = eventsWithEnrollmentStatus.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    maxVolunteers: event.maxVolunteers,
    enrollmentStatus: event.enrollments.length > 0 ? event.enrollments[0].status : 'NOT_ENROLLED'
  }));

  return (
    <div className="space-y-6 w-6xl px-2">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Enrolled Events</h1>
          <p className="text-muted-foreground">
            View your enrolled events and their status
          </p>
        </div>
        <div className="flex text-sm text-gray-600">
            {eventsData.length} enrolled event{eventsData.length !== 1 ? 's' : ''}
          </div>
      </div>

      {eventsData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No enrolled events</p>
          <p className="text-sm">You haven't enrolled in any events yet</p>
        </div>
      ) : (
        <UserEventsTable events={eventsData} />
      )}
    </div>
  );
}
