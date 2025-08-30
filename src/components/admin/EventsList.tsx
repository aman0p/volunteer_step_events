"use client";

import EventCard from "@/components/EventCard";

interface EventsListProps {
  events: any[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
      {events?.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((event: any) => (
        <EventCard
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
}
