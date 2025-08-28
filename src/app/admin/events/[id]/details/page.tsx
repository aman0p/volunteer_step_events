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
  const pendingVolunteers = event.enrollments.filter(e => e.status === 'PENDING');
  const rejectedVolunteers = event.enrollments.filter(e => e.status === 'REJECTED');



    return (
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/events">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600">Event Management Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/events/${(await params).id}`}>
            <Link href={`/admin/events/${event.id}/update`}>
                <Button variant="default" size="icon" className="cursor-pointer hover:bg-black w-fit px-4 py-2">
                    <Pencil className="w-4 h-4 " />
                    Edit Event
                </Button>
            </Link>
            </Link>
            <Button variant="destructive" size="icon" className="cursor-pointer hover:bg-black w-fit px-4 py-2">
                <DeleteEvent eventId={event.id} eventTitle={event.title} />
                Delete Event
            </Button>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Cover Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Cover</h2>
              {event.coverUrl ? (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    urlEndpoint={config.env.imagekit.urlEndpoint}
                    src={event.coverUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>No Cover Image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{getTimeRange(event.startDate, event.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{event.category.join(", ")}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shirt className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Dress Code</p>
                    <p className="font-medium text-gray-900">{event.dressCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
        <div>
                    <p className="text-sm text-gray-500">Max Volunteers</p>
                    <p className="font-medium text-gray-900">
                      {event.maxVolunteers ? event.maxVolunteers : 'Unlimited'}
                    </p>
                  </div>
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
            {/* Volunteer Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Volunteer Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Approved</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{approvedVolunteers.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">{pendingVolunteers.length}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Rejected</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{rejectedVolunteers.length}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Requests</span>
                    <span className="text-lg font-bold text-gray-900">{event.enrollments.length}</span>
                  </div>
                  {event.maxVolunteers && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">Capacity</span>
                      <span className="text-sm text-gray-500">
                        {approvedVolunteers.length}/{event.maxVolunteers}
                      </span>
                    </div>
                  )}
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
      </div>
  );
}