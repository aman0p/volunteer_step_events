import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import config from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import EventCarousel from '@/components/EventCarousel';
import { Image } from '@imagekit/next';
import Section from '@/components/ui/section';

export default async function HomePage() {
   const events = await prisma.event.findMany({
      orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
      include: {
         enrollments: {
            where: { status: 'APPROVED' },
            select: { id: true },
         },
      },
   });

   return (
      <div className="mx-auto w-full space-y-20">
         <EventCarousel events={events as any} />

         <Section>
            <h1 className="mb-2 text-xl font-bold uppercase md:mb-6 md:text-3xl lg:text-4xl">
               Upcoming Events
            </h1>

            {/* Event Cards Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
               {events.map((event) => {
                  const start = new Date((event as any).startDate);
                  const diffMs = start.getTime() - Date.now();
                  const daysRemaining = Math.max(
                     0,
                     Math.ceil(diffMs / (1000 * 60 * 60 * 24))
                  );

                  return (
                     <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-lg"
                     >
                        <div className="relative h-[30rem] w-full">
                           <Image
                              urlEndpoint={config.env.imagekit.urlEndpoint}
                              src={event.coverUrl || '/events.jpg'}
                              alt={event.title}
                              height={900}
                              width={900}
                              className="h-full w-full bg-black/10 object-cover object-center"
                              quality={100}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                           {/* Event Info Overlay */}
                           <div className="absolute top-4 right-4">
                              <Badge
                                 variant="secondary"
                                 className="bg-background/20 text-foreground border-0 backdrop-blur-md"
                              >
                                 <span className="text-xs">
                                    {(event as any).enrollments?.length ?? 0} /{' '}
                                    {event.maxVolunteers ?? '-'} volunteers
                                 </span>
                              </Badge>
                           </div>

                           <div className="absolute right-4 bottom-4 left-4">
                              <h2 className="text-foreground mb-1 line-clamp-2 text-sm font-semibold">
                                 {event.title}
                              </h2>
                              <div className="text-foreground/90 flex items-center justify-between text-xs">
                                 <span>
                                    {new Date(
                                       event.startDate
                                    ).toLocaleDateString()}
                                 </span>
                                 <span>{daysRemaining} days left</span>
                              </div>
                           </div>
                        </div>

                        {/* Card Content */}
                        <div className="bg-transparent p-5 backdrop-blur-2xl">
                           <div className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-bold md:text-sm">
                              <span className="line-clamp-1">
                                 {event.location.split(',')[0]}
                              </span>
                           </div>
                           {Array.isArray(event.category) && (
                              <div className="flex flex-wrap gap-1">
                                 {event.category
                                    .slice(0, 2)
                                    .map((cat: string) => (
                                       <Badge
                                          key={cat}
                                          variant="secondary"
                                          className="from-foreground/30 via-background/30 to-foreground/30 rounded-sm border-none bg-gradient-to-tr px-2 py-1 backdrop-blur-md"
                                       >
                                          <span className="text-xxs md:text-xs">
                                             {cat}
                                          </span>
                                       </Badge>
                                    ))}
                              </div>
                           )}
                        </div>
                     </Link>
                  );
               })}
            </div>
         </Section>
      </div>
   );
}
