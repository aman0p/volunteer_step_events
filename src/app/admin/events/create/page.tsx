"use client";
import { useState } from "react";
import EventForm from "@/components/admin/forms/EventForm";
import ThemeBackground from "@/components/ui/theme-background";

export default function CreateEventPage() {
  const [themeColor, setThemeColor] = useState<string>("");

  return (
    <ThemeBackground className="w-full" themeColor={themeColor} alpha={0.05}>
        <EventForm onThemeColorChange={setThemeColor} />
    </ThemeBackground>
  );
}