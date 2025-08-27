"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
    UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FIELD_NAMES, FIELD_TYPES, GENDER_OPTIONS, GOV_ID_OPTIONS } from "@/constants";
import FileUpload from "./FileUpload";
import { toast } from "sonner";
import Image from "next/image";
import { signIn } from "next-auth/react";

interface Props<T extends FieldValues> {
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

export function AuthForm<T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) {

    const router = useRouter();
    const isSignIn = type === "SIGN_IN";

    const form: UseFormReturn<T> = useForm<T>({
        resolver: zodResolver(schema as any),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const handleSubmit: SubmitHandler<T> = async (data) => {
        if (isSignIn) {
            // Handle sign-in with NextAuth
            try {
                const result = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error("Sign in failed", {
                        description: result.error === "CredentialsSignin" ? "Invalid email or password" : result.error,
                    });
                } else if (result?.ok) {
                    toast.success("Success", {
                        description: "You have successfully signed in.",
                    });
                    // Force a page refresh to ensure the session is properly set
                    window.location.href = "/";
                }
            } catch (error) {
                console.error("Sign in error:", error);
                toast.error("Sign in failed", {
                    description: "An error occurred during sign in.",
                });
            }
        } else {
            // Handle sign-up with server action
            const result = await onSubmit(data);

            if (result.success) {
                toast.success("Success", {
                    description: "You have successfully signed up.",
                });
                // After successful signup, redirect to sign-in
                router.push("/sign-in");
            } else {
                toast.error("Error signing up", {
                    description: result.error ?? "An error occurred.",
                });
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen h-full w-full">
            <div className="flex flex-col gap-6 justify-start h-full w-full max-w-md p-6 rounded-lg">
                <div className="flex gap-2 items-center">
                    <Image src="/icons/logo.svg" alt="logo" width={30} height={30} className="invert" />
                    <h1 className="font-bold text-xl">Volunteer Step Events</h1>
                </div>
                <div className="">
                    <h1 className="text-2xl font-bold">
                        {isSignIn ? "Sign in to your account" : "Create your account"}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {isSignIn
                            ? "Please enter your email and password to sign in"
                            : "Please complete all fields and upload required documents"}
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        {Object.keys(defaultValues).map((fieldName) => (
                            <FormField
                                key={fieldName}
                                control={form.control}
                                name={fieldName as Path<T>}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1">
                                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                                            {FIELD_NAMES[fieldName as keyof typeof FIELD_NAMES]}
                                        </FormLabel>
                                        <FormControl>
                                            {fieldName === "govIdImage" ? (
                                                <FileUpload
                                                    type="image"
                                                    accept="image/*"
                                                    placeholder="Upload your Govt. ID"
                                                    folder="ids"
                                                    variant="dark"
                                                    onFileChange={field.onChange}
                                                    value={field.value}
                                                />
                                            ) : fieldName === "profileImage" ? (
                                                <FileUpload
                                                    type="image"
                                                    accept="image/*"
                                                    placeholder="Upload your Profile Image"
                                                    folder="profile"
                                                    variant="dark"
                                                    onFileChange={field.onChange}
                                                    value={field.value}
                                                />
                                            )
                                            : fieldName === "gender" ? (
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md bg-white shadow-xs transition-all duration-200 focus:outline-none"
                                                >
                                                    <option value="">Select gender</option>
                                                    {GENDER_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : fieldName === "govIdType" ? (
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md bg-white shadow-xs transition-all duration-200 focus:outline-none"
                                                >
                                                    <option value="">Select ID type</option>
                                                    {GOV_ID_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : fieldName === "phoneNumber" ? (
                                                    <div className="flex items-center w-full">
                                                        <span className="px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-l-md bg-gray-50 select-none">+91</span>
                                                        <Input
                                                            type="tel"
                                                            value={field.value as string}
                                                            onChange={field.onChange}
                                                            name="phone"
                                                            required
                                                            placeholder="Enter 10-digit mobile number"
                                                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md rounded-l-none -ml-px bg-white shadow-xs transition-all duration-200 focus:outline-none"
                                                        />
                                                    </div>
                                            ) : (
                                                <Input
                                                    required
                                                    type={
                                                        FIELD_TYPES[fieldName as keyof typeof FIELD_TYPES]
                                                    }
                                                    {...field}
                                                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md bg-white shadow-xs transition-all duration-200 focus:outline-none"
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button type="submit" className="w-full mt-4">
                            {isSignIn ? "Sign In" : "Sign Up"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-sm text-gray-600">
                    {isSignIn ? "New to Volunteer Step Events? " : "Already have an account? "}

                    <Link
                        href={isSignIn ? "/sign-up" : "/sign-in"}
                        className="text-blue-600 hover:underline"
                    >
                        {isSignIn ? "Create an account" : "Sign in"}
                    </Link>
                </p>
            </div>
        </div>
    )
}