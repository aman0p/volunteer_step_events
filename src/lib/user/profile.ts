"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/auth";
import { profileSchema } from "@/lib/validations";

export const updateCurrentUserProfile = async (formData: unknown) => {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const parse = profileSchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0]?.message || "Invalid data" };
  }

  const { fullName, phoneNumber, address, gender, profileImage, skills } = parse.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName,
        phoneNumber,
        address,
        gender,
        profileImage,
        ...(skills ? { skills } : {}),
      },
    });
    return { success: true, message: "Profile updated" };
  } catch (error) {
    console.error("update profile error", error);
    return { success: false, message: "Failed to update profile" };
  }
};

export const getCurrentUserProfile = async () => {
  const session = (await getServerSession(authOptions as any)) as Session | null;
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized", data: null } as const;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        fullName: true,
        phoneNumber: true,
        address: true,
        gender: true,
        profileImage: true,
        skills: true,
        role: true,
      },
    });

    if (!user) {
      return { success: false, message: "User not found", data: null } as const;
    }

    return { success: true, message: "OK", data: user } as const;
  } catch (error) {
    console.error("get profile error", error);
    return { success: false, message: "Failed to fetch profile", data: null } as const;
  }
};


