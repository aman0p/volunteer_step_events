"use client";
import { useMemo } from "react";
import { hexToRgba } from "@/lib/utils";

interface ThemeBackgroundProps {
  themeColor?: string;
  alpha?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// using shared util hexToRgba

export default function ThemeBackground({
  themeColor,
  alpha = 0.1,
  className,
  style,
  children,
}: ThemeBackgroundProps) {
  const backgroundColor = useMemo(() => {
    return themeColor && /^#([A-Fa-f0-9]{6})$/.test(themeColor)
      ? hexToRgba(themeColor, alpha)
      : "transparent";
  }, [themeColor, alpha]);

  const surface = useMemo(() => {
    return themeColor && /^#([A-Fa-f0-9]{6})$/.test(themeColor)
      ? hexToRgba(themeColor, alpha)
      : undefined;
  }, [themeColor, alpha]);

  return (
    <section
      className={className}
      style={{
        backgroundColor,
        ...(style || {}),
        ...(surface ? ({ ["--themed-surface"]: surface } as React.CSSProperties) : {}),
      }}
    >
      {children}
    </section>
  );
}


