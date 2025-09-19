"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationType } from "@/types";

type NotificationItem = {
   id: string;
   title: string;
   message: string;
   type: NotificationType;
   isRead: boolean;
   createdAt: string | Date;
   relatedEventId?: string | null;
};

export function EventNotificationCard({
   notification,
   selected,
   onToggleSelect,
   onMarkRead,
   onDelete,
   onCloseDrawer,
   className,
}: {
   notification: NotificationItem;
   selected: boolean;
   onToggleSelect: () => void;
   onMarkRead: () => void;
   onDelete: () => void;
   onCloseDrawer: () => void;
   className?: string;
}) {
   const getStatusFromType = (type: NotificationItem["type"]) => {
      switch (type) {
         case "ENROLLMENT_APPROVED":
            return {
               label: "Approved",
               color: "bg-emerald-100 text-emerald-700",
            };
         case "ENROLLMENT_REJECTED":
            return { label: "Rejected", color: "bg-rose-100 text-rose-700" };
         case "ENROLLMENT_WAITLISTED":
            return {
               label: "Waitlisted",
               color: "bg-amber-100 text-amber-800",
            };
         default:
            return { label: undefined, color: "" };
      }
   };

   const n = notification;
   const status = getStatusFromType(n.type);

   return (
      <div className={cn("flex items-start justify-between gap-2", className)}>
         <div className="pt-[0.5px]">
            <input
               type="checkbox"
               className="h-3 w-3 rounded border-white/15"
               checked={selected}
               onChange={onToggleSelect}
               aria-label="Select notification"
            />
         </div>
         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <p className="truncate font-medium">{n.title}</p>
               {status.label && (
                  <span
                     className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        status.color
                     )}
                  >
                     {status.label}
                  </span>
               )}

               <div className="absolute top-2 right-1 flex items-center">
                  {!n.isRead && (
                     <button
                        onClick={onMarkRead}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs whitespace-nowrap hover:bg-gray-200"
                     >
                        Mark read
                     </button>
                  )}
                  <button
                     onClick={onDelete}
                     aria-label="Delete notification"
                     className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
                  >
                     <X className="h-3.5 w-3.5" />
                  </button>
               </div>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-black/80">
               {n.message}
            </p>
            <div className="mt-3">
               <Link
                  href={
                     n.relatedEventId
                        ? `/events/${n.relatedEventId}`
                        : "/events"
                  }
                  className="bg-primary inline-flex rounded-md px-2 py-1 text-xs text-white hover:opacity-90"
                  onClick={onCloseDrawer}
               >
                  View Event
               </Link>
            </div>
         </div>
         <div className="flex min-h-[64px] min-w-[96px] items-end gap-1">
            <span className="text-xxs text-muted-foreground absolute right-2 bottom-2">
               {typeof n.createdAt === "string"
                  ? new Date(n.createdAt).toLocaleString()
                  : new Date(n.createdAt).toLocaleString()}
            </span>
         </div>
      </div>
   );
}

export function ProfileVerificationCard({
   notification,
   selected,
   onToggleSelect,
   onMarkRead,
   onDelete,
   onCloseDrawer,
   className,
}: {
   notification: NotificationItem;
   selected: boolean;
   onToggleSelect: () => void;
   onMarkRead: () => void;
   onDelete: () => void;
   onCloseDrawer: () => void;
   className?: string;
}) {
   const getStatusFromType = (type: NotificationType) => {
      switch (type) {
         case "VERIFICATION_APPROVED":
            return {
               label: "Approved",
               color: "bg-emerald-100 text-emerald-700",
            };
         case "VERIFICATION_REJECTED":
            return { label: "Rejected", color: "bg-rose-100 text-rose-700" };
         case "VERIFICATION_REQUEST":
            return { label: "Pending", color: "bg-amber-100 text-amber-800" };
         default:
            return { label: undefined, color: "" };
      }
   };

   const n = notification;
   const status = getStatusFromType(n.type);

   return (
      <div
         className={cn(
            "relative flex items-start justify-between gap-2",
            className
         )}
      >
         <div className="pt-[0.5px]">
            <input
               type="checkbox"
               className="h-3 w-3 rounded border-white/15"
               checked={selected}
               onChange={onToggleSelect}
               aria-label="Select notification"
            />
         </div>
         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <p className="truncate font-medium">{n.title}</p>
               {status.label && (
                  <span
                     className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        status.color
                     )}
                  >
                     {status.label}
                  </span>
               )}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-black/80">
               {n.message}
            </p>
            <div className="mt-3">
               <Link
                  href="/profile"
                  className="bg-primary inline-flex rounded-md px-2 py-1 text-xs text-white hover:opacity-90"
                  onClick={onCloseDrawer}
               >
                  View Profile
               </Link>
            </div>
         </div>
         <div className="flex min-h-[64px] min-w-[96px] items-end gap-1">
            <span className="text-xxs text-muted-foreground absolute right-2 bottom-2">
               {typeof n.createdAt === "string"
                  ? new Date(n.createdAt).toLocaleString()
                  : new Date(n.createdAt).toLocaleString()}
            </span>
         </div>

         <div className="absolute top-2 right-1 flex items-center">
            {!n.isRead && (
               <button
                  onClick={onMarkRead}
                  className="rounded-md bg-gray-100 px-2 py-1 text-xs whitespace-nowrap hover:bg-gray-200"
               >
                  Mark read
               </button>
            )}
            <button
               onClick={onDelete}
               aria-label="Delete notification"
               className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
            >
               <X className="h-3.5 w-3.5" />
            </button>
         </div>
      </div>
   );
}
