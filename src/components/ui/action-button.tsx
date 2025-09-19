'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { IoArrowForward } from 'react-icons/io5';

const buttonVariants = cva(
   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
   {
      variants: {
         variant: {
            default:
               'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
            destructive:
               'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline:
               'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary:
               'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline',
            activeButton2:
               'group min-h-14 w-[16rem] overflow-hidden border text-white group',
         },
         size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
         },
      },
      defaultVariants: {
         variant: 'default',
         size: 'default',
      },
   }
);

interface ActionButtonProps
   extends React.ComponentProps<'button'>,
      VariantProps<typeof buttonVariants> {
   isActive: boolean;
   setIsActive: (isActive: boolean) => void;
   openText?: string;
   openBgColor?: string;
   closeText?: string;
   closeBgColor?: string;
   asChild?: boolean;
}

export default function ActionButton({
   isActive,
   setIsActive,
   variant,
   size,
   className,
   asChild = false,
   openText = 'Open',
   openBgColor,
   closeText = 'Close',
   closeBgColor,
   onClick,
   disabled,
   ...props
}: ActionButtonProps) {
   const Comp = asChild ? Slot : 'button';

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      setIsActive(!isActive);
      onClick?.(event);
   };

   return (
      <Comp
         onClick={handleClick}
         className={cn(
            buttonVariants({ variant, size, className }),
            'h-9 w-24 cursor-pointer overflow-hidden border border-zinc-200 p-0 shadow-md dark:border-zinc-800'
         )}
         data-slot="action-button"
         aria-pressed={isActive}
         disabled={disabled}
         {...(!asChild && { type: 'button' })}
         {...props}
      >
         <motion.div
            className="relative h-full w-full text-xs font-semibold"
            animate={{ top: isActive ? '-100%' : '0%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
         >
            <div
               className={cn(
                  'flex h-full w-full items-center justify-center uppercase',
                  openBgColor
               )}
            >
               <p>{openText}</p>
            </div>

            <div
               className={cn(
                  'absolute top-full flex h-full w-full items-center justify-center uppercase',
                  closeBgColor
               )}
            >
               <p>{closeText}</p>
            </div>
         </motion.div>
      </Comp>
   );
}

interface ActionButton2Props
   extends React.ComponentProps<'button'>,
      Omit<VariantProps<typeof buttonVariants>, 'variant'> {
   asChild?: boolean;
   color?: string;
}

export function ActionButton2({
   className,
   size,
   asChild = false,
   children,
   color,
   ...props
}: ActionButton2Props) {
   const Comp = asChild ? Slot : 'button';

   return (
      <Comp
         data-slot="button"
         className={cn(
            buttonVariants({ variant: 'activeButton2', size, className }),
            // `border p-1 hover:bg-transparent border-${color}-600 bg-${color}-600`,
            `border border-black bg-black p-1 text-white hover:bg-transparent hover:text-black dark:border-lime-400 dark:bg-lime-400 dark:text-black`,
            color
         )}
         {...props}
      >
         <div className="relative flex w-full items-center justify-between overflow-hidden rounded-lg px-1">
            <span className="pl-4 transition-transform duration-400 ease-in-out group-hover:translate-x-16">
               {children}
            </span>
            <div
               className={cn(
                  `rounded-full bg-white p-2 transition-transform duration-400 ease-in-out group-hover:-translate-x-50 group-hover:bg-black dark:bg-black`,
                  color
               )}
            >
               <IoArrowForward className="size-5.5 rotate-315 text-black group-hover:rotate-360 group-hover:text-white dark:text-white" />
            </div>
         </div>
      </Comp>
   );
}
