
import { Image } from '@imagekit/next';
import { Button } from "./ui/button";
import { Event } from "@/types";
import config from "@/lib/config";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

interface EventOverviewProps {
    latestEvents?: Event[];
    userId?: string;
}

export default function EventOverview({ latestEvents, userId }: EventOverviewProps) {
    const events = latestEvents || [];

    return (
        <div className="space-y-20 h-full w-full">
            <div className="flex flex-col gap-1">
                {events.length > 0 && (
                    <div className="flex flex-col gap-5 md:gap-8 ">
                        {/* Event Title */}
                        <div className="flex gap-2">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{events[0].title}</h1>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-2 text-xs md:text-sm ">
                            <p>
                                Location:&nbsp;
                                <span className="font-bold">{events[0].location}</span>
                            </p>
                            <p>
                                Start Date:&nbsp;
                                <span className="font-bold">{events[0].startDate.toLocaleDateString()}</span>
                            </p>
                            <p>
                                End Date:&nbsp;
                                <span className="font-bold">{events[0].endDate.toLocaleDateString()}</span>
                            </p>
                            <p>
                                Category:&nbsp;
                                <span className="font-bold">{events[0].category.join(", ")}</span>
                            </p>
                            <p>
                                Dress Code:&nbsp;
                                <span className="font-bold">{events[0].dressCode}</span>
                            </p>
                            <p>Max Volunteers:&nbsp;
                                <span className="font-bold">{events[0].maxVolunteers}</span>
                            </p>
                        </div>

                        <div className="flex gap-2 w-fit">
                            <Button className="w-40 gap-2 flex items-center px-10 py-5 cursor-pointer bg-black text-white">
                                {userId ? "Enroll Now" : "Sign In to Enroll"}
                            </Button>
                            <Link href={`/events/${events[0].id}`} className="w-full group">
                                <Button className="w-40 gap-2 flex items-center px-10 py-5 cursor-pointer bg-black text-white">
                                    View Details
                                    <ArrowRightIcon className="size-4 group-hover:pl-0.3 group-hover:rotate-[-45deg] group-hover:translate-x-1 transition-all duration-300" />
                                </Button>
                            </Link>
                        </div>

                        {/* Event Image */}
                        <Image
                            urlEndpoint={`${config.env.imagekit.urlEndpoint}`}
                            src={events[0].coverUrl || "/events.jpg"}
                            width={1500}
                            height={1500}
                            alt={events[0].title}
                            className="rounded-lg w-full  md:h-[60vh] object-cover"
                            responsive={true}
                            loading="eager"
                        />


                        {/* Event Description */}
                        <p className="text-sm md:text-base line-clamp-3 md:line-clamp-none">{events[0].description}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold">Upcoming Events</h1>
                    <Button className="w-fit px-10 py-5 cursor-pointer bg-black text-white">View All</Button>
                </div>
                <div className="flex gap-5 flex-wrap">
                    {events.slice(1).map((event) => (
                        <div key={event.id} className="flex flex-col gap-1 w-60 border p-2 rounded-lg cursor-pointer backdrop-blur-sm">
                            <Image
                                src={event.coverUrl || "/events.jpg"}
                                alt={event.title}
                                width={1500}
                                height={1500}
                                className="rounded-lg w-full h-70 object-cover"
                            />
                            <div className="mt-1 px-1">
                                <h2 className="text-sm md:text-base font-bold">{event.title}</h2>
                                <p className="text-xs">{event.category.join(", ")}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}