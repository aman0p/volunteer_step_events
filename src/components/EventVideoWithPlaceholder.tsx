"use client";

import { Video, buildSrc } from "@imagekit/next";
import { useState } from "react";
import config from "@/lib/config";

interface EventVideoWithPlaceholderProps {
   videoUrl: string;
   className?: string;
}

export default function EventVideoWithPlaceholder({
   videoUrl,
   className,
}: EventVideoWithPlaceholderProps) {
   const [showPlaceholder, setShowPlaceholder] = useState(true);
   const [videoError, setVideoError] = useState(false);

   // Generate placeholder video URL using the default event video
   const placeholderVideoUrl = buildSrc({
      urlEndpoint: config.env.imagekit.urlEndpoint,
      src: "/default/event-video.mp4",
      transformation: [
         {
            quality: 10,
            blur: 90,
         },
      ],
   });

   // Generate thumbnail for the actual video
   const videoThumbnail = buildSrc({
      urlEndpoint: config.env.imagekit.urlEndpoint,
      src: `${videoUrl}/ik-thumbnail.jpg`,
   });

   const handleVideoLoad = () => {
      setShowPlaceholder(false);
   };

   const handleVideoError = () => {
      setVideoError(true);
      setShowPlaceholder(false);
   };

   // If video has error, show placeholder
   if (videoError) {
      return (
         <div
            className={`flex aspect-video h-fit w-full items-center justify-center overflow-hidden rounded-xl bg-black/10 md:rounded-2xl lg:rounded-3xl ${className}`}
         >
            <Video
               urlEndpoint={config.env.imagekit.urlEndpoint}
               src="/default/event-video.mp4"
               alt="Default event video"
               controls
               preload="none"
               className="h-full w-full rounded-xl object-cover md:rounded-2xl lg:rounded-3xl"
               poster={buildSrc({
                  urlEndpoint: config.env.imagekit.urlEndpoint,
                  src: "/default/event-video.mp4/ik-thumbnail.jpg",
               })}
            />
         </div>
      );
   }

   return (
      <div
         className={`relative aspect-video h-fit w-full overflow-hidden rounded-xl bg-black/10 md:rounded-2xl lg:rounded-3xl ${className}`}
      >
         {/* Placeholder video */}
         {showPlaceholder && (
            <div className="absolute inset-0 z-10">
               <Video
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src="/default/event-video.mp4"
                  alt="Loading placeholder"
                  controls={false}
                  muted
                  loop
                  autoPlay
                  preload="auto"
                  className="h-full w-full rounded-xl object-cover opacity-70 md:rounded-2xl lg:rounded-3xl"
                  poster={placeholderVideoUrl}
               />
               <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                  <div className="text-sm font-medium text-white">
                     Loading video...
                  </div>
               </div>
            </div>
         )}

         {/* Actual video */}
         <Video
            urlEndpoint={config.env.imagekit.urlEndpoint}
            src={videoUrl}
            alt="event video"
            controls
            preload="none"
            className="h-full w-full overflow-hidden rounded-xl object-cover md:rounded-2xl lg:rounded-3xl"
            poster={videoThumbnail}
            onLoad={handleVideoLoad}
            onError={handleVideoError}
            style={{
               opacity: showPlaceholder ? 0 : 1,
               transition: "opacity 0.3s ease-in-out",
            }}
         />
      </div>
   );
}
