"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getMyNotifications = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" } as const;
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: session.user.id, isRead: false },
    });
    return { success: true, data: { notifications, unreadCount } } as const;
  } catch (error) {
    console.error("getMyNotifications error", error);
    return { success: false, message: "Failed to fetch notifications" } as const;
  }
};

export const markMyNotificationRead = async (notificationId: string) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" } as const;
  }

  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return { success: true, message: "Marked as read" } as const;
  } catch (error) {
    console.error("markMyNotificationRead error", error);
    return { success: false, message: "Failed to mark as read" } as const;
  }
};

export const markAllMyNotificationsRead = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" } as const;
  }

  try {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
    return { success: true, message: "All marked as read" } as const;
  } catch (error) {
    console.error("markAllMyNotificationsRead error", error);
    return { success: false, message: "Failed to mark all as read" } as const;
  }
};


