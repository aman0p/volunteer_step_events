import { Button } from "./ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import config from "@/lib/config";
import { Image } from "@imagekit/next";
import { DeleteEvent } from "@/components/admin/forms/DeleteEvent";

export default async function EventCard({event}: {event: any}) {
    return (
        <div
        key={event.id}
        className={"border flex bg-black/10 flex-col h-full gap-1 p-1 md:p-2 border-black/10 rounded-lg cursor-pointer backdrop-blur-sm"}
      >
        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <DeleteEvent eventId={event.id} eventTitle={event.title} />
            <Link href={`/admin/events/${event.id}/update`}>
                <Button variant="default" size="icon" className="cursor-pointer hover:bg-black">
                    <Pencil className="w-4 h-4 " />
                </Button>
            </Link>
        </div>
        <Link
        href={`/admin/events/${event.id}/details`} className="md:w-full md:h-full rounded-sm md:rounded-lg h-full">
          <Image
            urlEndpoint={config.env.imagekit.urlEndpoint}
            src={event.coverUrl}
            alt={event.title}
            width={800}
            height={800}
            transformation={[
              {
                width: 400,
                height: 450,
                quality: 100,
              },
            ]}
            className="aspect-square md:aspect-auto object-cover md:w-full md:h-full rounded-sm md:rounded-lg"
            loading="lazy"
          />
        </Link>
        <div className="flex flex-col gap-0.5 p-0.5 pl-1 justify-between h-full w-full md:w-auto">
          <h1 className="text-xs md:text-base font-bold mt-0.5 capitalize line-clamp-1">{event.title}</h1>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <p className="text-xxs md:text-xs text-gray-500 capitalize line-clamp-1">{event.category.join(", ")}</p>
            <p className="text-xxs md:text-xs text-gray-500 line-clamp-1">{new Date(event.startDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    )
}