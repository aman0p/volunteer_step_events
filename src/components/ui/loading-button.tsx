"use client";

import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { PiSpinner } from "react-icons/pi";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
   loading?: boolean;
   loadingText?: string;
   loadingIcon?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
   (
      {
         className,
         loading = false,
         loadingText,
         loadingIcon,
         children,
         disabled,
         ...props
      },
      ref
   ) => {
      return (
         <Button
            ref={ref}
            className={cn(className)}
            disabled={loading || disabled}
            {...props}
         >
            {loading ? (
               <div className="flex items-center gap-2">
                  {loadingIcon || (
                     <PiSpinner className="h-4 w-4 animate-spin" />
                  )}
                  {loadingText || children}
               </div>
            ) : (
               children
            )}
         </Button>
      );
   }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
