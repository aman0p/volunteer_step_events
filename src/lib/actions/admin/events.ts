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
import type { EventParams } from "@/types";
import { revalidatePath } from "next/cache";

export const createEvent = async (params: EventParams) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Validate event roles if provided
    if (params.eventRoles && params.eventRoles.length > 0) {
      // Check for duplicate role names
      const roleNames = params.eventRoles.map(role => role.name.trim().toLowerCase());
      const uniqueNames = new Set(roleNames);
      if (uniqueNames.size !== roleNames.length) {
        return { success: false, message: "Role names must be unique" };
      }

      // Validate individual role fields
      for (const role of params.eventRoles) {
        if (!role.name.trim()) {
          return { success: false, message: "Role name is required for all roles" };
        }
        if (!role.description.trim() || role.description.length < 3) {
          return { success: false, message: "Role description must be at least 3 characters" };
        }
        if (role.payout < 0 || role.payout > 1000000) {
          return { success: false, message: "Payout must be between ₹0 and ₹10,00,000" };
        }
        if (role.maxCount < 1 || role.maxCount > 100) {
          return { success: false, message: "Max volunteers must be between 1 and 100" };
        }
      }
    }

    // Map incoming params to Prisma create shape
    const data: Prisma.EventUncheckedCreateInput = {
      title: params.title,
      description: params.description,
      location: params.location,
      startDate: params.startDate,
      endDate: params.endDate,
      dressCode: params.dressCode,
      category: params.category,
      coverUrl: params.coverUrl,
      videoUrl: params.videoUrl ?? null,
      eventImages: params.eventImages,
      maxVolunteers: params.maxVolunteers ?? null,
      createdAt: params.createdAt ?? new Date(),
      // updatedAt will be set automatically by Prisma @updatedAt
      createdById: session.user.id,
      // id is auto-generated
    };

    const newEvent = await prisma.event.create({ data });

    // Create event roles if provided
    if (params.eventRoles && params.eventRoles.length > 0) {
      await prisma.eventRole.createMany({
        data: params.eventRoles.map(role => ({
          name: role.name.trim(),
          description: role.description.trim(),
          payout: role.payout,
          maxCount: role.maxCount,
          eventId: newEvent.id,
        }))
      });
    }

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

export const updateEvent = async (id: string, params: EventParams) => {
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

    // Validate event roles if provided
    if (params.eventRoles !== undefined) {
      if (params.eventRoles.length > 0) {
        // Check for duplicate role names
        const roleNames = params.eventRoles.map(role => role.name.trim().toLowerCase());
        const uniqueNames = new Set(roleNames);
        if (uniqueNames.size !== roleNames.length) {
          return { success: false, message: "Role names must be unique" };
        }

        // Validate individual role fields
        for (const role of params.eventRoles) {
          if (!role.name.trim()) {
            return { success: false, message: "Role name is required for all roles" };
          }
          if (!role.description.trim() || role.description.length < 10) {
            return { success: false, message: "Role description must be at least 10 characters" };
          }
          if (role.payout < 0 || role.payout > 100000) {
            return { success: false, message: "Payout must be between ₹0 and ₹1,00,000" };
          }
          if (role.maxCount < 1 || role.maxCount > 100) {
            return { success: false, message: "Max volunteers must be between 1 and 100" };
          }
        }
      }
    }

    const updateData: Prisma.EventUpdateInput = {
      title: params.title,
      description: params.description,
      location: params.location,
      startDate: params.startDate,
      endDate: params.endDate,
      dressCode: params.dressCode,
      category: params.category,
      coverUrl: params.coverUrl,
      videoUrl: params.videoUrl ?? null,
      eventImages: params.eventImages,
      maxVolunteers: params.maxVolunteers ?? null,
      // Do not allow changing createdById/createdAt via update
    };

    const updated = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    // Update event roles if provided
    if (params.eventRoles !== undefined) {
      // Delete existing roles
      await prisma.eventRole.deleteMany({
        where: { eventId: id }
      });

      // Create new roles
      if (params.eventRoles.length > 0) {
        await prisma.eventRole.createMany({
          data: params.eventRoles.map(role => ({
            name: role.name.trim(),
            description: role.description.trim(),
            payout: role.payout,
            maxCount: role.maxCount,
            eventId: id,
          }))
        });
      }
    }

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

    // Remove related enrollments first to satisfy FK constraints
    await prisma.enrollment.deleteMany({ where: { eventId } });

    // Delete the event
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