import { IoNotifications } from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface NotificationProps {
   count?: number;
   className?: string;
}

export function NotificationBell({ count = 0, className }: NotificationProps) {
   const displayCount = count > 999 ? '999+' : count;
   return (
      <div
         aria-label="Notifications"
         title="Notifications"
         className={cn(
            'relative inline-flex items-center justify-center rounded-md p-1',
            className
         )}
      >
         <IoNotifications className="h-6 w-6" />
         {count > 0 && (
            <span className="text-xxs bg-destructive absolute -top-0.5 left-4 flex h-4 w-fit items-center justify-center rounded-full px-[5px] font-bold text-white">
               {displayCount}
            </span>
         )}
      </div>
   );
}

export function NotificationCount({
   count = 10,
   className,
}: NotificationProps) {
   const displayCount = count > 999 ? '999+' : count;
   return (
      <>
         {count > 0 && (
            <span className="text-xxs bg-destructive flex h-4 w-fit items-center justify-center rounded-full px-[5px] font-bold text-white">
               <span className="text-xxs">{displayCount}</span>
            </span>
         )}
      </>
   );
}
