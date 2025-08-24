import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  govIdType: z.enum(["AADHAR_CARD", "PASSPORT", "DRIVING_LICENSE", "PAN_CARD"]),
  govIdImage: z.string().nonempty("Govt. ID is required"),
  profileImage: z.string().nonempty("Profile image is required"),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});