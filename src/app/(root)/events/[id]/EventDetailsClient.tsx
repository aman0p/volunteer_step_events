"use client";

import { useState } from "react";
import { Image, Video } from "@imagekit/next";
import ExpandableText from "@/components/ExpandableText";
import Section from "@/components/ui/section";
import { Badge } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import EventRolesTable from "@/components/admin/tables/EventRolesTable";
import { Separator } from "@/components/ui/separator";
import QuickLinks from "@/components/QuickLinks";
import EnrollButton from "@/components/EnrollButton";
import config from "@/lib/config";

interface EventRole {
   id: string;
   name: string;
   description: string;
   payout: number;
   maxCount: number;
   enrollments: { id: string }[];
}

interface QuickLink {
   id: string;
   title: string;
   url: string;
   isActive: boolean;
}

interface Event {
   id: string;
   title: string;
   description: string | null;
   location: string;
   startDate: Date;
   endDate: Date;
   category: string[];
   coverUrl: string | null;
   videoUrl: string | null;
   eventImages: string[];
   maxVolunteers: number | null;
   createdById: string;
   eventRoles: EventRole[];
   quickLinks: QuickLink[];
}

interface EventDetailsClientProps {
   event: Event;
   approvedCount: number;
   enrollmentStatus:
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
      | "CANCELLED"
      | "WAITLISTED"
      | null;
   cancellationCount: number;
   isEnrolled: boolean;
   isEventCreator: boolean;
}

export default function EventDetailsClient({
   event,
   approvedCount,
   enrollmentStatus,
   cancellationCount,
   isEnrolled,
   isEventCreator,
}: EventDetailsClientProps) {
   const [selectedRoleId, setSelectedRoleId] = useState<string>("");

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
         weekday: "long",
         year: "numeric",
         month: "long",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(date);
   };

   const isFull = !!event.maxVolunteers && approvedCount >= event.maxVolunteers;
   const hasRoles = event.eventRoles && event.eventRoles.length > 0;

   const handleRoleSelect = (roleId: string) => {
      setSelectedRoleId(roleId);
   };

   return (
      <div className="h-full w-full space-y-0">
         {/* Event Cover and Details */}
         <Section className="grid h-full w-full grid-cols-1 gap-0 px-3 py-1.5 md:gap-5 md:p-3 lg:max-h-full lg:max-w-full lg:grid-cols-[2fr_1.4fr] lg:pb-0">
            <div className="relative z-10 mt-4 w-full overflow-hidden rounded-t-xl md:mt-0 md:rounded-2xl lg:rounded-3xl">
               <Image
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src={event.coverUrl || "/events.jpg"}
                  alt={event.title}
                  width={1500}
                  height={1500}
                  className="h-[25vh] w-full bg-black/10 object-cover object-center md:h-[30vh] lg:h-full"
               />
            </div>

            <div className="h-full w-full space-y-10 rounded-b-xl bg-white/10 px-3 py-5 backdrop-blur-xl md:rounded-2xl md:p-5 lg:rounded-3xl">
               {/* event details */}
               <div className="flex h-full w-full flex-col justify-between gap-3 space-y-2 md:gap-5 lg:gap-10">
                  <div className="space-y-5">
                     <div className="flex items-center gap-2">
                        {event.category.map((category) => (
                           <Badge
                              key={category}
                              variant="secondary"
                              className="bg-background/20 text-foreground border-0 backdrop-blur-md"
                           >
                              <span className="text-xxs md:text-xs">
                                 {category}
                              </span>
                           </Badge>
                        ))}
                     </div>
                     <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        {event.title}
                     </h1>
                     <ExpandableText
                        text={event.description ?? ""}
                        clampLines={3}
                        className="mt-5"
                     />
                  </div>

                  <div className="space-y-2">
                     <Card className="bg-foreground/80 text-background w-full gap-3 rounded-xl border-0 py-3 lg:rounded-2xl">
                        <CardContent className="flex items-center justify-start gap-2 px-5 md:gap-5">
                           <Calendar className="mb-0.5 size-3.5 md:size-4" />
                           <p className="text-xs font-medium tracking-wide md:text-sm md:font-semibold">
                              {formatDate(event.startDate)}
                           </p>
                        </CardContent>
                        <Separator />
                        <CardContent className="flex items-center justify-start gap-2 px-5 md:gap-5">
                           <MapPin className="mb-0.5 size-3.5 md:size-4" />
                           <p className="line-clamp-1 text-xs font-medium tracking-wide md:text-sm md:font-semibold">
                              {event.location}
                           </p>
                        </CardContent>
                     </Card>

                     <EnrollButton
                        eventId={event.id}
                        isFull={isFull}
                        enrollmentStatus={enrollmentStatus}
                        cancellationCount={cancellationCount}
                        className="w-full rounded-lg"
                        selectedRoleId={selectedRoleId}
                        // onRoleSelect={handleRoleSelect}
                        hasRoles={hasRoles}
                     />
                  </div>
               </div>
            </div>
         </Section>

         {/* Event Roles and Quick Links */}
         <Section className="grid h-full w-full grid-cols-1 gap-3 px-3 py-1.5 md:gap-5 md:p-3 lg:max-w-full lg:grid-cols-[2fr_1.4fr] lg:pb-5">
            <div className="shadow-foreground/20 h-full w-full space-y-15 rounded-xl bg-white/10 px-3 py-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-xl md:rounded-2xl md:p-5 lg:rounded-3xl">
               {event.eventRoles && event.eventRoles.length > 0 && (
                  <div className="space-y-5">
                     <h2 className="text-xl font-bold md:text-2xl">
                        Event Roles
                     </h2>
                     <EventRolesTable
                        eventRoles={event.eventRoles ?? []}
                        selectedRoleId={selectedRoleId}
                        onRoleSelect={handleRoleSelect}
                        showSelection={true}
                     />
                  </div>
               )}
            </div>

            <QuickLinks
               quickLinks={event.quickLinks ?? []}
               isEnrolled={isEnrolled}
               isEventCreator={isEventCreator}
            />
         </Section>

         {/* Enrollment Details & */}
         <Section className="grid h-full w-full grid-cols-1 gap-3 px-3 py-1.5 md:gap-5 md:p-3 lg:max-w-full lg:grid-cols-[2fr_1.4fr] lg:px-10 lg:py-5">
            <div className="order-2 h-full w-full overflow-hidden rounded-xl md:order-1 md:rounded-2xl lg:rounded-3xl">
               {event.eventImages && event.eventImages.length > 0 && (
                  <div className="grid w-full grid-cols-2 gap-2 md:gap-5 lg:grid-cols-3">
                     {event.eventImages &&
                        event.eventImages.map((img, index) => (
                           <Image
                              key={index}
                              urlEndpoint={config.env.imagekit.urlEndpoint}
                              src={img}
                              alt="event image"
                              width={1000}
                              height={1000}
                              className="z-10 aspect-square w-full rounded-xl object-cover object-top md:aspect-video md:rounded-2xl lg:rounded-3xl"
                           />
                        ))}
                  </div>
               )}
            </div>

            {/* video */}
            {event.videoUrl && (
               <div className="shadow-foreground/20 z-10 order-1 aspect-video h-fit w-full rounded-xl bg-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-xl md:order-2 md:rounded-2xl lg:rounded-3xl">
                  <Video
                     src={event.videoUrl}
                     urlEndpoint={config.env.imagekit.urlEndpoint}
                     alt="event video"
                     controls
                     preload="none"
                     className="aspect-video h-full w-full overflow-hidden rounded-xl object-cover md:rounded-2xl lg:rounded-3xl"
                     poster={event.coverUrl ?? undefined}
                  />
               </div>
            )}
         </Section>
      </div>
   );
}
