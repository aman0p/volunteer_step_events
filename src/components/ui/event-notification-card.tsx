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
        return { label: "Approved", color: "bg-emerald-100 text-emerald-700" };
      case "ENROLLMENT_REJECTED":
        return { label: "Rejected", color: "bg-rose-100 text-rose-700" };
      case "ENROLLMENT_WAITLISTED":
        return { label: "Waitlisted", color: "bg-amber-100 text-amber-800" };
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
          className="w-3 h-3 rounded border-white/15"
          checked={selected}
          onChange={onToggleSelect}
          aria-label="Select notification"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{n.title}</p>
          {status.label && (
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", status.color)}>
              {status.label}
            </span>
          )}

          <div className="absolute top-2 right-1 flex items-center">
            {!n.isRead && (
              <button
                onClick={onMarkRead}
                className="text-xs whitespace-nowrap px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onDelete}
              aria-label="Delete notification"
              className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-black/80 line-clamp-2">{n.message}</p>
        <div className="mt-3">
          <Link
            href={n.relatedEventId ? `/events/${n.relatedEventId}` : "/events"}
            className="text-xs px-2 py-1 rounded-md bg-primary text-white hover:opacity-90 inline-flex"
            onClick={onCloseDrawer}
          >
            View Event
          </Link>
        </div>
      </div>
      <div className="flex items-end gap-1 min-w-[96px] min-h-[64px]">
        <span className="absolute bottom-2 right-2 text-xxs text-muted-foreground">
          {typeof n.createdAt === "string"
            ? new Date(n.createdAt).toLocaleString()
            : new Date(n.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default EventNotificationCard;


