"use server";

import { prisma } from "../prisma";
import { AuthCredentials } from "@/types";
import { compare, hash } from "bcryptjs";
import { headers } from "next/headers";
import { ratelimit } from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";
import { GovId, Role } from "@/generated/prisma";

export const signInWithCredentials = async (
   params: Pick<AuthCredentials, "email" | "password">
) => {
   try {
      const { email, password } = params;

      // ********* Upstash Redis - Rate Limit *********
      const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) return redirect("/too-fast");

      // Find user in database
      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user) {
         return {
            success: false,
            message: "User not found",
         };
      }

      // Verify password
      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
         return {
            success: false,
            message: "Invalid password",
         };
      }

      // If credentials are valid, return success
      // The actual session creation will be handled by NextAuth when the form redirects
      return {
         success: true,
         message: "Signin successful",
      };
   } catch (error) {
      console.error("Signin error:", error);
      return {
         success: false,
         message: "Signin failed",
      };
   }
};

export const signUpWithCredentials = async (params: AuthCredentials) => {
   const {
      fullName,
      email,
      password,
      phoneNumber,
      gender,
      address,
      govIdType,
      govIdImage,
      profileImage,
   } = params;

   // ********* Upstash Redis - Rate Limit *********
   const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
   const { success } = await ratelimit.limit(ip);
   if (!success) return redirect("/too-fast");

   // 1. Check if user already exists by email
   const existingUserByEmail = await prisma.user.findFirst({
      where: {
         email: email,
      },
   });

   if (existingUserByEmail) {
      return {
         success: false,
         error: "User with this email already exists",
      };
   }

   // 2. Check if user already exists by phone number
   const existingUserByPhone = await prisma.user.findFirst({
      where: {
         phoneNumber: phoneNumber,
      },
   });

   if (existingUserByPhone) {
      return {
         success: false,
         error: "User with this phone number already exists",
      };
   }

   try {
      // Hash the password
      const hashedPassword = await hash(password, 12);

      // Create user in database
      await prisma.user.create({
         data: {
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            gender,
            address: address || "",
            govIdType: govIdType || GovId.AADHAR_CARD,
            govIdImage: govIdImage || "",
            profileImage: profileImage || "",
            skills: [], // Initialize with empty skills array
            role: Role.USER,
            isVerified: false,
         },
      });

      // Trigger workflow for email notifications
      await workflowClient.trigger({
         url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
         body: {
            email,
            fullName,
         },
      });

      return {
         success: true,
         message: "User created successfully",
      };
   } catch (error) {
      console.error("Signup error:", error);
      console.error("Error details:", {
         message: error instanceof Error ? error.message : "Unknown error",
         stack: error instanceof Error ? error.stack : undefined,
      });
      return {
         success: false,
         error: error instanceof Error ? error.message : "Signup failed",
      };
   }
};
