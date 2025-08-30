import React from "react";
import { notFound } from "next/navigation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Calendar, MailIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import EnrollButton from "@/components/EnrollButton";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Video } from "@imagekit/next";
import { Badge } from "@/components/ui/badge";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await getServerSession(authOptions);

  // Fetch data based on id
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          user: true
        }
      }
    }
  });

  if (!event) notFound();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeRange = (startDate: Date, endDate: Date) => {
    const start = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(startDate);

    const end = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(endDate);

    return `${start} - ${end}`;
  };

  const enrolledVolunteers = event.enrollments.filter((e: any) => e.status === 'APPROVED').length;
  const availableSlots = event.maxVolunteers ? event.maxVolunteers - enrolledVolunteers : 'Unlimited';


  return (
    <div className="w-full space-y-2 md:space-y-5 md:px-2 lg:px-0 md:w-4xl lg:w-6xl mx-auto h-full rounded-xl md:rounded-2xl lg:rounded-3xl">

      {/* main content */}
      <div
        className="grid grid-cols-1 md:grid-cols-[2fr_1fr] w-full rounded-xl md:rounded-2xl lg:rounded-3xl h-full md:p-7 gap-10 bg-black/10"

      >
        <div className="flex flex-col gap-3 md:gap-7 justify-end order-2 md:order-1">

          {/* title */}
          <div className="flex flex-col gap-1 md:gap-2 order-1 md:order-1">

            {/* category badges */}
            <div className="flex flex-wrap gap-1 md:gap-2">
              {event.category.map((cat, index) => (
                <Badge key={index} variant="secondary" className="bg-black/70 text-white">
                  <span className="text-xxs md:text-xs font-semibold">{cat}</span>
                </Badge>
              ))}
            </div>

            {/* title */}
            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold">{event.title}</h1>

          </div>

          <div className="flex md:items-center md:justify-between flex-col md:flex-row gap-5 order-3 md:order-2">
            {/* Enroll button */}
            <EnrollButton
              eventId={event.id}
              isFull={availableSlots === 0}
              className="w-full md:w-fit rounded-xl md:rounded-full"
              enrollmentStatus={event.enrollments.find((e: any) => e.userId === session?.user?.id)?.status}
            />
            <div className="hidden md:flex items-center w-fit">

              {event.enrollments
                .filter((e: any) => e.user.profileImage) // Only show users with profile images
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((e: any) => (
                  <Image
                    key={e.id}
                    urlEndpoint={config.env.imagekit.urlEndpoint}
                    src={e.user.profileImage}
                    alt="volunteer image"
                    width={100}
                    height={100}
                    className="rounded-full size-11 border-3 aspect-square object-cover -ml-3"
                  />
                ))}
              <div className="ml-4 text-[13px] flex flex-col items-start mt-1.5">
                <span className="font-bold">{event.enrollments.length.toString().padStart(2, '0')} / {event.maxVolunteers}</span>
                <span className="relative bottom-0.5">Volunteers</span>
              </div>
            </div>
          </div>

          {/* date and location */}
          <div className="border w-full md:w-fit flex flex-col rounded-2xl gap-[1px] overflow-hidden order-2 md:order-3">
            <div className="flex gap-2 md:gap-5 items-center text-white bg-black/70 justify-start px-5 py-3 w-md">
              <Calendar className="size-3.5 md:size-4 mb-0.5" />
              <p className="text-xs md:text-sm text-medium md:font-semibold tracking-wide">{formatDate(event.startDate)}</p>
            </div>
            <div className="flex gap-2 md:gap-5 items-center text-white bg-black/70 justify-start px-5 py-3 w-md">
              <MapPin className="size-3.5 md:size-4 mb-0.5" />
              <p className="text-xs md:text-sm text-medium md:font-semibold tracking-wide">{event.location}</p>
            </div>
          </div>
        </div>

        {/* cover image */}
        <div className="order-1 md:order-2">
          {event.coverUrl && event.coverUrl.trim() !== "" ? (
            <Image
              urlEndpoint={config.env.imagekit.urlEndpoint}
              src={event.coverUrl}
              alt={event.title}
              width={500}
              height={500}
              className="w-fit h-fit object-cover rounded-xl md:rounded-2xl lg:rounded-3xl aspect-video md:aspect-square object-top"
            />
          ) : (
            <div className="w-full h-full bg-black/10 rounded-lg"></div>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-2 md:gap-5">

        <div className="flex flex-col gap-2 md:gap-5">

          {event.eventImages && event.eventImages.length > 0 && <div className="grid grid-cols-2 gap-2 md:gap-5 w-full order-2">
          {event.eventImages && event.eventImages.map((img, index) => (
            <Image
              key={index}
              urlEndpoint={config.env.imagekit.urlEndpoint}
              src={img}
              alt="event image"
              width={1000}
              height={1000}
              className="w-full aspect-video object-cover rounded-xl md:rounded-2xl lg:rounded-3xl object-top"
            />
          ))}
        </div>

          }
        {event.videoUrl && event.videoUrl.trim() !== "" && (
          <div className="w-full h-full">
            {event.videoUrl && event.videoUrl.trim() !== "" && (
              <Video
                urlEndpoint={config.env.imagekit.urlEndpoint}
                src={event.videoUrl}
                alt="event video"
                controls
                className="w-full h-full object-cover rounded-xl md:rounded-2xl lg:rounded-3xl aspect-video bg-black/10"
                poster={event.coverUrl || undefined}
              />
            )}
          </div>
        )}

        {/* Description */}
        <div className="h-fit w-full order-1 flex flex-col gap-3 md:gap-5 p-5 md:p-7 rounded-xl md:rounded-2xl lg:rounded-3xl bg-black/10">
          <h1 className="text-base md:text-xl font-bold">Description</h1>
          <p className="text-xs md:text-sm tracking-wide leading-5.5 line-clamp-4 md:line-clamp-none">{event.description}</p>
        </div>

        {/* Event Video */}

      </div>

      <div className="flex flex-col gap-2 md:gap-5">

        {/* Event Category */}
        <div className="h-fit w-full flex flex-col gap-3 md:gap-5 p-5 md:p-7  rounded-xl md:rounded-2xl lg:rounded-3xl bg-black/10">
          <h1 className="text-base md:text-xl font-bold">Event Category</h1>
          <div className="flex flex-wrap gap-2">
            {event.category.map((cat, index) => (
              <Badge key={index} variant="secondary" className="bg-black/70 text-white">
                <span className="text-xxs md:text-xs font-semibold">{cat}</span>
              </Badge>
            ))}
          </div>
        </div>


        {/* Event Details */}
        <div className="h-fit w-full flex flex-col gap-3 md:gap-5 p-5 md:p-7  rounded-xl md:rounded-2xl lg:rounded-3xl bg-black/10">
          <h1 className="text-base md:text-xl font-bold">Event Details</h1>
          <div className="flex flex-col gap-3 overflow-hidden text-xs md:text-sm">
            <p className="space-x-1">
              <span className="font-bold">Start Date:</span>
              <span>{formatDate(event.startDate)}</span>
            </p>
            <p className="space-x-1">
              <span className="font-bold">End Date:</span>
              <span>{formatDate(event.endDate)}</span>
            </p>
            <p className="space-x-1">
              <span className="font-bold">Duration:</span>
              <span>{getTimeRange(event.startDate, event.endDate)}</span>
            </p>
            <p className="space-x-1">
              <span className="font-bold">Available Slots:</span>
              <span>{availableSlots}</span>
            </p>
            <p className="space-x-1">
              <span className="font-bold">Dress Code:</span>
              <span>{event.dressCode}</span>
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="h-fit w-full flex flex-col gap-3 md:gap-5 p-5 md:p-7 rounded-xl md:rounded-2xl lg:rounded-3xl bg-black/5">
          <h1 className="text-base md:text-xl  font-bold">Quick Links</h1>
          <div className="flex flex-col gap-3 overflow-hidden text-xs md:text-sm">
            <Link href="/events" className="flex items-center gap-2 md:gap-3">
              <FaWhatsapp className="size-3.5 md:size-4.5" />
              <p className="truncate">https://wa.me/919876543210</p>
            </Link>
            <Link href="/events" className="flex items-center gap-2 md:gap-3">
              <FaInstagram className="size-3.5 md:size-4.5" />
              <p className="truncate">https://www.instagram.com/your_instagram_handle</p>
            </Link>
            <Link href="/events" className="flex items-center gap-2 md:gap-3">
              <MailIcon className="size-3.5 md:size-4.5" />
              <p className="truncate">your_email@example.com</p>
            </Link>
            <Link href="/events" className="flex items-center gap-2 md:gap-3">
              <MapPin className="size-3.5 md:size-4.5" />
              <p className="truncate">https://www.google.com/maps/place/5V4+MXP+,+91-/+5V4+MXP</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div >
  );

};

export default Page;
