"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NotificationBell } from "@/components/ui/notification";
import { cn } from "@/lib/utils";
import { EventNotificationCard, ProfileVerificationCard } from "@/components/ui/notification-card";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationDrawer({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const {
    isPending,
    notifications,
    unreadCount,
    selectedIds,
    isAllSelected,
    loadNotifications,
    handleMarkOne,
    handleDelete,
    toggleSelect,
    toggleSelectAll,
    handleBulkMarkRead,
    handleBulkDelete,
  } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open, loadNotifications]);

  const hasItems = notifications.length > 0;

  return (
    <div className={cn("relative z-50", className)}>
      <button onClick={() => setOpen(true)} aria-label="Open notifications">
        <NotificationBell count={unreadCount} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            className="fixed right-0 top-0 h-full w-[92%] sm:w-[460px] rounded-l-3xl z-50 bg-white/50 backdrop-blur-md dark:bg-neutral-950 shadow-xl border-l border-white/15"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-2 pt-5.5 border-b border-white/15">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="flex items-center gap-2">
                {hasItems && (
                  <>
                    <button
                      onClick={toggleSelectAll}
                      className="text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                      {isAllSelected ? "Deselect all" : "Select all"}
                    </button>
                    {selectedIds.size > 0 && (
                      <>
                        <button
                          onClick={handleBulkMarkRead}
                          disabled={isPending}
                          className="hidden sm:inline text-xs px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          Mark as read
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          disabled={isPending}
                          className="text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm px-2 py-1 rounded-md hover:bg-gray-100"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="h-full overflow-y-auto p-3">
              {!hasItems && (
                <div className="text-sm text-muted-foreground py-10 text-center">
                  You have no notifications.
                </div>
              )}

              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <motion.li
                      key={n.id}
                      className={cn(
                        "rounded-md border border-white/15 p-3 relative",
                        !n.isRead ? "bg-white/50 dark:bg-neutral-900" : "bg-white/15"
                      )}
                      initial={{ opacity: 0, x: 24, height: 0, marginTop: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto", marginTop: 8, marginBottom: 8 }}
                      exit={{ opacity: 0, x: 80, height: 0, marginTop: 0, marginBottom: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 36, opacity: { duration: 0.15 } }}
                    >
                      {n.type.startsWith("VERIFICATION_") ? (
                        <ProfileVerificationCard
                          notification={n}
                          selected={selectedIds.has(n.id)}
                          onToggleSelect={() => toggleSelect(n.id)}
                          onMarkRead={() => handleMarkOne(n.id)}
                          onDelete={() => handleDelete(n.id)}
                          onCloseDrawer={() => setOpen(false)}
                        />
                      ) : (
                        <EventNotificationCard
                          notification={n}
                          selected={selectedIds.has(n.id)}
                          onToggleSelect={() => toggleSelect(n.id)}
                          onMarkRead={() => handleMarkOne(n.id)}
                          onDelete={() => handleDelete(n.id)}
                          onCloseDrawer={() => setOpen(false)}
                        />
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}