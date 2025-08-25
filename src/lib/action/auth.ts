"use server";

import { hash } from "bcryptjs";
import { prisma } from "../prisma";
import { AuthCredentials } from "@/types";
import { Gender, GovId, Role } from "@/generated/prisma";
import { compare } from "bcryptjs";
import { headers } from "next/headers";
import { ratelimit } from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

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
            where: { email }
        });

        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid password"
            };
        }

        // If credentials are valid, return success
        // The actual session creation will be handled by NextAuth when the form redirects
        return {
            success: true,
            message: "Signin successful"
        };
    } catch (error) {
        console.log(error, "Signin error");
        return {
            success: false,
            message: "Signin failed"
        };
    }
}

export const signUpWithCredentials = async (params: AuthCredentials) => {
    const { fullName, email, password, phoneNumber, address, gender, govIdType, govIdImage, profileImage } = params;

    // ********* Upstash Redis - Rate Limit *********
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) return redirect("/too-fast");


    // 1. Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return {
            success: false,
            message: "User already exists"
        }
    }

    // 2. Hash password
    const hashedPassword = await hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                phoneNumber: phoneNumber,
                profileImage: profileImage || "",
                address: address,
                gender: gender as Gender,
                govIdType: govIdType as GovId,
                govIdImage: govIdImage || "",
                role: Role.VOLUNTEER
            }
        })

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
            body: {
              email,
              fullName,
            },
          });

        // await signInWithCredentials({email, password})

        return {
            success: true,
            message: "User created successfully"
        }
    } catch (error) {
        console.log(error, "Signup error");
        return {
            success: false,
            message: "Signup failed"
        }
    }
}
