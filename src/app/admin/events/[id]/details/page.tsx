import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, Users, Shirt, FileText, ImageIcon, Video, ArrowLeft, Edit, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { DeleteEvent } from "@/components/admin/forms/DeleteEvent";
import { VolunteerPieChart } from "@/components/ui/volunteer-pie-chart";

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
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
              skills: true,
              profileImage: true
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

  const approvedVolunteers = event.enrollments.filter(e => e.status === 'APPROVED');
  const waitlistedVolunteers = event.enrollments.filter(e => e.status === 'WAITLISTED');
  const pendingVolunteers = event.enrollments.filter(e => e.status === 'PENDING');
  const rejectedVolunteers = event.enrollments.filter(e => e.status === 'REJECTED');



  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
        <p className="text-sm text-muted-foreground">
          {event.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {event.coverUrl && <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              urlEndpoint={config.env.imagekit.urlEndpoint}
              src={event.coverUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          }
        </div>

        {/* Event Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-sm">
              <p className="text-gray-500">Location:&nbsp;</p>
              <p className="text-gray-900 font-semibold">{event.location}</p>
            </div>

            <div className="flex items-center text-sm">
              <p className="text-gray-500">Date:&nbsp;</p>
              <p className="text-gray-900 font-semibold">{formatDate(event.startDate)}</p>
            </div>


            <div className="flex items-center text-sm">
              <p className="text-gray-500">Time:&nbsp;</p>
              <p className="text-gray-900 font-semibold">{getTimeRange(event.startDate, event.endDate)}</p>

            </div>

            <div className="flex items-center text-sm">
              <p className="text-gray-500">Category:&nbsp;</p>
              <p className="text-gray-900 font-semibold">{event.category.join(", ")}</p>

            </div>

            <div className="flex items-center text-sm">
              <p className="text-gray-500">Dress Code:&nbsp;</p>
              <p className="text-gray-900 font-semibold">{event.dressCode}</p>

            </div>

            <div className="flex items-center text-sm">
              <p className="text-gray-500">Max Volunteers:&nbsp;</p>
              <p className="text-gray-900 font-semibold">
                {event.maxVolunteers ? event.maxVolunteers : 'Unlimited'}
              </p>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>

        {/* Event Images */}
        {event.eventImages && event.eventImages.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.eventImages.map((imageUrl, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image
                    urlEndpoint={config.env.imagekit.urlEndpoint}
                    src={imageUrl}
                    alt={`${event.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video URL */}
        {event.videoUrl && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Video</h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <video
                src={event.videoUrl}
                controls
                className="w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Statistics & Actions */}
      <div className="space-y-6">
        {/* Volunteer Statistics Pie Chart */}
        <VolunteerPieChart
          approvedCount={approvedVolunteers.length}
          waitlistedCount={waitlistedVolunteers.length}
          pendingCount={pendingVolunteers.length}
          rejectedCount={rejectedVolunteers.length}
        />

        {/* Capacity Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Capacity Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Requests</span>
              <span className="text-lg font-bold text-gray-900">{event.enrollments.length}</span>
            </div>
            {event.maxVolunteers && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Capacity</span>
                <span className="text-sm font-medium text-gray-900">
                  {approvedVolunteers.length}/{event.maxVolunteers}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Available Spots</span>
                <span className={`text-sm font-medium ${event.maxVolunteers && approvedVolunteers.length >= event.maxVolunteers ? 'text-red-600' : 'text-green-600'}`}>
                  {event.maxVolunteers ? Math.max(0, event.maxVolunteers - approvedVolunteers.length) : 'Unlimited'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href={`/admin/events/${(await params).id}/details/registered-volunteer`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Users className="w-4 h-4 mr-2" />
                View All Volunteers
              </Button>
            </Link>

            <Link href={`/admin/enrollments`}>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Manage Enrollments
              </Button>
            </Link>

            <Button variant="outline" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Event Metadata */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Metadata</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-900">{formatDate(event.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated</span>
              <span className="text-gray-900">{formatDate(event.updatedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Event ID</span>
              <span className="text-gray-900 font-mono text-xs">{event.id}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}