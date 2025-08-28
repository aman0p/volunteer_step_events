import { Gender, GovId } from "@/generated/prisma";
import type { NotificationType, EnrollmentStatus } from "@/types";
import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().lowercase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.nativeEnum(Gender),
});

export const signInSchema = z.object({
  email: z.string().lowercase().email(),
  password: z.string().min(8),
});

export const eventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    dressCode: z.string().min(2, "Dress code must be at least 2 characters"),
    coverUrl: z.string().min(1, "Cover URL is required"),
    // Accept hex color like #RRGGBB
    color: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6})$/, "Color must be a 6-digit hex like #A1B2C3"),
    videoUrl: z.string().optional(),
    eventImages: z.array(z.string()).min(1, "At least one event image is required"),
    category: z
      .array(z.string().trim().min(1))
      .min(1, "At least one category is required")
      .max(3, "You can add up to 3 categories only"),
    maxVolunteers: z.number().int("Max volunteers must be an integer").positive("Max volunteers must be positive").optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Profile update schema for user self-service editing
export const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  gender: z.nativeEnum(Gender),
  profileImage: z.string().min(1, "Profile image is required"),
  skills: z.array(z.string().trim().min(1)).max(10).optional(),
  govIdType: z.nativeEnum(GovId),
  govIdImage: z.string().nonempty("Govt. ID is required"),
});

// Notification schemas
export const notificationTypeSchema = z.custom<NotificationType>((val) => {
  return (
    typeof val === "string" &&
    [
      "ENROLLMENT_APPLICATION",
      "ENROLLMENT_APPROVED",
      "ENROLLMENT_REJECTED",
      "ENROLLMENT_WAITLISTED",
      "ENROLLMENT_CANCELLED",
      "ENROLLMENT_SELF_CANCELLED",
      "NEW_EVENT_ADDED",
      "EVENT_UPDATE",
      "EVENT_REMINDER",
      "SYSTEM_MESSAGE",
    ].includes(val)
  );
}, { message: "Invalid notification type" });

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: notificationTypeSchema,
  relatedEventId: z.string().uuid().optional(),
  relatedEnrollmentId: z.string().uuid().optional(),
});

export const enrollmentStatusSchema = z.custom<EnrollmentStatus>((val) => {
  return (
    typeof val === "string" &&
    ["PENDING", "APPROVED", "REJECTED", "WAITLISTED", "CANCELLED"].includes(val)
  );
}, { message: "Invalid enrollment status" });

