import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

export interface FileInputProps
   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
   label?: string;
   accept?: string;
   onFileChange?: (file: File | null) => void;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
   ({ className, label, accept = "image/*", onFileChange, ...props }, ref) => {
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0] || null;
         onFileChange?.(file);
      };

      return (
         <div className="w-full">
            {label && <label className="mb-2 block text-xs">{label}</label>}
            <div className="relative">
               <input
                  type="file"
                  className={cn(
                     "absolute inset-0 h-full w-full cursor-pointer opacity-0",
                     className
                  )}
                  accept={accept}
                  onChange={handleFileChange}
                  ref={ref}
                  {...props}
               />
               <div className="bg-background flex h-10 w-full items-center justify-center rounded-md border border-2 border-black/50 px-3 py-2 text-sm transition-colors hover:bg-gray-50">
                  <Upload className="mr-2 h-4 w-4" />
                  <span className="text-muted-foreground">Choose file</span>
               </div>
            </div>
         </div>
      );
   }
);
FileInput.displayName = "FileInput";

export { FileInput };
