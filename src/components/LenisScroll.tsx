"use client";

import Lenis from "lenis";
import { useEffect } from "react";

const LenisScroll = () => {
   useEffect(() => {
      const lenis = new Lenis({
         duration: 0.5, // Animation duration
         easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2)), // Easing function
      });

      function raf(time: number) {
         lenis.raf(time);
         requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      // Cleanup
      return () => {
         lenis.destroy();
      };
   }, []);

   return null; // This component doesn't render anything
};

export default LenisScroll;
