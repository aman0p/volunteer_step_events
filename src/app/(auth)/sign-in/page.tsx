"use client";

import React from "react";

import { signInSchema } from "@/lib/validations";
import { AuthForm } from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";

export default function SignInPage() {
    return (
        <AuthForm
            type="SIGN_IN"
            schema={signInSchema}
            defaultValues={{
                email: "",
                password: "",
            }}
            onSubmit={signInWithCredentials}
        />
    )
}