import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import EventDetailsClient from "./EventDetailsClient";

export default async function EventDetailsPage({
   params,
}: {
   params: { id: string };
}) {
   const id = (await params).id;
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   const [event, approvedCount] = await Promise.all([
      prisma.event.findUnique({
         where: { id },
         include: {
            enrollments: {
               where: { userId: session.user.id },
               select: { status: true },
               take: 1,
            },
            eventRoles: {
               include: {
                  enrollments: {
                     select: { id: true },
                  },
               },
            },
            quickLinks: true,
         },
      }),
      prisma.enrollment.count({
         where: { eventId: id, status: "APPROVED" },
      }),
   ]);

   if (!event) {
      notFound();
   }

   const enrollmentStatus = event.enrollments[0]?.status ?? null;
   const isEnrolled = enrollmentStatus === "APPROVED";
   const isEventCreator = event.createdById === session.user.id;

   return (
      <EventDetailsClient
         event={event}
         approvedCount={approvedCount}
         enrollmentStatus={enrollmentStatus}
         isEnrolled={isEnrolled}
         isEventCreator={isEventCreator}
      />
   );
}
