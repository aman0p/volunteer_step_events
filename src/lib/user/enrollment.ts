"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
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
    await prisma.enrollment.create({
      data: {
        eventId,
        userId: session.user.id,
        status: "PENDING"
      }
    });

    revalidatePath(`/events/${eventId}`);
    return { success: true, message: "Enrollment request sent successfully" };
  } catch (error) {
    console.error("Enrollment error:", error);
    return { success: false, message: "Failed to send enrollment request" };
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
    await prisma.enrollment.delete({
      where: { eventId_userId: { eventId, userId: session.user.id } }
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