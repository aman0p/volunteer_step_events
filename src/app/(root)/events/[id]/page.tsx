import React from "react";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Tag, Users, Shirt, FileText, CalendarDays, ImageIcon, Video } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import EnrollButton from "@/components/EnrollButton";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getServerSession(authOptions);

  // Fetch data based on id
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          user: true
        }
      }
    }
  });

  if (!event) redirect("/404");

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

  const enrolledVolunteers = event.enrollments.filter((e: any) => e.status === 'APPROVED').length;
  const availableSlots = event.maxVolunteers ? event.maxVolunteers - enrolledVolunteers : 'Unlimited';

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Event Cover Image */}
            <div className="w-full lg:w-1/3">
              {event.coverUrl && event.coverUrl.trim() !== "" ? (
                <div className="w-full h-full relative rounded-lg overflow-hidden">
                  <Image
                    urlEndpoint={config.env.imagekit.urlEndpoint}
                    src={event.coverUrl}
                    alt={event.title}
                    fill
                    className="object-cover border h-full"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-2" />
                    <p>No Cover Image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Basic Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-gray-600 text-sm tracking-wide">{event.description}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="font-semibold text-blue-600">{enrolledVolunteers}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 mx-auto mb-1 text-green-600" />
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="font-semibold text-green-600">{availableSlots}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Tag className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-purple-600">{event.category.join(", ")}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <Shirt className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                  <p className="text-sm text-gray-600">Dress Code</p>
                  <p className="font-semibold text-orange-600">{event.dressCode}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {session?.user?.id ? (
                  <EnrollButton 
                    eventId={id} 
                    isFull={event.maxVolunteers ? enrolledVolunteers >= event.maxVolunteers : false}
                    enrollmentStatus={(() => {
                      const userEnrollment = event.enrollments.find((e: any) => e.userId === session.user.id);
                      return userEnrollment?.status || null;
                    })()}
                  />
                ) : (
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3">
                    Sign In to Enroll
                  </Button>
                )}
                <Button variant="outline" className="flex-1 py-3">
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Images Section */}
        {event.eventImages && event.eventImages.length > 0 && event.eventImages.some(img => img && img.trim() !== "") && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Event Media
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.eventImages.map((imageUrl, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  {imageUrl.endsWith('.mp4') || imageUrl.endsWith('.mov') || imageUrl.endsWith('.avi') ? (
                    <video
                      src={imageUrl}
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src={imageUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      key={index}
                      urlEndpoint={config.env.imagekit.urlEndpoint}
                      src={imageUrl}
                      alt={`Event image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Event Description
              </h2>
              <div className="prose prose-gray max-w-none">
                {event.description.split("\n").map((line, i) => (
                  <p key={i} className="text-gray-700 mb-3">{line}</p>
                ))}
              </div>
            </div>

            {/* Event Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Event Schedule
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Start Date & Time</p>
                    <p className="text-gray-600">{formatDate(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">End Date & Time</p>
                    <p className="text-gray-600">{formatDate(event.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-gray-600">{getTimeRange(event.startDate, event.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
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

            {/* Event Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(event.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Enrollments</span>
                  <span className="font-medium text-gray-900">{event.enrollments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Slots</span>
                  <span className="font-medium text-gray-900">{availableSlots}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Download Event Details
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Calendar
                </Button>
                <Button variant="outline" className="w-full">
                  Report Issue
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Events */}
        <div className="mt-8 text-center">
          <Link href="/events">
            <Button variant="outline" className="px-8 py-3">
              ← Back to All Events
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
