"use client";

import React from "react";
import { signUpSchema } from "@/lib/validations";
import { AuthForm } from "@/components/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth";
import { Gender } from "@/generated/prisma";

export default function SignUpPage() {
    return (
        <AuthForm
            type="SIGN_UP"
            schema={signUpSchema}
            defaultValues={{
                fullName: "",
                email: "",
                password: "",
                phoneNumber: "",
                gender: Gender.MALE,
            }}
            onSubmit={signUpWithCredentials}
        />
    )
}