import React from "react";
import Link from "next/link";
import { Search, Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function NotFound() {
  return (
<div className="h-screen w-full flex items-center justify-center p-15">
<div className="w-full space-y-2 md:space-y-5 md:px-2 lg:px-0 md:w-4xl lg:w-6xl mx-auto h-full rounded-xl md:rounded-2xl lg:rounded-3xl">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] w-full rounded-xl md:rounded-2xl lg:rounded-3xl h-full md:p-7 gap-10 bg-black/10">
        
        {/* Left Content */}
        <div className="flex flex-col gap-3 md:gap-7 justify-end order-2 md:order-1">
          
          {/* 404 Icon */}
          <div className="flex flex-col gap-1 md:gap-2 order-1 md:order-1">
              <div className="w-24 h-24 mx-auto bg-black/10 rounded-full flex items-center justify-center">
                <Calendar className="w-12 h-12 opacity-50" />
              </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 order-3 md:order-2">
            <h1 className="text-4xl font-bold opacity-70">404</h1>
            <h2 className="text-2xl font-semibold opacity-70">Event Not Found</h2>
            <p className="leading-relaxed opacity-50">
              Sorry, the event you're looking for doesn't exist or may have been removed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 w-full gap-4 pt-4 order-2 md:order-3">
            <Link href="/" className="block">
              <Button className="w-full py-6 px-6 rounded-xl md:rounded-full font-medium transition-colors">
                <Search className="w-4 h-4 mr-2" />
                Browse All Events
              </Button>
            </Link>
            
            <Link href="/my-events" className="block">
              <Button variant="outline" className="w-full py-6 px-6 rounded-xl md:rounded-full font-medium transition-colors">
                <List className="w-4 h-4 mr-2" />
                My Events
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="pt-6 border-t border-white/20 order-4 md:order-4">
            <p className="text-sm text-gray-400">
              Need help? Contact our support team or check the events page for current listings.
            </p>
          </div>
        </div>

        {/* Right Content - Placeholder */}
        <div className="order-1 md:order-2">
          <div className="w-full h-full bg-black/10 rounded-xl md:rounded-2xl lg:rounded-3xl flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-base opacity-50">Event Not Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  );
}
