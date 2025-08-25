import { Event } from "@/types";
import { Button } from "./ui/button";
import Image from "next/image";

interface EventListProps {
    events?: Event[];
    title: string;
}

export default function EventList({ events, title }: EventListProps) {
    return (
        <div className="flex flex-col gap-5 w-full">
        <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
            <Button className="w-fit px-10 py-5 cursor-pointer bg-black text-white">View All</Button>
        </div>
        <div className="flex gap-5 flex-wrap">
            {events?.map((event) => (
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
    )
}