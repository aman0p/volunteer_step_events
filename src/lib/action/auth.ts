"use server";

import { hash } from "bcryptjs";
import { prisma } from "../prisma";
import { AuthCredentials } from "../../../types";
import { Gender, GovId } from "@/generated/prisma";
import { compare } from "bcryptjs";

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">
) => {
    try {
        const { email, password } = params;

        // Find user in database
        const user = await prisma.volunteer.findUnique({
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

    // 1. Check if user already exists
    const existingUser = await prisma.volunteer.findFirst({
        where: {
            email: email
        }
    });

    if(existingUser) {
        return {
            success: false,
            message: "User already exists"
        }
    }

    // 2. Hash password
    const hashedPassword = await hash(password, 10);

    try {
        const newUser = await prisma.volunteer.create({
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
                role: "VOLUNTEER"
            }
        })

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
    