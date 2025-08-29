"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NotificationType, Status } from "@/generated/prisma";

export const getAdminNotifications = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" } as const;
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "ORGANIZER") {
    return { success: false, message: "Unauthorized" } as const;
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
    console.error("getAdminNotifications error", error);
    return { success: false, message: "Failed to fetch notifications" } as const;
  }
};

export const markAdminNotificationRead = async (notificationId: string) => {
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
    console.error("markAdminNotificationRead error", error);
    return { success: false, message: "Failed to mark as read" } as const;
  }
};

export const markAllAdminNotificationsRead = async () => {
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
    console.error("markAllAdminNotificationsRead error", error);
    return { success: false, message: "Failed to mark all as read" } as const;
  }
};

export const notifyAdminsOnEnrollmentApplication = async (
  params: { eventId: string; enrollmentId: string; applicantName?: string }
) => {
  try {
    // Notify only the event owner
    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
      select: { createdById: true },
    });

    if (!event?.createdById) return { success: true } as const;

    await prisma.notification.create({
      data: {
        userId: event.createdById,
        type: NotificationType.ENROLLMENT_APPLICATION,
        title: "New Enrollment Application",
        message: params.applicantName
          ? `${params.applicantName} applied to your event.`
          : "A user applied to your event.",
        relatedEventId: params.eventId,
        relatedEnrollmentId: params.enrollmentId,
      },
    });

    return { success: true } as const;
  } catch (error) {
    console.error("notifyAdminsOnEnrollmentApplication error", error);
    return { success: false, message: "Failed to notify admins" } as const;
  }
};

export const notifyUserOnEnrollmentStatusChange = async (
  params: { userId: string; eventId: string; enrollmentId: string; status: Status }
) => {
  try {
    const typeMap: Record<Status, NotificationType> = {
      APPROVED: NotificationType.ENROLLMENT_APPROVED,
      REJECTED: NotificationType.ENROLLMENT_REJECTED,
      WAITLISTED: NotificationType.ENROLLMENT_WAITLISTED,
      CANCELLED: NotificationType.ENROLLMENT_CANCELLED,
      PENDING: NotificationType.ENROLLMENT_APPLICATION,
    } as const;

    const type = typeMap[params.status];

    // Fetch human-friendly event title instead of showing event id
    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
      select: { title: true },
    });
    const eventTitle = event?.title ?? "the event";

    await prisma.notification.create({
      data: {
        userId: params.userId,
        type,
        title: "Enrollment Update",
        message: `Your enrollment status for ${eventTitle} is ${params.status.toLowerCase()}.`,
        relatedEventId: params.eventId,
        relatedEnrollmentId: params.enrollmentId,
      },
    });

    return { success: true } as const;
  } catch (error) {
    console.error("notifyUserOnEnrollmentStatusChange error", error);
    return { success: false, message: "Failed to notify user" } as const;
  }
};

export const broadcastNewEventNotification = async (eventId: string) => {
  try {
    const volunteers = await prisma.user.findMany({
      where: { role: "VOLUNTEER" },
      select: { id: true },
    });

    if (volunteers.length === 0) return { success: true } as const;

    await prisma.notification.createMany({
      data: volunteers.map((u) => ({
        userId: u.id,
        type: NotificationType.NEW_EVENT_ADDED,
        title: "New Event Added",
        message: "A new event has been added. Check it out!",
        relatedEventId: eventId,
      })),
    });

    return { success: true } as const;
  } catch (error) {
    console.error("broadcastNewEventNotification error", error);
    return { success: false, message: "Failed to broadcast new event" } as const;
  }
};

export const notifyUserOnVerificationStatusChange = async (
  params: { userId: string; status: "APPROVED" | "REJECTED" }
) => {
  try {
    const typeMap: Record<"APPROVED" | "REJECTED", NotificationType> = {
      APPROVED: NotificationType.VERIFICATION_APPROVED,
      REJECTED: NotificationType.VERIFICATION_REJECTED,
    } as const;

    const type = typeMap[params.status];
    const title = params.status === "APPROVED" ? "Verification Approved" : "Verification Rejected";
    const message = params.status === "APPROVED" 
      ? "Congratulations! Your account has been verified. You can now enroll in events as a volunteer."
      : "Your verification request was rejected. Please check with admin for details or submit a new request.";

    await prisma.notification.create({
      data: {
        userId: params.userId,
        type,
        title,
        message,
      },
    });

    return { success: true } as const;
  } catch (error) {
    console.error("notifyUserOnVerificationStatusChange error", error);
    return { success: false, message: "Failed to notify user" } as const;
  }
};

export const notifyEnrolledVolunteersOnEventUpdate = async (eventId: string) => {
  try {
    // Get all enrolled volunteers for this event
    const enrollments = await prisma.enrollment.findMany({
      where: { 
        eventId,
        status: { in: ['APPROVED', 'WAITLISTED', 'PENDING'] } // Only notify active enrollments
      },
      include: {
        user: { select: { id: true } },
        event: { select: { title: true } }
      }
    });

    if (enrollments.length === 0) return { success: true } as const;

    const eventTitle = enrollments[0]?.event.title ?? "the event";

    await prisma.notification.createMany({
      data: enrollments.map((enrollment) => ({
        userId: enrollment.user.id,
        type: NotificationType.EVENT_UPDATE,
        title: "Event Updated",
        message: `The event "${eventTitle}" has been updated. Please check the latest details.`,
        relatedEventId: eventId,
      })),
    });

    return { success: true } as const;
  } catch (error) {
    console.error("notifyEnrolledVolunteersOnEventUpdate error", error);
    return { success: false, message: "Failed to notify volunteers" } as const;
  }
};

export const notifyEnrolledVolunteersOnEventDeletion = async (eventId: string, eventTitle: string) => {
  try {
    // Get all enrolled volunteers for this event
    const enrollments = await prisma.enrollment.findMany({
      where: { 
        eventId,
        status: { in: ['APPROVED', 'WAITLISTED', 'PENDING'] } // Only notify active enrollments
      },
      include: {
        user: { select: { id: true } }
      }
    });

    if (enrollments.length === 0) return { success: true } as const;

    await prisma.notification.createMany({
      data: enrollments.map((enrollment) => ({
        userId: enrollment.user.id,
        type: NotificationType.SYSTEM_MESSAGE,
        title: "Event Cancelled",
        message: `The event "${eventTitle}" has been cancelled and removed from the platform.`,
        relatedEventId: eventId,
      })),
    });

    return { success: true } as const;
  } catch (error) {
    console.error("notifyEnrolledVolunteersOnEventDeletion error", error);
    return { success: false, message: "Failed to notify volunteers" } as const;
  }
};


