"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Calendar, List } from "lucide-react";

export default function EventNotFound() {
   return (
      <div className="mx-auto h-[83vh] w-full space-y-2 rounded-xl md:w-4xl md:space-y-5 md:rounded-2xl md:px-2 lg:w-6xl lg:rounded-3xl lg:px-0">
         <div className="grid h-full w-full grid-cols-1 gap-10 rounded-xl bg-black/10 md:grid-cols-[2fr_1fr] md:rounded-2xl md:p-7 lg:rounded-3xl">
            {/* Left Content */}
            <div className="order-2 flex flex-col justify-end gap-3 md:order-1 md:gap-7">
               {/* 404 Icon */}
               <div className="order-1 flex flex-col gap-1 md:order-1 md:gap-2">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-black/10">
                     <Calendar className="h-12 w-12 opacity-50" />
                  </div>
               </div>

               {/* Error Message */}
               <div className="order-3 space-y-4 md:order-2">
                  <h1 className="text-4xl font-bold opacity-70">404</h1>
                  <h2 className="text-2xl font-semibold opacity-70">
                     Event Not Found
                  </h2>
                  <p className="leading-relaxed opacity-50">
                     Sorry, the event you&apos;re looking for doesn&apos;t exist
                     or may have been removed.
                  </p>
               </div>

               {/* Action Buttons */}
               <div className="order-2 grid w-full grid-cols-1 gap-4 space-y-4 pt-4 md:order-3 md:grid-cols-2">
                  <Link href="/" className="block">
                     <Button className="w-full rounded-xl px-6 py-6 font-medium transition-colors md:rounded-full">
                        <Search className="mr-2 h-4 w-4" />
                        Browse All Events
                     </Button>
                  </Link>

                  <Link href="/my-events" className="block">
                     <Button
                        variant="outline"
                        className="w-full rounded-xl px-6 py-6 font-medium transition-colors md:rounded-full"
                     >
                        <List className="mr-2 h-4 w-4" />
                        My Events
                     </Button>
                  </Link>
               </div>

               {/* Additional Help */}
               <div className="order-4 border-t border-white/20 pt-6 md:order-4">
                  <p className="text-sm text-gray-400">
                     Need help? Contact our support team or check the events
                     page for current listings.
                  </p>
               </div>
            </div>

            {/* Right Content - Placeholder */}
            <div className="order-1 md:order-2">
               <div className="flex h-full w-full items-center justify-center rounded-xl bg-black/10 md:rounded-2xl lg:rounded-3xl">
                  <div className="text-center">
                     <Calendar className="mx-auto mb-4 h-16 w-16 opacity-50" />
                     <p className="text-base opacity-50">Event Not Available</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
