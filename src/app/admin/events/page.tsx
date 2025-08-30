import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventsList from "@/components/admin/EventsList";

export default async function EventsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has admin or organizer role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
    redirect("/");
  }

  const events = await prisma.event.findMany({
    where: { createdById: session.user.id },
  });

  return (
    <section className="w-full rounded-2xl bg-transparent">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">My Events</h2>
        {/* <Button variant="default" asChild> */}
        <Link href="/admin/events/create" className="text-white bg-black px-3 py-2 md:px-4 md:py-2 rounded-sm md:rounded-lg text-xs md:text-sm">
          + Create a New Event
        </Link>
        {/* </Button> */}
      </div>

      <div className="mt-5 md:mt-7 w-full h-full min-h-screen">
        <EventsList events={events} />
      </div>
    </section>
  );
}