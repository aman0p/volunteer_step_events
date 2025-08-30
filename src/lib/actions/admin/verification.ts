"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { notifyUserOnVerificationStatusChange } from "./notifications";

export const getVerificationRequests = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Admin access required" };
  }

  try {
    const requests = await prisma.verificationRequest.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profileImage: true,
            skills: true,
            address: true,
            gender: true,
            govIdType: true,
            govIdImage: true,
            createdAt: true
          }
        }
      },
      orderBy: { submittedAt: 'asc' }
    });

    return { success: true, requests };
  } catch (error) {
    console.error("Get verification requests error:", error);
    return { success: false, message: "Failed to get verification requests" };
  }
};

export const approveVerificationRequest = async (requestId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Admin access required" };
  }

  try {
    // Update verification request
    await prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedById: session.user.id
      }
    });

    // Get the user ID from the request
    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      select: { userId: true }
    });

    if (request) {
      // Update user verification status and upgrade role to VOLUNTEER
      await prisma.user.update({
        where: { id: request.userId },
        data: { 
          isVerified: true,
          role: "VOLUNTEER" // Upgrade from USER to VOLUNTEER
        }
      });

      // Send notification to user about verification approval
      await notifyUserOnVerificationStatusChange({
        userId: request.userId,
        status: "APPROVED"
      });
    }

    revalidatePath("/admin/account-verification");
    revalidatePath("/profile");
    return { success: true, message: "Verification request approved successfully. User role upgraded to Volunteer." };
  } catch (error) {
    console.error("Approve verification error:", error);
    return { success: false, message: "Failed to approve verification request" };
  }
};

export const rejectVerificationRequest = async (requestId: string, rejectionReason?: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Authentication required" };
  }

  try {
    // Update verification request
    await prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        reviewedAt: new Date(),
        reviewedById: session.user.id,
        rejectionReason: rejectionReason || null
      }
    });

    // Get the user ID from the request
    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      select: { userId: true }
    });

    if (request) {
      // Send notification to user about verification rejection
      await notifyUserOnVerificationStatusChange({
        userId: request.userId,
        status: "REJECTED"
      });
    }

    revalidatePath("/admin/account-verification");
    return { success: true, message: "Verification request rejected successfully" };
  } catch (error) {
    console.error("Reject verification error:", error);
    return { success: false, message: "Failed to reject verification request" };
  }
};

export const getVerificationRequestDetails = async (requestId: string) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== "ADMIN") {
    return { success: false, message: "Admin access required" };
  }

  try {
    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            profileImage: true,
            skills: true,
            address: true,
            gender: true,
            govIdType: true,
            govIdImage: true,
            createdAt: true
          }
        },
        reviewedBy: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    if (!request) {
      return { success: false, message: "Verification request not found" };
    }

    return { success: true, request };
  } catch (error) {
    console.error("Get verification request details error:", error);
    return { success: false, message: "Failed to get verification request details" };
  }
};
