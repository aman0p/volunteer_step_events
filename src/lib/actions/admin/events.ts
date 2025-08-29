"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { 
  broadcastNewEventNotification, 
  notifyEnrolledVolunteersOnEventUpdate,
  notifyEnrolledVolunteersOnEventDeletion 
} from "@/lib/actions/admin/notifications";
import type { Prisma } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

export const createEvent = async (params: Prisma.EventCreateInput) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    const newEvent = await prisma.event.create({
      data: {
        ...params,
        createdById: session.user.id,
      },
    });

    // Broadcast to volunteers that a new event has been added
    await broadcastNewEventNotification(newEvent.id);

    // Ensure the admin events page shows the newly created event
    revalidatePath("/admin/events");

    return {
      success: true,
      data: newEvent,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the event",
    };
  }
};

export const updateEvent = async (id: string, params: Prisma.EventUpdateInput) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Ensure owner is updating their own event
    const event = await prisma.event.findUnique({
      where: { id },
      select: { createdById: true },
    });
    if (!event) {
      return { success: false, message: "Event not found" };
    }
    if (event.createdById !== session.user.id) {
      return { success: false, message: "You can only update your own events" };
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...params,
      },
    });

    // Notify all enrolled volunteers about the event update
    await notifyEnrolledVolunteersOnEventUpdate(id);

    // Ensure lists and detail pages refresh
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating the event",
    };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }
    // Get event details before deletion for notification
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true, createdById: true }
    });

    if (!event) {
      return {
        success: false,
        message: "Event not found",
      };
    }

    if (event.createdById !== session.user.id) {
      return { success: false, message: "You can only delete your own events" };
    }

    // Notify all enrolled volunteers about the event deletion
    await notifyEnrolledVolunteersOnEventDeletion(eventId, event.title);

    // Delete the event (this will cascade delete enrollments)
    await prisma.event.delete({
      where: { id: eventId },
    });

    // Ensure lists refresh
    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while deleting the event",
    };
  }
};