import Link from "next/link";
import prisma from "@/lib/prisma";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  const events = await prisma.event.findMany();

  return (
    <section className="w-full rounded-2xl bg-transparent p-4 md:p-7 md:pr-13">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">All Events</h2>
        {/* <Button variant="default" asChild> */}
        <Link href="/admin/events/create" className="text-white bg-black px-3 py-2 md:px-4 md:py-2 rounded-sm md:rounded-lg text-xs md:text-sm">
          + Create a New Event
        </Link>
        {/* </Button> */}
      </div>

      <div className="mt-5 md:mt-7 w-full h-full min-h-screen">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
          {events?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((event) => {

            return (
              <EventCard
                key={event.id}
                event={event}
              />
            )
          })}
        </div>

      </div>
    </section>
  );
}