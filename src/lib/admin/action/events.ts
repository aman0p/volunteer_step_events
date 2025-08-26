"use server";

import { prisma } from "@/lib/prisma";
import { EventParams } from "@/types";
import { revalidatePath } from "next/cache";

export const createEvent = async (params: EventParams) => {
  try {
    const newEvent = await prisma.event.create({
      data: {
        ...params,
      },
    });

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
