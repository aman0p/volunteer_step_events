"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface TransitionProps {
   children: React.ReactNode;
}

export function Transition({ children }: TransitionProps) {
   const [isAnimating, setIsAnimating] = useState(true);
   const [progress, setProgress] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setProgress((prev) => {
            if (prev >= 100) {
               clearInterval(interval);
               setTimeout(() => setIsAnimating(false), 500); // Delay for smooth exit
               return 100;
            }
            return prev + 1.25;
         });
      }, 25);

      return () => clearInterval(interval);
   }, []);

   return (
      <AnimatePresence>
         {isAnimating ? (
            <motion.div
               className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
               initial={{ opacity: 1 }}
               exit={{
                  opacity: 0,
                  transition: {
                     duration: 0.5,
                     delay: 0.3,
                  },
               }}
            >
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-16"
               >
                  <h1 className="text-stroke font-orbitron text-6xl font-bold">
                     PL<sup className="font-extralight">®</sup>
                     <br />
                     CSE
                  </h1>
               </motion.div>

               <div className="relative w-[300px]">
                  <motion.div
                     className="h-[1px] w-full bg-gray-500"
                     initial={{ scaleX: 0 }}
                     animate={{ scaleX: 1 }}
                     transition={{ duration: 0.8, ease: "easeInOut" }}
                  />

                  <motion.div
                     className="absolute top-0 left-0 h-[1px] bg-white"
                     style={{ width: `${progress}%` }}
                     transition={{ duration: 0.3, ease: "easeOut" }}
                  />
               </div>

               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-4 text-sm font-medium"
               >
                  {Math.round(progress)}%
               </motion.div>
            </motion.div>
         ) : (
            <>{children}</>
         )}
      </AnimatePresence>
   );
}
