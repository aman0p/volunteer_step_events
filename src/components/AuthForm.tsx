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
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

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
        const result = await onSubmit(data);

        if (result.success) {
            toast({
                title: "Success",
                description: isSignIn
                    ? "You have successfully signed in."
                    : "You have successfully signed up.",
            });

            router.push("/");
        } else {
            toast({
                title: `Error ${isSignIn ? "signing in" : "signing up"}`,
                description: result.error ?? "An error occurred.",
                variant: "destructive",
            });
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
                        {isSignIn ? "Create your account" : "Sign in to your account"}
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {isSignIn
                            ? "Please complete all fields and upload required documents"
                            : "Please enter your email and password to sign in"}
                    </p>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        {Object.keys(defaultValues).map((field) => (
                            <FormField
                                key={field}
                                control={form.control}
                                name={field as Path<T>}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-1">
                                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                                            {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                        </FormLabel>
                                        <FormControl>
                                            {field.name === "govIdImage" ? (
                                                <FileUpload
                                                    type="image"
                                                    accept="image/*"
                                                    placeholder="Upload your Govt. ID"
                                                    folder="ids"
                                                    variant="dark"
                                                    onFileChange={field.onChange}
                                                />
                                            ) : field.name === "profileImage" ? (
                                                <FileUpload
                                                    type="image"
                                                    accept="image/*"
                                                    placeholder="Upload your Profile Image"
                                                    folder="profile"
                                                    variant="dark"
                                                    onFileChange={field.onChange}
                                                />
                                            )
                                            : field.name === "gender" ? (
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="form-input"
                                                >
                                                    <option value="">Select gender</option>
                                                    {GENDER_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : field.name === "govIdType" ? (
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="form-input"
                                                >
                                                    <option value="">Select ID type</option>
                                                    {GOV_ID_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Input
                                                    required
                                                    type={
                                                        FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                                                    }
                                                    {...field}
                                                    className="form-input"
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