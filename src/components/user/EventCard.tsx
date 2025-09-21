import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { MapPin } from "lucide-react";

interface EventCardProps {
   event: {
      id: string;
      title: string;
      coverUrl: string | null;
      startDate: Date;
      location: string;
      category: string[];
      maxVolunteers: number | null;
      enrollments?: { id: string }[];
   };
}

export default function EventCard({ event }: EventCardProps) {
   const start = new Date(event.startDate);
   const diffMs = start.getTime() - Date.now();
   const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

   return (
      <Link
         href={`/events/${event.id}`}
         className="group bg-muted-foreground/5 shadow-background/50 relative overflow-hidden rounded-xl shadow-sm backdrop-blur-xl duration-300 hover:shadow-xl md:rounded-2xl lg:rounded-3xl"
      >
         <div className="relative h-[12rem] w-full md:h-[18rem] lg:h-[30rem]">
            <Image
               urlEndpoint={config.env.imagekit.urlEndpoint}
               src={event.coverUrl || "/events.jpg"}
               alt={event.title}
               height={900}
               width={900}
               className="h-full w-full bg-black/10 object-cover object-center"
               quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Event Info Overlay */}
            <div className="absolute top-0 right-1 md:top-4 md:right-4">
               <Badge
                  variant="secondary"
                  className="bg-background/20 text-background border-0 backdrop-blur-md"
               >
                  <span className="text-xs font-light">
                     {event.enrollments?.length ?? 0} /{" "}
                     {event.maxVolunteers ?? "-"} volunteers
                  </span>
               </Badge>
            </div>

            <div className="bg-foreground/50 absolute bottom-0 flex w-full flex-col px-2.5 py-1.5 md:px-5 md:py-3 gap-1">
               <h2 className="text-background order-2 mb-1 line-clamp-1 text-xs md:order-1 md:line-clamp-2 md:text-sm">
                  {event.title}
               </h2>
               <div className="text-background/90 order-1 flex flex-col justify-between text-xs font-light md:order-2 md:flex-row md:items-center">
                  <span className="hidden md:block">
                     {new Date(event.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                     })}
                  </span>
                  <span>{daysRemaining} days left</span>
               </div>
            </div>
         </div>

         {/* Card Content */}
         <div className="bg-transparent p-2 backdrop-blur-2xl md:p-5">
            <div className="text-foreground flex items-center gap-1 text-xs font-bold md:mb-2 md:text-sm">
               <MapPin className="size-3.5 md:size-4" />
               <span className="line-clamp-1">
                  {event.location.split(",")[0]}
               </span>
            </div>
            {Array.isArray(event.category) && (
               <div className="hidden flex-wrap gap-1 md:flex md:gap-2">
                  {event.category.slice(0, 2).map((cat: string) => (
                     <Badge
                        key={cat}
                        variant="secondary"
                        className="from-foreground/30 via-background/30 to-foreground/30 rounded-sm border-none bg-gradient-to-tr px-2 py-1 backdrop-blur-md"
                     >
                        <span className="text-xxs md:text-xs">{cat}</span>
                     </Badge>
                  ))}
               </div>
            )}
         </div>
      </Link>
   );
}
