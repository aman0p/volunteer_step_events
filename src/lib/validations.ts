import { Gender, GovId } from "@/generated/prisma";
import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  gender: z.nativeEnum(Gender),
  govIdType: z.nativeEnum(GovId),
  govIdImage: z.string().nonempty("Govt. ID is required"),
  profileImage: z.string().nonempty("Profile image is required"),
});

export const signInSchema = z.object({
  email: z.string().email(),
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
});

