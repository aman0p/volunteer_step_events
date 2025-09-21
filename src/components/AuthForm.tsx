"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
   DefaultValues,
   FieldValues,
   Path,
   SubmitHandler,
   useForm,
} from "react-hook-form";
import { ZodSchema } from "zod";
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
   FIELD_NAMES,
   FIELD_TYPES,
   GENDER_OPTIONS,
   GOV_ID_OPTIONS,
} from "@/constants";
import FileUpload from "@/components/FileUpload";
import { toast } from "sonner";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { IoEye, IoEyeOff } from "react-icons/io5";

interface Props<T extends FieldValues> {
   schema: ZodSchema<T>;
   defaultValues: T;
   onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
   type: "SIGN_IN" | "SIGN_UP";
}

export function AuthForm<T extends FieldValues>({
   type,
   schema,
   defaultValues,
   onSubmit,
}: Props<T>) {
   const router = useRouter();
   const isSignIn = type === "SIGN_IN";
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(schema as any) as any,
      defaultValues: defaultValues as DefaultValues<T>,
   });

   const handleSubmit: SubmitHandler<T> = async (data) => {
      setIsLoading(true);

      try {
         if (isSignIn) {
            // Handle sign-in with NextAuth
            const result = await signIn("credentials", {
               email: data.email,
               password: data.password,
               redirect: false,
            });

            if (result?.error) {
               toast.error("Sign in failed", {
                  description:
                     result.error === "CredentialsSignin"
                        ? "Invalid email or password"
                        : result.error,
               });
            } else if (result?.ok) {
               toast.success("Success", {
                  description: "You have successfully signed in.",
               });
               // Force a page refresh to ensure the session is properly set
               window.location.href = "/";
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
      } catch (error) {
         console.error("Auth error:", error);
         toast.error(`${isSignIn ? "Sign in" : "Sign up"} failed`, {
            description: "An error occurred during authentication.",
         });
      } finally {
         setIsLoading(false);
      }
   };

   // Helper to render a single field consistently
   const renderFormField = (fieldName: string) => (
      <FormField
         key={fieldName}
         control={form.control}
         name={fieldName as Path<T>}
         render={({ field }) => (
            <FormItem>
               <FormLabel>
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
                  ) : fieldName === "gender" ? (
                     <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                           {GENDER_OPTIONS.map((option) => (
                              <SelectItem
                                 key={option.value}
                                 value={option.value}
                              >
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  ) : fieldName === "govIdType" ? (
                     <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                           {GOV_ID_OPTIONS.map((option) => (
                              <SelectItem
                                 key={option.value}
                                 value={option.value}
                              >
                                 {option.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  ) : fieldName === "phoneNumber" ? (
                     <div className="inline-flex w-full items-center overflow-hidden rounded-md">
                        <span className="text-background border-r bg-zinc-900 px-3 py-2 text-sm select-none">
                           +91
                        </span>
                        <Input
                           type="tel"
                           value={field.value as string}
                           onChange={field.onChange}
                           name="phone"
                           required
                           className="-ml-px rounded-l-none border-l-0"
                        />
                     </div>
                  ) : fieldName === "password" ? (
                     <div className="relative w-full">
                        <Input
                           required
                           type={showPassword ? "text" : "password"}
                           {...field}
                           className="pr-10"
                        />
                        <button
                           type="button"
                           aria-label={
                              showPassword ? "Hide password" : "Show password"
                           }
                           onClick={() => setShowPassword((v) => !v)}
                           className="text-muted-foreground absolute inset-y-0 right-0 flex items-center px-3"
                        >
                           {showPassword ? (
                              <IoEye className="h-5 w-5" />
                           ) : (
                              <IoEyeOff className="h-5 w-5" />
                           )}
                        </button>
                     </div>
                  ) : fieldName === "email" ? (
                     <Input
                        required
                        type="email"
                        {...field}
                        className="lowercase"
                     />
                  ) : (
                     <Input
                        required
                        type={
                           FIELD_TYPES[fieldName as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                     />
                  )}
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );

   return (
      <div className="bg-background flex h-full min-h-screen w-full flex-col items-center justify-center">
         <div
            className="absolute inset-0 opacity-80"
            style={{
               backgroundImage: "url('/default/gradient-background.svg')",
               backgroundSize: "cover",
               backgroundPosition: "center",
               backgroundRepeat: "no-repeat",
            }}
         />
         <div
            className={`bg-card/5 shadow-foreground/20 border-background/30 mx-4 grid h-fit grid-cols-2 overflow-hidden rounded-3xl border shadow-lg backdrop-blur-2xl max-md:grid-cols-1 md:w-full ${isSignIn ? "max-w-4xl" : "max-w-5xl"}`}
         >
            <div className="flex h-full flex-col justify-start gap-7 rounded-lg p-4 md:w-full md:p-8 md:pl-12">
               <div className="flex items-center gap-2">
                  <Image
                     src="/default/logo.svg"
                     alt="logo"
                     width={30}
                     height={30}
                     className="invert-100 dark:invert-0"
                  />
                  <h1 className="text-xl font-bold">Volunteer Step Events</h1>
               </div>
               <div className="">
                  <h1 className="text-2xl font-bold">
                     {isSignIn
                        ? "Sign in to your account"
                        : "Create your account"}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
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
                     {isSignIn ? (
                        // Default rendering for sign-in
                        <>
                           {Object.keys(defaultValues).map((fieldName) =>
                              renderFormField(fieldName)
                           )}
                        </>
                     ) : (
                        // Custom layout for sign-up: phoneNumber and gender on one row
                        <>
                           {Object.keys(defaultValues)
                              .filter(
                                 (f) => f !== "phoneNumber" && f !== "gender"
                              )
                              .map((fieldName) => renderFormField(fieldName))}

                           <div className="grid grid-cols-[1fr_auto] gap-4">
                              {"phoneNumber" in defaultValues &&
                                 renderFormField("phoneNumber")}
                              {"gender" in defaultValues &&
                                 renderFormField("gender")}
                           </div>
                        </>
                     )}

                     <Button
                        type="submit"
                        loading={isLoading}
                        className="mt-4 w-full"
                     >
                        {isSignIn ? "Sign In" : "Sign Up"}
                     </Button>
                  </form>
               </Form>
            </div>

            <div className="bg-muted hidden h-full w-full md:block">
               <Image
                  src="/default/corporate-event-organizer.jpg"
                  alt="auth image"
                  width={1000}
                  height={1000}
                  className="h-full w-full object-cover contrast-110 saturate-80"
               />
            </div>
         </div>
         <p className="text-foreground relative top-7 text-center text-sm backdrop-blur-2xl">
            {isSignIn
               ? "New to Volunteer Step Events? "
               : "Already have an account? "}

            <Link
               href={isSignIn ? "/sign-up" : "/sign-in"}
               className="ml-2 font-medium text-blue-600 hover:underline"
            >
               {isSignIn ? "Create an account" : "Sign in"}
            </Link>
         </p>
      </div>
   );
}
