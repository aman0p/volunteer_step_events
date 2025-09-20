import { cn } from "@/lib/utils";

export default function Section({
   children,
   className,
}: {
   children: React.ReactNode;
   className?: string;
}) {
   return (
      <div
         className={cn(
            "mx-auto w-full p-3 md:p-5 lg:px-10 lg:py-10",
            className
         )}
      >
         {children}
      </div>
   );
}
