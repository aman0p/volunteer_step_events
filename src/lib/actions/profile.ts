"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { profileSchema } from "@/lib/validations";
import { Session } from "next-auth";

export const updateCurrentUserProfile = async (formData: unknown) => {
  const session = await getServerSession(authOptions) as Session | null;
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


