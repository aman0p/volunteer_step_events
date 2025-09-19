import { Event } from "@/types";
import { Button } from "./ui/button";
import Image from "next/image";

interface EventListProps {
   events?: Event[];
   title: string;
}

export default function EventList({ events, title }: EventListProps) {
   return (
      <div className="flex w-full flex-col gap-5">
         <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
            <Button className="w-fit cursor-pointer bg-black px-10 py-5 text-white">
               View All
            </Button>
         </div>
         <div className="flex flex-wrap gap-5">
            {events?.map((event) => (
               <div
                  key={event.id}
                  className="flex w-60 cursor-pointer flex-col gap-1 rounded-lg border p-2 backdrop-blur-sm"
               >
                  <Image
                     src={event.coverUrl || "/events.jpg"}
                     alt={event.title}
                     width={1500}
                     height={1500}
                     className="h-70 w-full rounded-lg object-cover"
                  />
                  <div className="mt-1 px-1">
                     <h2 className="text-sm font-bold md:text-base">
                        {event.title}
                     </h2>
                     <p className="text-xs">{event.category.join(", ")}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
