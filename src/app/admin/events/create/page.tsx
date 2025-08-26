"use client";
import { useState } from "react";
import EventForm from "@/components/admin/forms/EventForm";
import ThemeBackground from "@/components/ui/theme-background";

export default function CreateEventPage() {
  const [themeColor, setThemeColor] = useState<string>("");

  return (
    <ThemeBackground className="w-full p-4 md:p-7 md:pr-13" themeColor={themeColor} alpha={0.05}>
        <EventForm onThemeColorChange={setThemeColor} />
    </ThemeBackground>
  );
}