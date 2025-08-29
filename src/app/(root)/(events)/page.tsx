import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import ProfileCompletionBanner from "@/components/ProfileCompletionBanner";

// Repeating 10-item mosaic pattern: [Large, Small x8, Large]
const patternClasses = [
    "col-span-4 row-span-4",
    "col-span-2 row-span-2",
    "col-span-2 row-span-2",
    "col-span-2 row-span-2",
    "col-span-2 row-span-2",
    "col-span-2 row-span-2",
    "col-span-2 row-span-2",
];

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: [
            { startDate: "asc" },
            { createdAt: "desc" },
        ],
        include: {
            enrollments: {
                where: { status: "APPROVED" },
                select: { id: true },
            },
        },
    });

    return (
        <div className="w-full md:px-2 md:w-4xl lg:w-6xl mx-auto">
            <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-6">Upcoming Events</h1>

            {/* Mobile List View */}
            <div className="block md:hidden space-y-1.5">
                {events.map((event) => {
                    const start = new Date((event as any).startDate);
                    const diffMs = start.getTime() - Date.now();
                    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

                    return (
                        <Link
                            key={event.id}
                            href={`/${event.id}`}
                            className="relative group block bg-black/2 rounded-lg border overflow-hidden"
                        >
                            <div className="flex">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image
                                        urlEndpoint={config.env.imagekit.urlEndpoint}
                                        src={event.coverUrl || "/events.jpg"}
                                        alt={event.title}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                        priority={false}
                                        quality={80}
                                    />
                                </div>
                                <div className="flex-1 p-3">
                                    <h2 className="font-semibold text-base line-clamp-1 mb-1.5">
                                        {event.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-2">
                                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className="line-clamp-1">{event.location.split(",")[0]}</span>
                                    </div>
                                    <div className="relative top-2 text-right flex items-center justify-between w-full">
                                        <div className="text-xxs text-gray-400">
                                            {(event as any).enrollments?.length ?? 0} / {event.maxVolunteers ?? "-"}
                                        </div>
                                        <div className="text-xxs text-gray-400"> 
                                            {daysRemaining} days left
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Desktop Mosaic Grid View */}
            <div
                className="hidden md:grid grid-cols-3 md:grid-cols-6 auto-rows-[5rem] md:auto-rows-[6rem] gap-1.5 md:gap-3"
            >
                {Array.from({
                    length: Math.max(events.length, 7),
                }).map((_, idx) => {
                    const klass = patternClasses[idx % patternClasses.length];
                    const event = events[idx];
                    if (!event) {
                        return (
                            <div
                                key={`placeholder-${idx}`}
                                className={` opacity-0 relative overflow-hidden rounded-lg border border-dashed bg-gray-50 ${klass} flex items-center justify-center`}
                            >
                                <span className="text-gray-500 text-sm md:text-base">Event coming soon</span>
                            </div>
                        );
                    }
                    // days remaining until start date
                    const start = new Date((event as any).startDate);
                    const diffMs = start.getTime() - Date.now();
                    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                    return (
                        <Link
                            key={event.id}
                            href={`/${event.id}`}
                            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl border bg-white ${klass}`}
                        >
                            <Image
                                urlEndpoint={config.env.imagekit.urlEndpoint}
                                src={event.coverUrl || "/events.jpg"}
                                alt={event.title}
                                fill
                                sizes="(min-width: 1024px) 100vw, 100vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105 object-top"
                                priority={idx < 4}
                                quality={100}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {Array.isArray(event.category) && (
                                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                    <Badge variant="secondary" className="hidden md:flex bg-black/10 backdrop-blur-md text-white border-0 rounded-sm">
                                        <span className="text-xxs md:text-xs">{(event as any).enrollments?.length ?? 0} / {event.maxVolunteers ?? "-"}</span>
                                        <span className="mx-1">|</span>
                                        <span className="text-xxs md:text-xs">{daysRemaining.toString().padStart(2, "0")} days remaining</span>
                                    </Badge>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {event.category.slice(0, 3).map((cat: string) => (
                                            <Badge key={cat} variant="secondary" className="bg-black/10 backdrop-blur-md text-white border-0 rounded-sm">
                                                <span className="text-xxs md:text-xs">{cat}</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2">
                                <h2 className="text-white text-sm md:text-base lg:text-lg font-semibold line-clamp-1">
                                    {event.title}
                                </h2>
                                <p className="text-white/90 text-xs mt-0.5 flex items-center gap-1.5">
                                    <p className="text-xxs md:text-xs">{new Date(event.startDate).toLocaleDateString()}</p>
                                    <span className="hidden md:block">|</span>
                                    <p className="hidden md:block">{event.location.split(",")[0]}</p>
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}