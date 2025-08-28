import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/ui/StatusBadge";
import EnrollmentActions from "@/components/admin/EnrollmentActions";

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
          enrollments: {
            where: { status: "APPROVED" },
            select: { id: true }
          }
        }
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          skills: true
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });

  const getCapacityStatus = (maxVolunteers: number | null, approvedCount: number) => {
    if (!maxVolunteers) return "Unlimited";
    const remaining = maxVolunteers - approvedCount;
    return `${approvedCount}/${maxVolunteers} (${remaining} remaining)`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event Enrollment Requests</h1>
        <div className="text-sm text-gray-600">
          {pendingEnrollments.length} pending request{pendingEnrollments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {pendingEnrollments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No pending enrollment requests</p>
          <p className="text-sm">All volunteer requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Event Info */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-blue-600">
                      {enrollment.event.title}
                    </h3>
                    <StatusBadge status={enrollment.status} />
                  </div>
                  
                  {/* Capacity Info */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span> {getCapacityStatus(
                      enrollment.event.maxVolunteers, 
                      enrollment.event.enrollments.length
                    )}
                  </div>

                  {/* Volunteer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Volunteer Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {enrollment.user.fullName}</p>
                        <p><span className="font-medium">Email:</span> {enrollment.user.email}</p>
                        <p><span className="font-medium">Phone:</span> {enrollment.user.phoneNumber}</p>
                        <p><span className="font-medium">Skills:</span> {enrollment.user.skills.join(", ") || "None specified"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Requested:</span> {enrollment.enrolledAt.toLocaleDateString()}</p>
                        <p><span className="font-medium">Event ID:</span> {enrollment.eventId}</p>
                        <p><span className="font-medium">User ID:</span> {enrollment.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-6">
                  <EnrollmentActions 
                    enrollmentId={enrollment.id}
                    userName={enrollment.user.fullName}
                    eventId={enrollment.eventId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
