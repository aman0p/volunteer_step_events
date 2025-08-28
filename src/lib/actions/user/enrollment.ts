"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifyAdminsOnEnrollmentApplication } from "@/lib/actions/admin/notifications";
import { NotificationType, Status } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

export const requestEnrollment = async (eventId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user is a volunteer
  if (session.user.role !== "VOLUNTEER") {
    return { success: false, message: "Only volunteers can enroll in events" };
  }

  try {
    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { eventId_userId: { eventId, userId: session.user.id } }
    });

    if (existing) {
      return { success: false, message: "Already enrolled in this event" };
    }

    // Check event capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { enrollments: { where: { status: "APPROVED" } } }
    });

    if (!event) {
      return { success: false, message: "Event not found" };
    }

    if (event.maxVolunteers && event.enrollments.length >= event.maxVolunteers) {
      return { success: false, message: "Event is at full capacity" };
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        eventId,
        userId: session.user.id,
        status: "PENDING"
      }
    });

    // Notify admins/organizers
    await notifyAdminsOnEnrollmentApplication({
      eventId,
      enrollmentId: enrollment.id,
      applicantName: session.user.name || undefined,
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Enrollment request sent successfully" };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { success: false, message: "Enrollment failed" };
  }
};

export const cancelEnrollment = async (eventId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user is a volunteer
  if (session.user.role !== "VOLUNTEER") {
    return { success: false, message: "Only volunteers can cancel enrollments" };
  }

  try {
    const existing = await prisma.enrollment.findUnique({
      where: { eventId_userId: { eventId, userId: session.user.id } },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, message: "Enrollment not found" };
    }

    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { status: Status.CANCELLED, cancelledAt: new Date() },
    });

    // Create a self-cancellation notification for the user
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: NotificationType.ENROLLMENT_SELF_CANCELLED,
        title: "Enrollment Cancelled",
        message: "You have cancelled your enrollment.",
        relatedEventId: eventId,
        relatedEnrollmentId: existing.id,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Enrollment cancelled" };
  } catch (error) {
    console.error("Cancel error:", error);
    return { success: false, message: "Failed to cancel enrollment" };
  }
};

export const getUserEnrollmentStatus = async (eventId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user is a volunteer
  if (session.user.role !== "VOLUNTEER") {
    return { success: false, message: "Only volunteers can check enrollment status" };
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { eventId_userId: { eventId, userId: session.user.id } }
    });

    return { 
      success: true, 
      data: enrollment ? enrollment.status : null 
    };
  } catch (error) {
    console.error("Status check error:", error);
    return { success: false, message: "Failed to check enrollment status" };
  }
};