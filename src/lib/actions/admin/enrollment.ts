"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notifyUserOnEnrollmentStatusChange } from "@/lib/actions/admin/notifications";
import { Status } from "@/generated/prisma";

export const approveEnrollment = async (enrollmentId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }
  
  // Check admin role from database instead of session
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
    return { success: false, message: "You are not authorized to approve enrollment" };
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { 
        event: {
          select: {
            maxVolunteers: true,
            enrollments: {
              where: {
                status: "APPROVED"
              },
              select: {
                id: true
              }
            }
          }
        } 
      }
    });

    if (!enrollment) {
      return { success: false, message: "Enrollment not found" };
    }

    // Check capacity
    if (enrollment.event.maxVolunteers) {
      if (enrollment.event.enrollments.length >= enrollment.event.maxVolunteers) {
        return { success: false, message: "Event is at full capacity" };
      }
    }

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: Status.APPROVED }
    });

    await notifyUserOnEnrollmentStatusChange({
      userId: updated.userId,
      eventId: updated.eventId,
      enrollmentId: updated.id,
      status: Status.APPROVED,
    });

    revalidatePath(`/admin/events/${enrollment.eventId}`);
    revalidatePath(`/${enrollment.eventId}`);
    
    return { success: true, message: "Enrollment approved" };
  } catch (error) {
    return { success: false, message: "Failed to approve enrollment" };
  }
};

export const rejectEnrollment = async (enrollmentId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }
  
  // Check admin role from database instead of session
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
    return { success: false, message: "You are not authorized to reject enrollment" };
  }

  try {
    const enrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: Status.REJECTED }
    });

    await notifyUserOnEnrollmentStatusChange({
      userId: enrollment.userId,
      eventId: enrollment.eventId,
      enrollmentId: enrollment.id,
      status: Status.REJECTED,
    });

    revalidatePath(`/admin/events/${enrollment.eventId}`);
    revalidatePath(`/${enrollment.eventId}`);
    
    return { success: true, message: "Enrollment rejected" };
  } catch (error) {
    return { success: false, message: "Failed to reject enrollment" };
  }
};

export const getEventEnrollments = async (eventId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check admin role from database instead of session
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
    return { success: false, message: "You are not authorized to get event enrollments" };
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { eventId },
      include: { 
        user: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
          }
        } 
      },
      orderBy: { enrolledAt: "desc" }
    }); 

    return { success: true, data: enrollments };
  } catch (error) {
    return { success: false, message: "Failed to fetch enrollments" };
  }
};