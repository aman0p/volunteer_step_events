import { prisma } from "@/lib/prisma";
import EventCarousel from "@/components/EventCarousel";
import EventCard from "@/components/user/EventCard";
import Section from "@/components/ui/section";

export default async function HomePage() {
   const events = await prisma.event.findMany({
      orderBy: [{ startDate: "asc" }, { createdAt: "desc" }],
      include: {
         enrollments: {
            where: { status: "APPROVED" },
            select: { id: true },
         },
      },
   });

   return (
      <div className="mx-auto w-full space-y-20">
         {/* Event Carousel */}
         <EventCarousel events={events as any} />

         {/* Upcoming Events */}
         <Section>
            <h1 className="mb-2 text-xl font-bold uppercase md:mb-6 md:text-3xl lg:text-4xl">
               Upcoming Events
            </h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
               {events.map((event) => (
                  <EventCard key={event.id} event={event as any} />
               ))}
            </div>
         </Section>
      </div>
   );
}
