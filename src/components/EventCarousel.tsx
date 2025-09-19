"use client";

import { useState, useEffect } from "react";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { getBackgroundImageUrl } from "@/lib/utils";
import Link from "next/link";
import {
   Carousel,
   CarouselApi,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "./ui/carousel";
import { ActionButton2 } from "./ui/action-button";
import { Badge } from "./ui/badge";
import { EventWithEnrollments } from "@/types";

interface EventCarouselProps {
   events: EventWithEnrollments[];
}

export default function EventCarousel({ events }: EventCarouselProps) {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [api, setApi] = useState<CarouselApi | null>(null);

   // Limit to top 5 events
   const topEvents = events.slice(0, 5);

   useEffect(() => {
      if (!api) return;

      const onSelect = () => {
         setCurrentIndex(api.selectedScrollSnap());
      };

      api.on("select", onSelect);
      onSelect(); // Set initial state

      return () => {
         api.off("select", onSelect);
      };
   }, [api]);

   if (topEvents.length === 0) {
      return (
         <div className="flex h-[80vh] w-full items-center justify-center">
            <p className="text-foreground text-xl">No events available</p>
         </div>
      );
   }

   return (
      <div
         className={`relative w-full overflow-hidden bg-black/5 backdrop-blur-xl`}
      >
         {/* Dynamic dark-mode background reflecting current card image */}
         <div className="absolute inset-0 hidden dark:block" aria-hidden>
            <div
               className="absolute inset-0 bg-gradient-to-b bg-cover bg-center opacity-20"
               style={{
                  backgroundImage: `url('${getBackgroundImageUrl(topEvents[currentIndex]?.coverUrl || "/events.jpg")}')`,
               }}
            />
            {/* Optional subtle vignette for readability */}
            <div className="from-background/80 to-background/5 absolute inset-0 bg-gradient-to-b" />
         </div>
         <Carousel
            className="h-full space-y-10 md:px-10 md:py-15 lg:px-30 lg:py-21"
            setApi={setApi}
         >
            <CarouselContent className="flex h-full items-center justify-center">
               {topEvents.map((event: EventWithEnrollments, index: number) => {
                  return (
                     <CarouselItem key={event.id} className="h-full">
                        <div className="flex h-full scale-90 flex-col justify-between md:scale-100 md:flex-row md:gap-5 lg:gap-10">
                           {/* Left Side - Event Details */}
                           <div className="hidden flex-col justify-center md:flex">
                              {/* Date and Time */}
                              <div className="text-foreground mb-2 text-lg font-medium">
                                 {new Date(event.startDate).toLocaleDateString(
                                    "en-US",
                                    {
                                       day: "numeric",
                                       month: "short",
                                    }
                                 )}
                                 ,{" "}
                                 {new Date(event.startDate)
                                    .toLocaleTimeString("en-US", {
                                       hour: "numeric",
                                       hour12: true,
                                    })
                                    .replace(/\s/g, "")
                                    .toUpperCase()}
                              </div>

                              <div className="flex flex-wrap justify-start gap-2">
                                 {event.category
                                    .slice(0, 3)
                                    .map((cat: string) => (
                                       <Badge
                                          key={cat}
                                          variant="secondary"
                                          className="from-foreground/20 via-background/50 to-foreground/20 rounded-sm border-none bg-gradient-to-bl px-2 py-1 backdrop-blur-md"
                                       >
                                          <span className="text-xxs md:text-xs">
                                             {cat}
                                          </span>
                                       </Badge>
                                    ))}
                              </div>

                              {/* Title */}
                              <h2 className="md:4xl text-foreground mb-4 text-3xl leading-tight font-bold lg:text-5xl">
                                 {event.title}
                              </h2>

                              {/* Location */}
                              <div className="text-muted-foreground mb-6 text-lg">
                                 {event.location.split(",")[0]}
                              </div>

                              {/* Volunteer Info */}
                              <div className="text-muted-foreground mb-8 text-lg">
                                 {event.enrollments?.length ?? 0} /{" "}
                                 {event.maxVolunteers ?? "-"} volunteers
                              </div>

                              {/* Enroll Button */}
                              <Link href={`/events/${event.id}`}>
                                 <ActionButton2 className="origin-left scale-80 rounded-full text-base lg:scale-100">
                                    Enroll as Volunteer
                                 </ActionButton2>
                              </Link>
                           </div>

                           {/* Right Side - Event Poster */}
                           <div className="flex w-fit items-center">
                              <Image
                                 urlEndpoint={config.env.imagekit.urlEndpoint}
                                 src={event.coverUrl || "/events.jpg"}
                                 alt={event.title}
                                 height={1000}
                                 width={1000}
                                 className="h-[60vh] rounded-3xl bg-black/10 object-cover object-center md:h-[25vh] md:w-xs lg:h-[52vh] lg:w-xl"
                                 priority={index < 2}
                                 quality={100}
                              />
                           </div>
                        </div>
                     </CarouselItem>
                  );
               })}
            </CarouselContent>

            {/* Navigation Buttons */}
            {topEvents.length > 1 && (
               <>
                  <CarouselPrevious className="bg-background text-foreground hover:bg-background left-5 hidden size-20 border-none shadow-[0_0_40px_10px_rgba(132,255,0,0.2)] lg:flex" />

                  <CarouselNext className="bg-background text-foreground hover:bg-background right-5 hidden size-20 border-none shadow-[0_0_40px_10px_rgba(132,255,0,0.2)] lg:flex" />
               </>
            )}
         </Carousel>

         {/* Pagination Dots */}
         {topEvents.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
               {topEvents.map((_: EventWithEnrollments, index: number) => (
                  <button
                     key={index}
                     className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                           ? "bg-foreground scale-125"
                           : "bg-muted-foreground hover:bg-foreground"
                     }`}
                     onClick={() => {
                        if (api) {
                           api.scrollTo(index);
                        }
                     }}
                  />
               ))}
            </div>
         )}
      </div>
   );
}
