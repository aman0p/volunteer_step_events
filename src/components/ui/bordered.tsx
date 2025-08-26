"use client";
import * as React from "react";
import { cn, hexToRgba } from "@/lib/utils";

type BorderedProps = React.ComponentProps<"div"> & {
  color?: string; // hex #RRGGBB
  alpha?: number; // 0..1
  radiusClassName?: string;
  defaultBorderClassName?: string; // e.g. border-gray-300
};

export function Bordered({
  color,
  alpha = 0.2,
  className,
  children,
  radiusClassName = "rounded-md",
  defaultBorderClassName = "border-gray-300",
  ...rest
}: BorderedProps) {
  const dynamicBorderColor = React.useMemo(() => {
    return color && /^#([A-Fa-f0-9]{6})$/.test(color) ? hexToRgba(color, alpha) : undefined;
  }, [color, alpha]);

  return (
    <div
      className={cn("border", defaultBorderClassName, radiusClassName, className)}
      style={{ borderColor: dynamicBorderColor, ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </div>
  );
}


