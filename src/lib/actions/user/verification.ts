"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const submitVerificationRequest = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  try {
    // Check if user already has a pending verification request
    const existingRequest = await prisma.verificationRequest.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING"
      }
    });

    if (existingRequest) {
      return { success: false, message: "You already have a pending verification request" };
    }

    // Check if user is already verified
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isVerified: true }
    });

    if (user?.isVerified) {
      return { success: false, message: "Your account is already verified" };
    }

    // Create verification request
    await prisma.verificationRequest.create({
      data: {
        userId: session.user.id,
        status: "PENDING"
      }
    });

    revalidatePath("/profile");
    return { success: true, message: "Verification request submitted successfully" };
  } catch (error) {
    console.error("Verification request error:", error);
    return { success: false, message: "Failed to submit verification request" };
  }
};

export const getVerificationStatus = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        isVerified: true,
        verificationRequests: {
          orderBy: { submittedAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      isVerified: user.isVerified,
      latestRequest: user.verificationRequests[0] || null
    };
  } catch (error) {
    console.error("Get verification status error:", error);
    return { success: false, message: "Failed to get verification status" };
  }
};
