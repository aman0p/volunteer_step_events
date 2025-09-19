import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MapPin, Edit, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';
import { Image } from '@imagekit/next';
import config from '@/lib/config';
import { FaWhatsapp } from 'react-icons/fa';
import { Video } from '@imagekit/next';
import EventRolesTable from '@/components/admin/tables/EventRolesTable';
import { CopyButton } from '@/components/ui';

export default async function EventDetailsPage({
   params,
}: {
   params: { id: string };
}) {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect('/sign-in');
   }

   // Check if user has admin role
   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
   });

   if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZER')) {
      redirect('/');
   }

   // Fetch event with enrollments, event roles, and quick links
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
                     profileImage: true,
                  },
               },
            },
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
                        in: ['APPROVED', 'PENDING'],
                     },
                  },
                  select: {
                     id: true,
                  },
               },
            },
         },
         quickLinks: {
            select: {
               id: true,
               title: true,
               url: true,
               isActive: true,
            },
         },
      },
   });

   if (!event) {
      redirect('/admin/events');
   }

   // Owner guard: only creator can view
   const owner = await prisma.event.findUnique({
      where: { id: event.id },
      select: { createdById: true },
   });
   if (!owner || owner.createdById !== session.user.id) {
      redirect('/admin/events');
   }

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      }).format(date);
   };

   const getTimeRange = (startDate: Date, endDate: Date) => {
      const start = new Intl.DateTimeFormat('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      }).format(startDate);

      const end = new Intl.DateTimeFormat('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      }).format(endDate);

      return `${start} - ${end}`;
   };

   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
         </div>
         <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-[1.5fr_1fr]">
            <div className="h-full w-full space-y-2 md:space-y-5 lg:space-y-10">
               <div className="space-y-2">
                  <p className="ml-1 hidden text-sm font-semibold text-black md:block">
                     Cover Image
                  </p>

                  {event.coverUrl && (
                     <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={event.coverUrl}
                        alt={event.title}
                        width={500}
                        height={500}
                        className="aspect-video w-full rounded-2xl object-cover"
                        priority
                     />
                  )}
               </div>

               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">
                     Description
                  </p>
                  <div className="rounded-xl bg-black/10 p-5 md:rounded-2xl md:p-7 lg:rounded-3xl">
                     <p className="text-sm">{event.description}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-2 md:gap-5">
                  {event.eventImages.map((imageUrl, index) => (
                     <div
                        key={index}
                        className="relative aspect-video overflow-hidden rounded-lg"
                     >
                        <Image
                           urlEndpoint={config.env.imagekit.urlEndpoint}
                           src={imageUrl}
                           alt={`${event.title} - Image ${index + 1}`}
                           fill
                           className="aspect-video object-cover"
                        />
                     </div>
                  ))}
               </div>
            </div>
            <div className="h-full w-full space-y-10">
               {/* Event Roles */}
               {event.eventRoles && event.eventRoles.length > 0 && (
                  <div className="space-y-1">
                     <p className="ml-1 text-sm font-semibold text-black">
                        Event Roles
                     </p>
                     <EventRolesTable eventRoles={event.eventRoles} />
                  </div>
               )}

               {/* Event Details */}
               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">
                     Event Details
                  </p>
                  <div className="grid-rows-auto grid h-fit w-full grid-cols-[auto_1fr] overflow-hidden rounded-2xl border text-sm">
                     <div className="rounded-tl-2xl border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Category
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {event.category}
                     </div>
                     <div className="border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Location
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {event.location}
                     </div>
                     <div className="border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Dress Code
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {event.dressCode}
                     </div>
                     <div className="border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Volunteers Count
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {event.enrollments.length} / {event.maxVolunteers}
                     </div>
                     <div className="border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Volunteers List
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        <Link
                           href={`/admin/events/${event.id}/enrollments`}
                           className="text-sm text-blue-500"
                        >
                           Event Enrollment Page
                        </Link>
                     </div>
                     <div className="border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Duration
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {getTimeRange(event.startDate, event.endDate)}
                     </div>
                     <div className="border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        Start Date
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {formatDate(event.startDate)}
                     </div>
                     <div className="rounded-bl-2xl border border-black/30 bg-black/10 p-2 pr-6 pl-4">
                        End Date
                     </div>
                     <div className="border border-black/20 p-2 pr-6 pl-4">
                        {formatDate(event.endDate)}
                     </div>
                  </div>
               </div>

               {/* Video Player */}
               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">Video</p>
                  {event.videoUrl && (
                     <div className="aspect-video overflow-hidden rounded-lg">
                        <Video
                           urlEndpoint={config.env.imagekit.urlEndpoint}
                           src={event.videoUrl}
                           width={500}
                           height={500}
                           controls
                           className="h-full w-full object-cover"
                        />
                     </div>
                  )}
               </div>

               {/* Quick Links */}
               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">
                     Quick Links
                  </p>

                  {/* Dynamic Quick Links from Database */}
                  {event.quickLinks && event.quickLinks.length > 0 ? (
                     event.quickLinks.map((link) => (
                        <div
                           key={link.id}
                           className="grid-rows-auto grid h-fit w-full grid-cols-[auto_1fr_auto] overflow-hidden rounded-2xl border border-black/30 text-sm"
                        >
                           <div className="flex items-center gap-2 rounded-tl-2xl border border-r-black/30 bg-black/10 p-2 pr-4 pl-4">
                              <CopyButton
                                 text={link.url}
                                 size="sm"
                                 variant="ghost"
                                 className="mr-1"
                              />
                              <span className="line-clamp-1 text-sm">
                                 {link.title}
                              </span>
                              {!link.isActive && (
                                 <span className="text-xs text-gray-500">
                                    (Inactive)
                                 </span>
                              )}
                           </div>
                           <Link
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="line-clamp-1 flex items-center truncate border-black/20 p-2 pr-6 pl-4 transition-colors hover:bg-gray-50"
                           >
                              <span className="truncate overflow-hidden">
                                 {link.url}
                              </span>
                           </Link>
                        </div>
                     ))
                  ) : (
                     <div className="rounded-lg border-2 border-dashed border-gray-300 py-4 text-center text-sm text-gray-500">
                        <p>No quick links defined yet</p>
                        <p className="text-xs">
                           Add quick links when editing the event
                        </p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
