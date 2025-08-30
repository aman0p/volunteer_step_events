import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Users, Edit, Trash2, ExternalLink, Tag } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function VolunteerDetailsPage({ params }: { params: { id: string } }) {
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

  // Fetch volunteer with all enrollments and event details
  const volunteer = await prisma.user.findUnique({
    where: { id: (await params).id },
    include: {
      enrollments: {
        include: {
          event: {
            select: {
              id: true,
              title: true,
              description: true,
              startDate: true,
              endDate: true,
              location: true,
              category: true,
              coverUrl: true,
              maxVolunteers: true,
              enrollments: {
                where: { status: "APPROVED" },
                select: { id: true }
              }
            }
          }
        },
        orderBy: { enrolledAt: "desc" }
      }
    }
  });

  if (!volunteer) {
    redirect("/admin/volunteer");
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeRange = (startDate: Date, endDate: Date) => {
    const start = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(startDate);

    const end = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(endDate);

    return `${start} - ${end}`;
  };

  const getEnrollmentStats = (enrollments: any[]) => {
    const approved = enrollments.filter(e => e.status === 'APPROVED').length;
    const pending = enrollments.filter(e => e.status === 'PENDING').length;
    const rejected = enrollments.filter(e => e.status === 'REJECTED').length;
    return { approved, pending, rejected, total: enrollments.length };
  };

  const stats = getEnrollmentStats(volunteer.enrollments);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Link 
          href="/admin/volunteer" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Volunteers
        </Link>
      </div>

      <div className="flex justify-between w-full">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{volunteer.fullName}</h1>
          <p className="text-muted-foreground">
            View volunteer profile and event history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Volunteer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{volunteer.fullName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{volunteer.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm">
                  <span className="text-gray-700 select-none">+91</span>
                  {volunteer.phoneNumber}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-sm">{volunteer.gender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{volunteer.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <p className="text-sm">
                  <Badge variant="outline">{volunteer.role}</Badge>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-sm">{formatDate(volunteer.createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Volunteer ID</label>
                <p className="text-sm font-mono text-xs">{volunteer.id}</p>
              </div>
            </div>

            {/* Skills */}
            {volunteer.skills && volunteer.skills.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">Skills</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {volunteer.skills.map((skill, index) => (
                    <Badge key={index} variant="default" className="text-xs py-1 px-2">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Event History */}
          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">Event History ({volunteer.enrollments.length})</h2>

            {volunteer.enrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-500">This volunteer hasn't enrolled in any events yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteer.enrollments.map((enrollment) => (
                    <TableRow
                      key={enrollment.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="group">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{enrollment.event.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={enrollment.status} />
                              <span className="text-xs text-gray-500">
                                Enrolled: {formatDate(enrollment.enrolledAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{enrollment.event.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Right Side - Statistics & Profile Image */}
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
            <div className="relative">
              {volunteer.profileImage ? (
                <Image
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src={volunteer.profileImage}
                  alt={volunteer.fullName}
                  width={1000}
                  height={1000}
                  className="rounded-lg aspect-video object-cover object-top"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-6xl text-gray-400">{volunteer.gender.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Statistics */}
          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">Enrollment Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Approved</span>
                </div>
                <span className="text-lg font-bold text-green-600">{stats.approved}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{stats.pending}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Rejected</span>
                </div>
                <span className="text-lg font-bold text-red-600">{stats.rejected}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Events</span>
                  <span className="text-lg font-bold text-gray-900">{stats.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}