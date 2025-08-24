"use client";

import React from "react";

import { signInSchema } from "@/lib/validations";
import { AuthForm } from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/action/auth";

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
















































// "use client"

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { FileInput } from "@/components/ui/file-input";
// import { MultiSelect } from "@/components/ui/multi-select";
// import Image from "next/image";
// import { useState } from "react";

// export default function SignInPage() {
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });

//     const handleInputChange = (field: string, value: string | string[] | File | null) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log("Form data:", formData);
//         // TODO: Implement form submission logic
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen h-full w-full">
//             <div className="flex flex-col gap-6 justify-start h-full w-full max-w-md p-6 rounded-lg">
//                 <div className="flex gap-2 items-center">
//                     <Image src="/icons/logo.svg" alt="logo" width={30} height={30} className="invert" />
//                     <h1 className="font-bold text-xl">Volunteer Step Events</h1>
//                 </div>

//                 <div className="">
//                     <h1 className="text-2xl font-bold">Sign in to your account</h1>
//                     <p className="text-sm text-gray-600 mt-1">Please enter your email and password to sign in</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                     <div>
//                         <label htmlFor="email" className="text-xs font-medium text-gray-700 mb-1 block">Email *</label>
//                         <Input
//                             type="email"
//                             id="email"
//                             value={formData.email}
//                             onChange={(e) => handleInputChange("email", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="password" className="text-xs font-medium text-gray-700 mb-1 block">Password *</label>
//                         <Input
//                             type="password"
//                             id="password"
//                             value={formData.password}
//                             onChange={(e) => handleInputChange("password", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <Button type="submit" className="w-full mt-4">
//                         Sign In
//                     </Button>
//                 </form>

//                 <div className="text-center text-sm text-gray-600">
//                     Don't have an account?{" "}
//                     <a href="/sign-up" className="text-blue-600 hover:underline">
//                         Sign up
//                     </a>
//                 </div>
//             </div>
//         </div>
//     )
// }
