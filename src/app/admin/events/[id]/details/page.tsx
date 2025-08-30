import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Edit, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { FaWhatsapp } from "react-icons/fa";
import { Video } from "@imagekit/next";
import EventRolesTable from "@/components/admin/tables/EventRolesTable";

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

  // Fetch event with enrollments and event roles
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
      },
      eventRoles: {
        select: {
          id: true,
          name: true,
          description: true,
          payout: true,
          maxCount: true,
          enrollments: {
            where: {
              status: {
                in: ['APPROVED', 'PENDING']
              }
            },
            select: {
              id: true
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



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{event.title}</h1>
      </div>
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-10">
        <div className="w-full h-full space-y-2 md:space-y-5 lg:space-y-10">
          <div className="space-y-2">
            <p className="hidden md:block text-sm ml-1 font-semibold text-black">Cover Image</p>

            {event.coverUrl && (
              <Image
                urlEndpoint={config.env.imagekit.urlEndpoint}
                src={event.coverUrl}
                alt={event.title}
                width={500}
                height={500}
                className="object-cover w-full rounded-2xl aspect-video"
                priority
              />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm ml-1 text-black font-semibold">Description</p>
            <div className="p-5 md:p-7 rounded-xl md:rounded-2xl lg:rounded-3xl bg-black/10">
              <p className="text-sm">{event.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-5">
            {event.eventImages.map((imageUrl, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src={imageUrl}
                  alt={`${event.title} - Image ${index + 1}`}
                  fill
                  className="object-cover aspect-video"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full h-full space-y-10">

          {/* Event Roles */}
          {event.eventRoles && event.eventRoles.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm ml-1 text-black font-semibold">Event Roles</p>
              <EventRolesTable eventRoles={event.eventRoles} />
            </div>
          )}

          {/* Event Details */}
          <div className="space-y-1">
            <p className="text-sm ml-1 text-black font-semibold">Event Details</p>
            <div className="w-full text-sm  grid grid-rows-auto grid-cols-[auto_1fr] h-fit border overflow-hidden rounded-2xl">
              <div className="rounded-tl-2xl border p-2 pl-4 pr-6 bg-black/10 border-black/30">Category</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{event.category}</div>
              <div className="border p-2 pl-4 pr-6 bg-black/10 border-black/30">Location</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{event.location}</div>
              <div className="border p-2 pl-4 pr-6 bg-black/10 border-black/30">Dress Code</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{event.dressCode}</div>
              <div className="border p-2 pl-4 pr-6 bg-black/10 border-black/30">Volunteers Count</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{event.enrollments.length} / {event.maxVolunteers}</div>
              <div className="border p-2 pl-4 pr-6 bg-black/10 border-black/30">Volunteers List</div>
                <div className="border p-2 pl-4 pr-6 border-black/20"><Link href={`/admin/events/${event.id}/enrollments`} className="text-blue-500 text-sm">Event Enrollment Page</Link></div>
              <div className="border p-2 pl-4 pr-6 bg-black/10 border-black/30">Duration</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{getTimeRange(event.startDate, event.endDate)}</div>
              <div className="border p-2 pl-4 pr-6 bg-black/10 border-black/30">Start Date</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{formatDate(event.startDate)}</div>
              <div className="rounded-bl-2xl border p-2 pl-4 pr-6 bg-black/10 border-black/30">End Date</div>
              <div className="border p-2 pl-4 pr-6 border-black/20">{formatDate(event.endDate)}</div>
            </div>
          </div>

          {/* Video Player */}
          <div className="space-y-1">
            <p className="text-sm ml-1 text-black font-semibold">Video</p>
            {event.videoUrl && (
              <div className="aspect-video rounded-lg overflow-hidden">
                <Video
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src={event.videoUrl}
                  width={500}
                  height={500}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-1">
            <p className="text-sm ml-1 text-black font-semibold">Quick Links</p>

            {/* Edit Link */}
            <div className="w-full text-sm grid grid-rows-auto grid-cols-[0.55fr_1fr] h-fit border border-black/30 overflow-hidden rounded-2xl">
              <div className="rounded-tl-2xl border p-2 pl-4 pr-4 bg-black/10 border-r-black/30 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span className="text-sm line-clamp-1">Edit Event</span>
              </div>
              <p className="p-2 mr-4 pl-4 pr-6 border-black/20 line-clamp-1">{event.title}/update</p>
            </div>

            {/* Whatsapp Link */}
            <div className="w-full text-sm grid grid-rows-auto grid-cols-[0.55fr_1fr] h-fit border border-black/30 overflow-hidden rounded-2xl">
              <div className="rounded-tl-2xl border p-2 pl-4 pr-4 bg-black/10 border-r-black/30 flex items-center gap-2">
                <FaWhatsapp className="w-4 h-4" />
                <span className="text-sm line-clamp-1">Whatsapp Link</span>
              </div>
              <p className="p-2 pl-4 pr-6 border-black/20 line-clamp-1">edfrgthgfd</p>
            </div>

            <div className="w-full text-sm grid grid-rows-auto grid-cols-[0.55fr_1fr] h-fit border border-black/30 overflow-hidden rounded-2xl">
              <div className="rounded-tl-2xl border p-2 pl-4 pr-4 bg-black/10 border-r-black/30 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <span className="text-sm line-clamp-1">Instagram</span>
              </div>
              <p className="p-2 pl-4 pr-6 border-black/20 line-clamp-1">edfrgthgfd</p>
            </div>

            {/* Mail Link */}
            <div className="w-full text-sm grid grid-rows-auto grid-cols-[0.55fr_1fr] h-fit border border-black/30 overflow-hidden rounded-2xl">
              <div className="rounded-tl-2xl border p-2 pl-4 pr-4 bg-black/10 border-r-black/30 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm line-clamp-1">Mail Link</span>
              </div>
              <p className="p-2 mr-4 pl-4 pr-6 border-black/20 line-clamp-1">edfrgthgfdefrgergwrgetfhgfwnekfjhbewnkjfvbenkjgbvejbgvjgb</p>
            </div>

            {/* Map Location */}
            <div className="w-full text-sm grid grid-rows-auto grid-cols-[0.55fr_1fr] h-fit border border-black/30 overflow-hidden rounded-2xl">
              <div className="rounded-tl-2xl border p-2 pl-4 pr-4 bg-black/10 border-r-black/30 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm line-clamp-1">Map Location</span>
              </div>
              <p className="p-2 pl-4 pr-6 border-black/20 line-clamp-1">edfrgthgfd</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

