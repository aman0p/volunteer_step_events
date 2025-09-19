"use client";

import EventCard from "@/components/admin/EventCard";
import { Event } from "@/generated/prisma";

interface EventsListProps {
   events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
   return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
         {events
            ?.sort(
               (a: Event, b: Event) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
            )
            .map((event: Event) => (
               <EventCard key={event.id} event={event} />
            ))}
      </div>
   );
}
