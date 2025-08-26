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

  const stats = getEnrollmentStats(volunteer.enrollments);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/volunteers">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Volunteers
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{volunteer.fullName}</h1>
              <p className="text-gray-600">Volunteer Profile & Event History</p>
            </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Volunteer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
                {/* Profile Image */}
                <div className="flex md:flex-shrink-0 w-full md:w-fit justify-center md:justify-start">
                  {volunteer.profileImage ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={volunteer.profileImage}
                        alt={volunteer.fullName}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-4xl">{getGenderIcon(volunteer.gender)}</span>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{volunteer.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{volunteer.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{volunteer.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <Badge variant="outline">{volunteer.role}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {volunteer.skills && volunteer.skills.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {volunteer.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">{formatDate(volunteer.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium text-gray-900">{volunteer.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event History ({volunteer.enrollments.length})</h2>
              
              {volunteer.enrollments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-500">This volunteer hasn't enrolled in any events yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {volunteer.enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Event Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {enrollment.event.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <StatusBadge status={enrollment.status} />
                            <span className="text-xs text-gray-500">
                              Enrolled: {formatDate(enrollment.enrolledAt)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Event Cover Image */}
                        {enrollment.event.coverUrl && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              urlEndpoint={config.env.imagekit.urlEndpoint}
                              src={enrollment.event.coverUrl}
                              alt={enrollment.event.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(enrollment.event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{getTimeRange(enrollment.event.startDate, enrollment.event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{enrollment.event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>{enrollment.event.category.join(", ")}</span>
                        </div>
                      </div>

                      {/* Event Description */}
                      {enrollment.event.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {enrollment.event.description}
                        </p>
                      )}

                      {/* Event Capacity */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>Event Capacity</span>
                        <span>
                          {enrollment.event.enrollments.length}
                          {enrollment.event.maxVolunteers && `/${enrollment.event.maxVolunteers}`}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        <Link href={`/admin/events/${enrollment.event.id}/details`}>
                          <Button size="sm" variant="outline" className="w-full">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Event Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Statistics & Actions */}
          <div className="space-y-6">
            {/* Enrollment Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Statistics</h2>
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

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Assign to Event
                </Button>
              </div>
            </div>

            {/* Volunteer Metadata */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Metadata</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Volunteer ID</span>
                  <span className="text-gray-900 font-mono text-xs">{volunteer.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{formatDate(volunteer.createdAt)}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}