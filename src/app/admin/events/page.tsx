import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import prisma from "@/lib/prisma";
import { hexToRgba } from "@/lib/utils";

export default async function EventsPage() {
  const events = await prisma.event.findMany();

  return (
    <section className="w-full rounded-2xl bg-transparent p-4 md:p-7 md:pr-13">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">All Events</h2>
        {/* <Button variant="default" asChild> */}
        <Link href="/admin/events/create" className="text-white bg-black px-3 py-2 md:px-4 md:py-2 rounded-sm md:rounded-lg text-xs md:text-sm">
          + Create a New Event
        </Link>
        {/* </Button> */}
      </div>

      <div className="mt-5 md:mt-7 w-full h-full min-h-screen">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-5">
          {events?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).map((event) => {
            const borderColor = event.color ? hexToRgba(event.color as string, 0.3) : undefined;
            const backgroundColor = event.color ? hexToRgba(event.color as string, 0.05) : undefined;
            return (
              <div
                key={event.id}
                className={"border flex flex-col h-full gap-1 p-1 md:p-2 rounded-lg cursor-pointer backdrop-blur-sm"}
                style={{ borderColor, backgroundColor }}
              >
                <div className="md:w-full md:h-full rounded-sm md:rounded-lg h-full">
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
                </div>
                <div className="flex flex-col gap-0.5 p-0.5 pl-1 justify-between h-full w-full md:w-auto">
                  <h1 className="text-xs md:text-sm font-bold mt-0.5 capitalize line-clamp-1">{event.title}</h1>
                  <p className="text-[10px] md:text-xs text-gray-500 capitalize line-clamp-1">{event.category.join(", ")}</p>
                  <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1">{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  );
}