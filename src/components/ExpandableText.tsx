"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type ExpandableTextProps = {
   text: string;
   className?: string;
   clampLines?: number;
   moreLabel?: string;
   lessLabel?: string;
};

export default function ExpandableText({
   text,
   className,
   clampLines = 3,
   moreLabel = "Show more",
   lessLabel = "Show less",
}: ExpandableTextProps) {
   const [expanded, setExpanded] = useState(false);
   const contentRef = useRef<HTMLParagraphElement | null>(null);
   const [measuredHeight, setMeasuredHeight] = useState<number>(0);
   const [collapsedHeight, setCollapsedHeight] = useState<number>(0);

   useEffect(() => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const computeHeights = () => {
         const style = window.getComputedStyle(el);
         const lineHeight = parseFloat(style.lineHeight || "20");
         const collapsed = Math.ceil(lineHeight * clampLines);
         setCollapsedHeight(collapsed);
         setMeasuredHeight(el.scrollHeight);
      };
      computeHeights();
      const resizeObserver = new ResizeObserver(() => computeHeights());
      resizeObserver.observe(el);
      return () => resizeObserver.disconnect();
   }, [text, clampLines]);

   return (
      <div className={cn("space-y-2", className)}>
         <motion.div
            style={{ overflow: "hidden" }}
            animate={{
               height: expanded ? measuredHeight : collapsedHeight,
               opacity: 1,
            }}
            initial={{ height: collapsedHeight, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
         >
            <p ref={contentRef} className={cn("text-sm md:text-base")}>
               {text}
            </p>
         </motion.div>
         {text?.length > 0 && (
            <button
               type="button"
               className="text-primary text-xs hover:underline md:text-sm"
               onClick={() => setExpanded((v) => !v)}
            >
               {expanded ? lessLabel : moreLabel}
            </button>
         )}
      </div>
   );
}
