"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
   AnimationStart,
   AnimationVariant,
   createAnimation,
} from "@/components/theme/theme-animations";
import { LucideSunMedium, LucideSunMoon } from "lucide-react";

interface ThemeToggleAnimationProps {
   variant?: AnimationVariant;
   start?: AnimationStart;
   url?: string;
   className?: string;
}

export function ThemeToggleButton({
   variant = "circle-blur",
   start = "top-left",
   url = "",
   className,
}: ThemeToggleAnimationProps) {
   const { theme, setTheme } = useTheme();
   const styleId = "theme-transition-styles";

   const updateStyles = React.useCallback((css: string, name: string) => {
      if (typeof window === "undefined") return;

      let styleElement = document.getElementById(styleId) as HTMLStyleElement;

      console.log("style ELement", styleElement);
      console.log("name", name);

      if (!styleElement) {
         styleElement = document.createElement("style");
         styleElement.id = styleId;
         document.head.appendChild(styleElement);
      }

      styleElement.textContent = css;

      console.log("content updated");
   }, []);

   const toggleTheme = React.useCallback(() => {
      const animation = createAnimation(variant, start, url);

      updateStyles(animation.css, animation.name);

      if (typeof window === "undefined") return;

      const switchTheme = () => {
         setTheme(theme === "light" ? "dark" : "light");
      };

      if (!document.startViewTransition) {
         switchTheme();
         return;
      }

      document.startViewTransition(switchTheme);
   }, [theme, setTheme, variant, start, url, updateStyles]);

   return (
      <Button
         onClick={toggleTheme}
         variant="link"
         size="icon"
         className={`group relative h-8 w-8 cursor-pointer p-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${className}`}
         name="Theme Toggle Button"
      >
         <LucideSunMedium className="size-[1.5rem] scale-100 rotate-0 border-none bg-transparent transition-all duration-300 ease-out dark:scale-0 dark:-rotate-360" />
         <LucideSunMoon className="absolute size-[1.5rem] scale-0 rotate-180 border-none bg-transparent transition-all duration-300 ease-out dark:scale-100 dark:rotate-0" />
         <span className="sr-only">Theme Toggle </span>
      </Button>
   );
}
