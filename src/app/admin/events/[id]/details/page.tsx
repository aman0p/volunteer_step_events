import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { Video } from "@imagekit/next";
import EventRolesTable from "@/components/admin/tables/EventRolesTable";
import EventDetailsTable from "@/components/admin/tables/EventDetailsTable";
import QuickLinksTable from "@/components/admin/tables/QuickLinksTable";
// Import enrolled volunteers table
import EnrolledVolunteersTable from "@/components/admin/tables/EnrolledVolunteersTable";

export default async function EventDetailsPage({
   params,
}: {
   params: { id: string };
}) {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   // Check if user has admin role
   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
   });

   if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
      redirect("/");
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
               eventRole: {
                  select: {
                     id: true,
                     name: true,
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
                        in: ["APPROVED", "PENDING"],
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
      redirect("/admin/events");
   }

   // Owner guard: only creator can view
   const owner = await prisma.event.findUnique({
      where: { id: event.id },
      select: { createdById: true },
   });
   if (!owner || owner.createdById !== session.user.id) {
      redirect("/admin/events");
   }

   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
         </div>
         <div className="grid h-full w-full grid-cols-1 gap-10 md:grid-cols-[auto_1fr]">
            <div className="h-full w-md space-y-2 md:space-y-10">
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

               {/* Description */}
               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">
                     Description
                  </p>
                  <div className="rounded-xl bg-black/10 p-5">
                     <p className="text-sm">{event.description}</p>
                  </div>
               </div>

               {/* Event Details */}
               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">
                     Event Details
                  </p>
                  {/* Event details table */}
                  <EventDetailsTable event={event} />
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

               {/* Enrolled Volunteers */}
               {event.enrollments && event.enrollments.length > 0 && (
                  <div className="space-y-1">
                     <p className="ml-1 text-sm font-semibold text-black">
                        Enrolled Volunteers (
                        {
                           event.enrollments.filter(
                              (enrollment) => enrollment.status === "APPROVED"
                           ).length
                        }{" "}
                        / {event.maxVolunteers || "No limit"})
                     </p>
                     <EnrolledVolunteersTable
                        enrolledVolunteers={event.enrollments.filter(
                           (enrollment) => enrollment.status === "APPROVED"
                        )}
                     />
                  </div>
               )}

               {/* Event Images */}
               <div className="grid grid-cols-4 gap-2 md:gap-5">
                  {event.eventImages.map((imageUrl, index) => (
                     <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg"
                     >
                        <Image
                           urlEndpoint={config.env.imagekit.urlEndpoint}
                           src={imageUrl}
                           alt={`${event.title} - Image ${index + 1}`}
                           fill
                           className="aspect-square object-cover"
                        />
                     </div>
                  ))}
               </div>

               {/* Quick Links */}
               <div className="space-y-1">
                  <p className="ml-1 text-sm font-semibold text-black">
                     Quick Links
                  </p>
                  <QuickLinksTable quickLinks={event.quickLinks} />
               </div>
            </div>
         </div>
      </div>
   );
}
