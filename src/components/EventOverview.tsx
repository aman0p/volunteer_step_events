"use client";

import { Image } from "@imagekit/next";
import { Button } from "./ui/button";
import config from "@/lib/config";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { requestEnrollment } from "@/lib/actions/user/enrollment";
import { toast } from "sonner";
import { useState } from "react";
import { Event } from "@/types";
import { Enrollment } from "@/generated/prisma";
import { useSession } from "next-auth/react";

interface EventOverviewProps {
   latestEvents?: (Event & { enrollments?: Enrollment[] })[];
   userId?: string;
}

export default function EventOverview({
   latestEvents,
   userId,
}: EventOverviewProps) {
   const events = latestEvents || [];
   const [isEnrolling, setIsEnrolling] = useState(false);
   const { data: session, status } = useSession();

   const handleEnroll = async (eventId: string) => {
      if (!userId) return;

      setIsEnrolling(true);
      try {
         const result = await requestEnrollment(eventId);
         if (result.success) {
            toast.success(result.message);
            // Refresh the page to show updated state
            window.location.reload();
         } else {
            toast.error(result.message);
         }
      } catch (error) {
         console.error("Error sending enrollment request:", error);
         toast.error("Failed to send enrollment request");
      } finally {
         setIsEnrolling(false);
      }
   };

   // Helper function to render enrollment button based on user role and status
   const renderEnrollmentButton = () => {
      // Show loading state while session is loading
      if (status === "loading") {
         return (
            <Button
               disabled
               className="flex w-40 cursor-default items-center gap-2 bg-gray-400 px-10 py-5 text-white"
            >
               Loading...
            </Button>
         );
      }

      // Check if user is not authenticated
      if (!session?.user) {
         return (
            <Button className="flex w-40 cursor-pointer items-center gap-2 bg-black px-10 py-5 text-white">
               Sign In to Enroll
            </Button>
         );
      }

      // Check if user is not a volunteer
      if (session.user.role !== "VOLUNTEER") {
         if (session.user.role === "USER") {
            return (
               <Button
                  disabled
                  className="flex w-40 cursor-default items-center gap-2 bg-gray-500 px-10 py-5 text-white"
                  title="Complete your profile and request verification to enroll in events"
               >
                  Apply for Verification
               </Button>
            );
         }

         if (
            session.user.role === "ADMIN" ||
            session.user.role === "ORGANIZER"
         ) {
            return (
               <Button
                  disabled
                  className="flex w-40 cursor-default items-center gap-2 bg-gray-500 px-10 py-5 text-white"
                  title="Admins and Organizers cannot enroll as volunteers"
               >
                  Admin/Organizer
               </Button>
            );
         }

         return (
            <Button
               disabled
               className="flex w-40 cursor-default items-center gap-2 bg-gray-500 px-10 py-5 text-white"
               title="Invalid user role"
            >
               Cannot Enroll
            </Button>
         );
      }

      // User is a volunteer, check enrollment status
      if (events[0]?.enrollments) {
         const userEnrollment = events[0].enrollments.find(
            (e: Enrollment) => e.userId === userId
         );
         const isEnrolled = userEnrollment?.status === "APPROVED";
         const isPending = userEnrollment?.status === "PENDING";
         const isRejected = userEnrollment?.status === "REJECTED";
         const isWaitlisted = userEnrollment?.status === "WAITLISTED";

         if (isEnrolled) {
            return (
               <Button
                  disabled
                  className="flex w-40 cursor-default items-center gap-2 bg-green-600 px-10 py-5 text-white"
               >
                  ✓ Enrolled
               </Button>
            );
         }

         if (isPending) {
            return (
               <Button
                  disabled
                  className="flex w-40 cursor-default items-center gap-2 bg-yellow-600 px-10 py-5 text-white"
               >
                  ⏳ Pending
               </Button>
            );
         }

         if (isRejected) {
            return (
               <Button
                  disabled
                  className="flex w-40 cursor-default items-center gap-2 bg-red-600 px-10 py-5 text-white"
               >
                  ❌ Rejected
               </Button>
            );
         }

         if (isWaitlisted) {
            return (
               <Button
                  disabled
                  className="flex w-40 cursor-default items-center gap-2 bg-blue-600 px-10 py-5 text-white"
               >
                  ⏸️ Waitlisted
               </Button>
            );
         }
      }

      // Show enroll button for volunteers
      return (
         <Button
            onClick={() => handleEnroll(events[0].id)}
            loading={isEnrolling}
            className="flex w-40 cursor-pointer items-center gap-2 bg-black px-10 py-5 text-white hover:bg-gray-800"
         >
            Enroll Now
         </Button>
      );
   };

   return (
      <div className="mx-auto h-full w-6xl space-y-20">
         <div className="flex flex-col gap-1">
            {events.length > 0 && (
               <div className="flex flex-col gap-5 md:gap-8">
                  {/* Event Title */}
                  <div className="flex gap-2">
                     <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        {events[0].title}
                     </h1>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-3 md:text-sm lg:grid-cols-[2fr_1fr_1fr_1.5fr]">
                     <p>
                        Location:&nbsp;
                        <span className="font-bold">{events[0].location}</span>
                     </p>
                     <p>
                        Start Date:&nbsp;
                        <span className="font-bold">
                           {events[0].startDate.toLocaleDateString()}
                        </span>
                     </p>
                     <p>
                        End Date:&nbsp;
                        <span className="font-bold">
                           {events[0].endDate.toLocaleDateString()}
                        </span>
                     </p>
                     <p>
                        Category:&nbsp;
                        <span className="font-bold">
                           {events[0].category.join(", ")}
                        </span>
                     </p>
                     <p>
                        Dress Code:&nbsp;
                        <span className="font-bold">{events[0].dressCode}</span>
                     </p>
                     <p>
                        Max Volunteers:&nbsp;
                        <span className="font-bold">
                           {events[0].maxVolunteers || "Unlimited"}
                        </span>
                     </p>
                  </div>

                  <div className="flex w-fit gap-2">
                     {renderEnrollmentButton()}
                     <Link
                        href={`/events/${events[0].id}`}
                        className="group w-full"
                     >
                        <Button className="flex w-40 cursor-pointer items-center gap-2 bg-black px-10 py-5 text-white">
                           View Details
                           <ArrowRightIcon className="group-hover:pl-0.3 size-4 transition-all duration-300 group-hover:translate-x-1 group-hover:rotate-[-45deg]" />
                        </Button>
                     </Link>
                  </div>

                  {/* Event Image */}
                  <Image
                     urlEndpoint={`${config.env.imagekit.urlEndpoint}`}
                     src={events[0].coverUrl || "/events.jpg"}
                     width={1500}
                     height={1500}
                     alt={events[0].title}
                     className="w-full rounded-lg object-cover md:h-[60vh]"
                     responsive={true}
                     loading="eager"
                  />

                  {/* Event Description */}
                  <p className="line-clamp-3 text-sm md:line-clamp-none md:text-base">
                     {events[0].description}
                  </p>
               </div>
            )}
         </div>

         <div className="flex w-full flex-col gap-5">
            <div className="flex items-center justify-between">
               <h1 className="text-xl font-bold md:text-2xl">
                  Upcoming Events
               </h1>
               <Button className="w-fit cursor-pointer bg-black px-10 py-5 text-white">
                  View All
               </Button>
            </div>
            <div className="flex flex-wrap gap-5">
               {events.slice(1).map((event) => (
                  <div
                     key={event.id}
                     className="flex w-60 cursor-pointer flex-col gap-1 rounded-lg border p-2 backdrop-blur-sm"
                  >
                     <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={event.coverUrl || "/events.jpg"}
                        alt={event.title}
                        width={1500}
                        height={1500}
                        className="h-70 w-full rounded-lg object-cover"
                     />
                     <div className="mt-1 px-1">
                        <h2 className="text-sm font-bold md:text-base">
                           {event.title}
                        </h2>
                        <p className="text-xs">{event.category.join(", ")}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
