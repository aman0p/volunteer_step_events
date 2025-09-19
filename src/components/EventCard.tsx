'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import config from '@/lib/config';
import { Image } from '@imagekit/next';
import { DeleteEvent } from '@/components/admin/forms/DeleteEvent';

export default function EventCard({ event }: { event: any }) {
   return (
      <div
         key={event.id}
         className={
            'flex h-full cursor-pointer flex-col gap-1 rounded-lg border border-black/10 bg-black/10 p-1 backdrop-blur-sm md:p-2'
         }
      >
         <div className="absolute top-4 right-4 flex flex-col gap-2">
            <DeleteEvent eventId={event.id} eventTitle={event.title} />
            <Link href={`/admin/events/${event.id}/update`}>
               <Button
                  variant="default"
                  size="icon"
                  className="cursor-pointer hover:bg-black"
               >
                  <Pencil className="h-4 w-4" />
               </Button>
            </Link>
         </div>
         <Link
            href={`/admin/events/${event.id}/details`}
            className="h-full rounded-sm md:h-full md:w-full md:rounded-lg"
         >
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
               className="aspect-square rounded-sm object-cover md:aspect-auto md:h-full md:w-full md:rounded-lg"
               loading="lazy"
            />
         </Link>
         <div className="flex h-full w-full flex-col justify-between gap-0.5 p-0.5 pl-1 md:w-auto">
            <h1 className="mt-0.5 line-clamp-1 text-xs font-bold capitalize md:text-base">
               {event.title}
            </h1>
            <div className="flex flex-col justify-between md:flex-row md:items-center">
               <p className="text-xxs line-clamp-1 text-gray-500 capitalize md:text-xs">
                  {event.category.join(', ')}
               </p>
               <p className="text-xxs line-clamp-1 text-gray-500 md:text-xs">
                  {new Date(event.startDate).toLocaleDateString()}
               </p>
            </div>
         </div>
      </div>
   );
}
