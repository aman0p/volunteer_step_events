import { prisma } from "@/lib/prisma";
import EventCarousel from "@/components/EventCarousel";
import EventCard from "@/components/user/EventCard";
import Section from "@/components/ui/section";
import { EventWithEnrollments } from "@/types";
export default async function HomePage() {
   const events: EventWithEnrollments[] = await prisma.event.findMany({
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: {
         enrollments: {
            where: { status: "APPROVED" },
            select: { id: true },
         },
      },
      take: 20, // Limit to 20 events for better performance
   });

   return (
      <div className="mx-auto w-full space-y-20">
         {/* Event Carousel */}
         <EventCarousel events={events} />

         {/* Upcoming Events */}
         <Section>
            <h1 className="mb-2 text-xl font-bold uppercase md:mb-6 md:text-3xl lg:text-4xl">
               Upcoming Events
            </h1>
            <div className="grid gap-4 grid-cols-2 md:gap-10 md:grid-cols-3">
               {events.map((event) => (
                  <EventCard key={event.id} event={event} />
               ))}
            </div>
         </Section>
      </div>
   );
}
