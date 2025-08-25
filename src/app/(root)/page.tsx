import EventOverview from "@/components/EventOverview";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import EventList from "@/components/EventList";

export default async function Home() {
  const session = await getServerSession(authOptions);

    const latestEvents = await prisma.event.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            startDate: true,
            endDate: true,
            dressCode: true,
            category: true,
            coverUrl: true,
            eventImages: true,
            maxVolunteers: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return (
        <div className="flex flex-col gap-20 h-full w-full">
            <EventOverview latestEvents={latestEvents} userId={session?.user?.id} />
            <EventList 
                title="Latest Events"
                events={latestEvents.slice(1)}
            />
        </div>
    )
}