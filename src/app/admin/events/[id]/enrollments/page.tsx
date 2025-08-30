import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventEnrollmentTable from "@/components/admin/tables/EventEnrollmentTable";

export default async function EnrollmentsPage({ params }: { params: { id: string } }) {
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

  // Fetch event with enrollments
  const event = await prisma.event.findUnique({
    where: { id: (await params).id },
    include: {
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              profileImage: true,
              gender: true,
              skills: true
            }
          },
          eventRole: {
            select: {
              id: true,
              name: true,
              description: true,
              payout: true
            }
          }
        }
      }
    }
  });

  if (!event) {
    redirect("/admin/events");
  }

  // Owner guard: only creator can view
  const owner = await prisma.event.findUnique({
    where: { id: event.id },
    select: { createdById: true }
  });
  if (!owner || owner.createdById !== session.user.id) {
    redirect("/admin/events");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Event Enrollments</h1>
        <p className="text-muted-foreground mt-2">
          Manage volunteer enrollments for "{event.title}"
        </p>
      </div>
      
      <EventEnrollmentTable
        enrollments={event.enrollments}
        eventTitle={event.title}
        eventLocation={event.location}
        eventStartDate={event.startDate}
        eventEndDate={event.endDate}
        currentUserRole={user.role as "ADMIN" | "ORGANIZER"}
      />
    </div>
  );
}