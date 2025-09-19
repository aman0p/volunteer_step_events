import { cn } from '@/lib/utils';

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
            'mx-auto w-full px-3 md:max-w-7xl md:px-5 lg:px-0',
            className
         )}
      >
         {children}
      </div>
   );
}
