import { SAMPLE_EVENTS } from "@/constants";
import Image from "next/image";
import { Button } from "./ui/button";

export default function EventOverview() {
    return (
        <div className="space-y-20 h-full w-full">
            <div className="flex flex-col gap-2">
                {SAMPLE_EVENTS.length > 0 && (
                    <div className="flex flex-col gap-5 md:gap-8 ">

                        {/* Event Title */}
                        <h1 className="text-2xl md:text-3xl font-bold">{SAMPLE_EVENTS[0].title}</h1>

                        {/* Event Details */}
                        <div className="text-xs md:text-sm flex flex-col md:flex-row space-y-1 md:space-y-2 md:space-x-12 w-fit flex-wrap max-w-3xl">
                            <p>
                                Location:&nbsp;
                                <span className="font-bold">{SAMPLE_EVENTS[0].location}</span>
                            </p>
                            <p>
                                Start Date:&nbsp;
                                <span className="font-bold">{new Date(SAMPLE_EVENTS[0].startDate).toLocaleDateString()}</span>
                            </p>
                            <p>
                                End Date:&nbsp;
                                <span className="font-bold">{new Date(SAMPLE_EVENTS[0].endDate).toLocaleDateString()}</span>
                            </p>
                            <p>
                                Category:&nbsp;
                                <span className="font-bold">{SAMPLE_EVENTS[0].category}</span>
                            </p>
                            <p>Max Volunteers:&nbsp;
                                <span className="font-bold">{SAMPLE_EVENTS[0].maxVolunteers}</span>
                            </p>
                            <p>
                                Dress Code:&nbsp;
                                <span className="font-bold">{SAMPLE_EVENTS[0].dressCode}</span>
                            </p>
                        </div>

                        <Button className="w-fit px-10 py-5 cursor-pointer bg-black text-white">Enroll Now</Button>

                        {/* Event Image */}
                        <Image
                            src={SAMPLE_EVENTS[0].image || "/events.jpg"}
                            alt={SAMPLE_EVENTS[0].title}
                            width={1500}
                            height={1500}
                            className="rounded-lg w-full  md:h-[60vh] object-cover"
                        />

                        {/* Event Description */}
                        <p className="text-sm md:text-base">{SAMPLE_EVENTS[0].description}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold">Upcoming Events</h1>
                    <Button className="w-fit px-10 py-5 cursor-pointer bg-black text-white">View All</Button>
                </div>
                <div className="flex gap-5 flex-wrap">
                    {SAMPLE_EVENTS.slice(1).map((event) => (
                        <div key={event.id} className="flex flex-col gap-1 w-60 border p-2 rounded-lg cursor-pointer backdrop-blur-sm">
                            <Image
                                src={event.image || "/events.jpg"}
                                alt={event.title}
                                width={1500}
                                height={1500}
                                className="rounded-lg w-full h-70 object-cover"
                            />
                            <div className="mt-1 px-1">
                                <h2 className="text-sm md:text-base font-bold">{event.title}</h2>
                                <p className="text-xs">{event.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}