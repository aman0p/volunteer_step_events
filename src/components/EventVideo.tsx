"use client";
import React from "react";
import { Video } from "@imagekit/next";
import config from "@/lib/config";

export const EventVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <Video 
      src={videoUrl} 
      urlEndpoint={config.env.imagekit.urlEndpoint}
      controls={true} 
      className="w-full rounded-xl" 
    />
  );
};
