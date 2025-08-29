import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventEnrollmentTable from "@/components/admin/tables/EnrollmentTable";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui";

export default async function EnrollmentsPage() {
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

  // Get all pending enrollments with event and user details
  const pendingEnrollments = await prisma.enrollment.findMany({
    where: { status: "PENDING" },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          maxVolunteers: true,
        }
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          skills: true,
          profileImage: true
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Enrollment Requests</h1>
          <p className="text-muted-foreground">
            Review and approve event enrollment requests
          </p>
        </div>
        <div className="flex items-center gap-5">

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <div className="text-sm text-gray-600">
             Pending request{pendingEnrollments.length !== 1 ? 's' : ''} ( {pendingEnrollments.length} )
          </div>
        </div>
      </div>

      {pendingEnrollments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No pending enrollment requests</p>
          <p className="text-sm">All volunteer requests have been processed</p>
        </div>
      ) : (
        <EventEnrollmentTable enrollments={pendingEnrollments} />
      )}
    </div>
  );
}
