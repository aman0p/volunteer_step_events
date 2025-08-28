import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Filter, Download, Plus, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import VolunteerSearch from "@/components/admin/VolunteerSearch";

export default async function VolunteerPage() {
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

  // Fetch all volunteers with their enrollments and event details
  const volunteers = await prisma.user.findMany({
    where: { 
      OR: [
        { role: "USER" },
        { role: "VOLUNTEER" }
      ]
    },
    include: {
      enrollments: {
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
              location: true,
              category: true
            }
          }
        },
        orderBy: { enrolledAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "👨";
      case "FEMALE":
        return "👩";
      case "OTHER":
        return "👤";
      default:
        return "👤";
    }
  };

  const getEnrollmentStats = (enrollments: any[]) => {
    const approved = enrollments.filter(e => e.status === 'APPROVED').length;
    const pending = enrollments.filter(e => e.status === 'PENDING').length;
    const rejected = enrollments.filter(e => e.status === 'REJECTED').length;
    return { approved, pending, rejected, total: enrollments.length };
  };

  const totalVolunteers = volunteers.length;
  const activeVolunteers = volunteers.filter(v => v.enrollments.some(e => e.status === 'APPROVED')).length;
  const newVolunteers = volunteers.filter(v => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return v.createdAt > thirtyDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
            <p className="text-gray-600">Manage all volunteers across all events</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Volunteer
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Volunteers</p>
                  <p className="text-2xl font-bold text-blue-600">{totalVolunteers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Volunteers</p>
                  <p className="text-2xl font-bold text-green-600">{activeVolunteers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New This Month</p>
                  <p className="text-2xl font-bold text-purple-600">{newVolunteers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="max-w-xl">
              <VolunteerSearch
                placeholder="Search volunteers by name, email, or skills..."
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Volunteers List */}
        <Card>
          <CardHeader>
            <CardTitle>All Volunteers ({totalVolunteers})</CardTitle>
            <CardDescription>Manage and view all registered volunteers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {volunteers.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers yet</h3>
                <p className="text-gray-500">Volunteers will appear here once they register.</p>
              </div>
            ) : (
              <div className="divide-y">
                {volunteers.map((volunteer) => {
                  const stats = getEnrollmentStats(volunteer.enrollments);
                  return (
                    <div key={volunteer.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <Link href={`/admin/volunteer/${volunteer.id}`} className="flex items-start gap-4">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          {volunteer.profileImage ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                urlEndpoint={config.env.imagekit.urlEndpoint}
                                src={volunteer.profileImage}
                                alt={volunteer.fullName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-2xl">{getGenderIcon(volunteer.gender)}</span>
                            </div>
                          )}
                        </div>

                        {/* Volunteer Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {volunteer.fullName}
                                </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Email:</span>
                                  {volunteer.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Phone:</span>
                                  <span className="text-gray-700 select-none">+91</span>
                                  <span className="text-gray-700">{volunteer.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Address:</span>
                                  {volunteer.address}
                                </div>
                              </div>
                            </div>

                            {/* Actions and Stats */}
                            <div className="flex flex-col items-end gap-3">
                              {/* Enrollment Stats */}
                              <div className="text-right">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-green-600 font-medium">{stats.approved} Approved</span>
                                  <span className="text-yellow-600 font-medium">{stats.pending} Pending</span>
                                  <span className="text-red-600 font-medium">{stats.rejected} Rejected</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {volunteers.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {volunteers.length} of {volunteers.length} volunteers
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}