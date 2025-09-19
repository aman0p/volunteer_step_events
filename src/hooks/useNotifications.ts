"use client";

import { useCallback, useEffect, useState, useTransition, useRef } from "react";
import {
   getMyNotifications,
   markAllMyNotificationsRead,
   markMyNotificationRead,
} from "@/lib/actions/user/notifications";
import { deleteMyNotification } from "@/lib/actions/user/notifications";
import { NotificationType } from "@/generated/prisma";

export type NotificationItem = {
   id: string;
   title: string;
   message: string;
   type: NotificationType;
   isRead: boolean;
   createdAt: string | Date;
   relatedEventId?: string | null;
};

type FetchResult =
   | {
        success: true;
        data: { notifications: NotificationItem[]; unreadCount: number };
     }
   | { success: false; message: string };

export function useNotifications() {
   const [isPending, startTransition] = useTransition();
   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
   const [unreadCount, setUnreadCount] = useState(0);
   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
   const [isInitialized, setIsInitialized] = useState(false);
   const lastFetchTime = useRef<number>(0);
   const FETCH_COOLDOWN = 5000; // 5 seconds cooldown between fetches
   const CACHE_DURATION = 30000; // 30 seconds cache duration

   const loadNotifications = useCallback(
      (force = false) => {
         const now = Date.now();

         // Check if we have cached data that's still fresh
         if (
            !force &&
            isInitialized &&
            now - lastFetchTime.current < CACHE_DURATION
         ) {
            return;
         }

         // Prevent too frequent requests unless forced
         if (!force && now - lastFetchTime.current < FETCH_COOLDOWN) {
            return;
         }

         startTransition(async () => {
            try {
               const res = (await getMyNotifications()) as FetchResult;
               if (res.success) {
                  setNotifications(res.data.notifications);
                  setUnreadCount(res.data.unreadCount);
                  lastFetchTime.current = now;
                  setIsInitialized(true);

                  // Cache the data in localStorage for browser refresh
                  try {
                     localStorage.setItem(
                        "notifications_cache",
                        JSON.stringify({
                           notifications: res.data.notifications,
                           unreadCount: res.data.unreadCount,
                           timestamp: now,
                        })
                     );
                  } catch {
                     // Ignore localStorage errors
                  }
               }
            } catch (error) {
               console.error("Failed to load notifications:", error);
            }
         });
      },
      [isInitialized]
   );

   // Load notifications on mount, first try cache, then fetch if needed
   useEffect(() => {
      if (!isInitialized) {
         // Try to load from cache first
         try {
            const cached = localStorage.getItem("notifications_cache");
            if (cached) {
               const {
                  notifications: cachedNotifications,
                  unreadCount: cachedUnreadCount,
                  timestamp,
               } = JSON.parse(cached);
               const now = Date.now();

               // If cache is still fresh (less than 5 minutes old), use it
               if (now - timestamp < 300000) {
                  // 5 minutes
                  setNotifications(cachedNotifications);
                  setUnreadCount(cachedUnreadCount);
                  lastFetchTime.current = timestamp;
                  setIsInitialized(true);
                  return;
               }
            }
         } catch {
            // Ignore cache errors and proceed to fetch
         }

         // If no cache or cache is stale, fetch fresh data
         loadNotifications(true);
      }
   }, [isInitialized, loadNotifications]);

   const handleMarkAll = useCallback(() => {
      startTransition(async () => {
         const res = await markAllMyNotificationsRead();
         if (res?.success) {
            setNotifications((prev) =>
               prev.map((n) => ({ ...n, isRead: true }))
            );
            setUnreadCount(0);
         }
      });
   }, []);

   const handleMarkOne = useCallback((id: string) => {
      startTransition(async () => {
         const res = await markMyNotificationRead(id);
         if (res?.success) {
            setNotifications((prev) =>
               prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((c) => Math.max(0, c - 1));
         }
      });
   }, []);

   const handleDelete = useCallback((id: string) => {
      startTransition(async () => {
         const res = await deleteMyNotification(id);
         if (res?.success) {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            setUnreadCount((c) => Math.max(0, c - 1));
            setSelectedIds((prev) => {
               const next = new Set(prev);
               next.delete(id);
               return next;
            });
         }
      });
   }, []);

   const toggleSelect = useCallback((id: string) => {
      setSelectedIds((prev) => {
         const next = new Set(prev);
         if (next.has(id)) next.delete(id);
         else next.add(id);
         return next;
      });
   }, []);

   const isAllSelected =
      notifications.length > 0 && selectedIds.size === notifications.length;

   const toggleSelectAll = useCallback(() => {
      setSelectedIds(() => {
         if (isAllSelected) return new Set();
         return new Set(notifications.map((n) => n.id));
      });
   }, [isAllSelected, notifications]);

   const handleBulkMarkRead = useCallback(() => {
      const idsToMark = notifications
         .filter((n) => selectedIds.has(n.id) && !n.isRead)
         .map((n) => n.id);
      if (idsToMark.length === 0) return;
      startTransition(async () => {
         await Promise.all(idsToMark.map((id) => markMyNotificationRead(id)));
         setNotifications((prev) =>
            prev.map((n) =>
               idsToMark.includes(n.id) ? { ...n, isRead: true } : n
            )
         );
         setUnreadCount((c) => Math.max(0, c - idsToMark.length));
         setSelectedIds(new Set());
      });
   }, [notifications, selectedIds]);

   const handleBulkDelete = useCallback(() => {
      const idsToDelete = notifications
         .filter((n) => selectedIds.has(n.id))
         .map((n) => n.id);
      if (idsToDelete.length === 0) return;
      const unreadBeingDeleted = notifications.filter(
         (n) => selectedIds.has(n.id) && !n.isRead
      ).length;
      startTransition(async () => {
         await Promise.all(idsToDelete.map((id) => deleteMyNotification(id)));
         setNotifications((prev) =>
            prev.filter((n) => !idsToDelete.includes(n.id))
         );
         setUnreadCount((c) => Math.max(0, c - unreadBeingDeleted));
         setSelectedIds(new Set());
      });
   }, [notifications, selectedIds]);

   // Force refresh function for manual refresh
   const refreshNotifications = useCallback(() => {
      loadNotifications(true);
   }, [loadNotifications]);

   return {
      // state
      isPending,
      notifications,
      unreadCount,
      selectedIds,
      isAllSelected,
      isInitialized,
      // actions
      loadNotifications: refreshNotifications, // Expose refresh function
      handleMarkAll,
      handleMarkOne,
      handleDelete,
      toggleSelect,
      toggleSelectAll,
      handleBulkMarkRead,
      handleBulkDelete,
   } as const;
}

export default useNotifications;
