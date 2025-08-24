"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { EventCoverSvg } from "./EventCoverSvg";

type EventCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<EventCoverVariant, string> = {
  extraSmall: "event-cover_extra_small",
  small: "event-cover_small",
  medium: "event-cover_medium",
  regular: "event-cover_regular",
  wide: "event-cover_wide",
};

interface Props {
  className?: string;
  variant?: EventCoverVariant;
  coverColor: string;
  coverImage: string;
}

export const EventCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      <EventCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <Image
          src={coverImage}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Event cover"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
        />
      </div>
    </div>
  );
};