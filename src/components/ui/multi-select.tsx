import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectProps {
   options: string[];
   selected: string[];
   onChange: (selected: string[]) => void;
   placeholder?: string;
   className?: string;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
   (
      {
         options,
         selected,
         onChange,
         placeholder = "Select options...",
         className,
      },
      ref
   ) => {
      const toggleOption = (option: string) => {
         if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
         } else {
            onChange([...selected, option]);
         }
      };

      const removeOption = (option: string) => {
         onChange(selected.filter((item) => item !== option));
      };

      return (
         <div className={cn("w-full", className)} ref={ref}>
            <div className="bg-background flex min-h-[40px] flex-wrap gap-2 rounded-md border border-2 border-black/50 p-2">
               {selected.map((option) => (
                  <div
                     key={option}
                     className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                  >
                     <span>{option}</span>
                     <button
                        type="button"
                        onClick={() => removeOption(option)}
                        className="rounded-full p-0.5 hover:bg-blue-200"
                     >
                        <X className="h-3 w-3" />
                     </button>
                  </div>
               ))}
               {selected.length === 0 && (
                  <span className="text-muted-foreground text-sm">
                     {placeholder}
                  </span>
               )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
               {options.map((option) => (
                  <button
                     key={option}
                     type="button"
                     onClick={() => toggleOption(option)}
                     className={cn(
                        "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        selected.includes(option)
                           ? "border-blue-300 bg-blue-100 text-blue-800"
                           : "border-gray-200 bg-white hover:bg-gray-50"
                     )}
                  >
                     {option}
                  </button>
               ))}
            </div>
         </div>
      );
   }
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
