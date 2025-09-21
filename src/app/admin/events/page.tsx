import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventsList from "@/components/admin/EventsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function EventsPage() {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   // Check if user has admin or organizer role
   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
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
            <h2 className="text-xl font-bold md:text-2xl lg:text-3xl">
               My Events
            </h2>
            <Button variant="default" asChild>
               <Link
                  href="/admin/events/create"
                  className="flex items-center gap-2"
               >
                  <Plus className="h-4 w-4" />
                  Create a New Event
               </Link>
            </Button>
         </div>

         <div className="mt-5 h-full min-h-screen w-full md:mt-7">
            <EventsList events={events} />
         </div>
      </section>
   );
}
