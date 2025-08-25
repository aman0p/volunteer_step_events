"use server";

import { prisma } from "@/lib/prisma";
import { EventParams } from "@/types";

export const createEvent = async (params: EventParams) => {
  try {
    const newEvent = await prisma.event.create({
      data: {
        ...params,
      },
    });

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
