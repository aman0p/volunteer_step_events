"use client";

import React from "react";
import { signUpSchema } from "@/lib/validations";
import { AuthForm } from "@/components/AuthForm";
import { signUpWithCredentials } from "@/lib/action/auth";
import { Gender, GovId } from "@/generated/prisma";

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
                address: "",
                gender: Gender.MALE,
                govIdType: GovId.AADHAR_CARD,
                govIdImage: "",
                profileImage: "",
            }}
            onSubmit={signUpWithCredentials}
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

// export default function SignUpPage() {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         password: "",
//         email: "",
//         phone: "",
//         address: "",
//         gender: "",
//         govIdType: "",
//         skills: [] as string[],
//         profileImage: null as File | null,
//         govIdImage: null as File | null,
//     });

//     const skillOptions = [
//         "Event Planning",
//         "First Aid",
//         "Communication",
//         "Leadership",
//         "Technical Support",
//         "Catering",
//         "Transportation",
//         "Photography",
//         "Videography",
//         "Social Media",
//         "Fundraising",
//         "Teaching",
//         "Translation",
//         "Medical",
//         "Security",
//         "Other"
//     ];

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
//                     <h1 className="text-2xl font-bold">Create your account</h1>
//                     <p className="text-sm text-gray-600 mt-1">Please complete all fields and upload required documents</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//                     <div>
//                         <label htmlFor="fullName" className="text-xs font-medium text-gray-700 mb-1 block">Full Name *</label>
//                         <Input
//                             type="text" 
//                             id="fullName"
//                             value={formData.fullName}
//                             onChange={(e) => handleInputChange("fullName", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             required
//                         />
//                     </div>

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

//                     <div>
//                         <label htmlFor="phone" className="text-xs font-medium text-gray-700 mb-1 block">Phone Number *</label>
//                         <Input
//                             type="tel" 
//                             id="phone"
//                             value={formData.phone}
//                             onChange={(e) => handleInputChange("phone", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="address" className="text-xs font-medium text-gray-700 mb-1 block">Address *</label>
//                         <Textarea
//                             id="address"
//                             value={formData.address}
//                             onChange={(e) => handleInputChange("address", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             placeholder="Enter your complete address"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="gender" className="text-xs font-medium text-gray-700 mb-1 block">Gender *</label>
//                         <Select
//                             id="gender"
//                             value={formData.gender}
//                             onChange={(e) => handleInputChange("gender", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             required
//                         >
//                             <option value="">Select gender</option>
//                             <option value="MALE">Male</option>
//                             <option value="FEMALE">Female</option>
//                             <option value="OTHER">Other</option>
//                         </Select>
//                     </div>

//                     {/* <div>
//                         <label htmlFor="skills" className="text-xs font-medium text-gray-700 mb-1 block">Skills *</label>
//                         <MultiSelect
//                             options={skillOptions}
//                             selected={formData.skills}
//                             onChange={(skills) => handleInputChange("skills", skills)}
//                             placeholder="Select your skills"
//                         />
//                     </div> */}

//                     <div>
//                         <label htmlFor="govIdType" className="text-xs font-medium text-gray-700 mb-1 block">Government ID Type *</label>
//                         <Select
//                             id="govIdType"
//                             value={formData.govIdType}
//                             onChange={(e) => handleInputChange("govIdType", e.target.value)}
//                             className="text-sm border-black/50 border-2 rounded-md p-2 focus:outline-none"
//                             required
//                         >
//                             <option value="">Select ID type</option>
//                             <option value="AADHAR_CARD">Aadhar Card</option>
//                             <option value="PASSPORT">Passport</option>
//                             <option value="DRIVING_LICENSE">Driving License</option>
//                             <option value="PAN_CARD">PAN Card</option>
//                         </Select>
//                     </div>

//                     <div>
//                         <label htmlFor="profileImage" className="text-xs font-medium text-gray-700 mb-1 block">Profile Image *</label>
//                         <FileInput
//                             id="profileImage"
//                             accept="image/*"
//                             onFileChange={(file) => handleInputChange("profileImage", file)}
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="govIdImage" className="text-xs font-medium text-gray-700 mb-1 block">Government ID Image *</label>
//                         <FileInput
//                             id="govIdImage"
//                             accept="image/*"
//                             onFileChange={(file) => handleInputChange("govIdImage", file)}
//                             required
//                         />
//                     </div>

//                     <Button type="submit" className="w-full mt-4">
//                         Sign Up
//                     </Button>
//                 </form>

//                 <div className="text-center text-sm text-gray-600">
//                     Already have an account?{" "}
//                     <a href="/sign-in" className="text-blue-600 hover:underline">
//                         Sign in
//                     </a>
//                 </div>
//             </div>
//         </div>
//     )
// }