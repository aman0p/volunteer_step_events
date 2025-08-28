import { IoNotifications } from "react-icons/io5";
import { cn } from "@/lib/utils";

interface NotificationProps {
    count?: number;
    className?: string;
}

export function NotificationBell({ count = 0, className }: NotificationProps) {
    const displayCount = count > 999 ? "999+" : count;
    return (
        <div
            aria-label="Notifications"
            title="Notifications"
            className={cn("relative inline-flex items-center justify-center rounded-md p-1", className)}
        >
            <IoNotifications className="w-6 h-6" />
            {count > 0 && (
                <span className="absolute -top-0.5 left-4 text-xxs rounded-full w-fit h-4 px-[5px] flex items-center justify-center font-bold text-white bg-destructive">
                    {displayCount}
                </span>
            )}
        </div>
    )
}

export function NotificationCount({ count = 10, className }: NotificationProps) {
    const displayCount = count > 999 ? "999+" : count;
    return (
        <>
            {count > 0 && (
                <span className="text-xxs font-bold rounded-full h-4 w-fit px-[5px] flex items-center justify-center text-white bg-destructive">
                    <span className="text-xxs">{displayCount}</span>
                </span>
            )}
        </>

    )
}
