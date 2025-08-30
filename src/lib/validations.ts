import { Gender, GovId } from "@/generated/prisma";
import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name must only contain letters and spaces"),

  email: z
    .string()
    .toLowerCase()
    .email()
    .max(100, "Email must be less than 100 characters")
    .superRefine((val, ctx) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address",
        });
      }
    }),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
    .regex(/^\S+$/, "Password cannot contain spaces"),

  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Phone number must be between 10–15 digits"),

  gender: z.nativeEnum(Gender),
});

export const signInSchema = z.object({
  email: z.string().toLowerCase().email(),
  password: z.string().min(8),
});

export const eventSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    dressCode: z.string().min(2, "Dress code must be at least 2 characters"),

    // coverUrl: z.string().url("Cover URL must be a valid URL"),
    // videoUrl: z.string().url("Video URL must be a valid URL").optional(),
    // eventImages: z.array(z.string().url("Each image must be a valid URL")),

    coverUrl: z.string().min(1, "Cover URL is required"),
    videoUrl: z.string().optional(),
    eventImages: z.array(z.string()),

    category: z
      .array(z.string().trim().min(1))
      .min(1, "At least one category is required")
      .max(3, "You can add up to 3 categories only"),
    maxVolunteers: z
      .number()
      .int("Max volunteers must be an integer")
      .positive("Max volunteers must be positive")
      .optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .refine((data) => data.startDate >= new Date(), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be between 10–15 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  gender: z.nativeEnum(Gender),

  profileImage: z.string().min(1, "Profile image is required"),
  // profileImage: z.string().url("Profile image must be a valid URL"),

  skills: z.array(z.string().trim().min(2, "Each skill must be at least 2 characters")).max(10).optional(),
  govIdType: z.nativeEnum(GovId),

  govIdImage: z.string().nonempty("Govt. ID is required"),
  // govIdImage: z.string().url("Govt. ID must be a valid URL"),
});

export const notificationTypeSchema = z.enum([
  // Enrollment related
  "ENROLLMENT_APPLICATION",
  "ENROLLMENT_APPROVED",
  "ENROLLMENT_REJECTED",
  "ENROLLMENT_WAITLISTED",
  "ENROLLMENT_CANCELLED",
  "ENROLLMENT_SELF_CANCELLED",
  // Event related
  "NEW_EVENT_ADDED",
  "EVENT_UPDATE",
  "EVENT_REMINDER",
  // Verification related
  "VERIFICATION_REQUEST",
  "VERIFICATION_APPROVED",
  "VERIFICATION_REJECTED",
  // General
  "SYSTEM_MESSAGE",
]);

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: notificationTypeSchema,
  relatedEventId: z.string().uuid().optional(),
  relatedEnrollmentId: z.string().uuid().optional(),
});

export const enrollmentStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "WAITLISTED",
  "CANCELLED",
]);
