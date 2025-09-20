"use client";

import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { profileSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import Tag from "@/components/ui/tag";
import { GOV_ID_OPTIONS } from "@/constants";
import { UserCheck, Loader2, RefreshCw, XCircle } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import Section from "@/components/ui/section";

export default function Profile() {
   const [skillInput, setSkillInput] = useState("");

   const {
      form,
      role,
      isVerified,
      hasPendingRequest,
      isSubmittingVerification,
      isRefreshingVerification,
      areAllFieldsFilled,
      refreshVerificationStatus,
      handleSubmitVerification,
      onSubmit,
      hasRejectedRequest,
      rejectionReason,
   } = useProfile();

   const handleFormSubmit: SubmitHandler<
      z.infer<typeof profileSchema>
   > = async (values) => {
      await onSubmit(values);
   };

   return (
      <Section className="w-full overflow-hidden">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleFormSubmit)}
               className="flex flex-col gap-5 bg-transparent"
            >
               <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl uppercase font-bold md:text-2xl lg:text-3xl">
                     Update Profile
                  </h2>
                  <div className="flex items-center gap-2">
                     {isVerified ? (
                        <Button
                           className="bg-green-600 pointer-events-none"
                        >
                           <UserCheck className="mr-2 h-4 w-4" />
                           Verified
                        </Button>
                     ) : hasPendingRequest ? (
                        <div className="flex items-center gap-2">
                           <Button disabled variant="outline">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Verification Pending
                           </Button>
                           <Button
                              onClick={refreshVerificationStatus}
                              disabled={isRefreshingVerification}
                              variant="outline"
                              size="sm"
                              title="Refresh verification status"
                           >
                              {isRefreshingVerification ? (
                                 <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                 <RefreshCw className="h-4 w-4" />
                              )}
                           </Button>
                        </div>
                     ) : hasRejectedRequest ? (
                        <div className="flex items-center gap-2">
                           <Button
                              disabled
                              variant="outline"
                              className="border-red-300 text-red-600"
                           >
                              <XCircle className="mr-2 h-4 w-4" />
                              Verification Rejected
                           </Button>
                           <Button
                              onClick={refreshVerificationStatus}
                              disabled={isRefreshingVerification}
                              variant="outline"
                              size="sm"
                              title="Refresh verification status"
                           >
                              {isRefreshingVerification ? (
                                 <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                 <RefreshCw className="h-4 w-4" />
                              )}
                           </Button>
                        </div>
                     ) : (
                        <Button
                           onClick={handleSubmitVerification}
                           disabled={
                              isSubmittingVerification || !areAllFieldsFilled()
                           }
                           className={`${
                              areAllFieldsFilled()
                                 ? "bg-blue-600 hover:bg-blue-700"
                                 : "cursor-not-allowed bg-gray-400"
                           }`}
                           title={
                              !areAllFieldsFilled()
                                 ? "Please fill all required fields before requesting verification"
                                 : "Save profile and request verification"
                           }
                        >
                           {isSubmittingVerification ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           ) : (
                              <UserCheck className="mr-2 h-4 w-4" />
                           )}
                           Request Verification
                        </Button>
                     )}
                     <Button
                        type="submit"
                        className="hidden w-fit bg-black text-white md:block"
                     >
                        Save Changes
                     </Button>
                  </div>
               </div>

               {/* Rejection Reason Display */}
               {hasRejectedRequest && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                     <div className="flex items-start gap-3">
                        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                        <div className="flex-1">
                           {rejectionReason ? (
                              <p className="mb-2 text-sm text-red-700 dark:text-red-300">
                                 <span className="font-medium">Reason:</span>{" "}
                                 {rejectionReason}
                              </p>
                           ) : (
                              <p className="mb-2 text-sm text-red-700 dark:text-red-300">
                                 No specific reason was provided for the
                                 rejection.
                              </p>
                           )}
                           <p className="mb-3 text-xs text-red-600 dark:text-red-400">
                              You can update your profile and submit a new
                              verification request.
                           </p>
                           <div className="flex items-center gap-3">
                              <Button
                                 onClick={handleSubmitVerification}
                                 disabled={
                                    isSubmittingVerification ||
                                    !areAllFieldsFilled()
                                 }
                                 size="sm"
                                 className="bg-blue-600 text-white hover:bg-blue-700"
                                 title={
                                    !areAllFieldsFilled()
                                       ? "Please fill all required fields before requesting verification"
                                       : "Submit new verification request"
                                 }
                              >
                                 {isSubmittingVerification ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 ) : (
                                    <UserCheck className="mr-2 h-4 w-4" />
                                 )}
                                 Apply for Verification Again
                              </Button>
                              <Button
                                 onClick={refreshVerificationStatus}
                                 disabled={isRefreshingVerification}
                                 variant="outline"
                                 size="sm"
                                 title="Refresh verification status"
                              >
                                 {isRefreshingVerification ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                 ) : (
                                    <RefreshCw className="h-4 w-4" />
                                 )}
                                 Refresh Status
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:gap-10">
                  <div className="flex flex-col gap-5">
                     <FormField
                        control={form.control}
                        name={"fullName"}
                        render={({ field }) => (
                           <FormItem className="flex flex-col gap-1">
                              <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                 Full Name
                              </FormLabel>
                              <FormControl>
                                 <div className="w-full rounded-md bg-white/50 border-2 border-white border-dashed">
                                    <Input
                                       required
                                       placeholder="Your full name"
                                       {...field}
                                       value={field.value || ""}
                                       className="w-full rounded-md border-0 px-3 py-2 text-sm transition-all duration-200"
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-[1fr_1.5fr_1fr_1.5fr]">
                        <div className="flex w-full flex-col gap-1">
                           <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                              Role
                           </FormLabel>
                           <div className="w-full rounded-md bg-white/50 border-2 border-white overflow-hidden border-dashed">
                              <Input
                                 value={role}
                                 readOnly
                                 disabled
                                 className="w-full rounded-md border-0 bg-black/10 px-3 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-100"
                              />
                           </div>
                        </div>
                        <FormField
                           control={form.control}
                           name={"phoneNumber"}
                           render={({ field }) => (
                              <FormItem className="flex w-full flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                    Phone Number
                                 </FormLabel>
                                 <FormControl>
                                    <div className="w-full rounded-md bg-white/50 border-2 border-white overflow-hidden border-dashed">
                                       <div className="flex w-full items-center">
                                          <span className="border-r bg-zinc-900 px-3 py-2 text-sm text-background select-none">
                                             +91
                                          </span>
                                          <Input
                                             placeholder="Your phone number"
                                             {...field}
                                             value={field.value || ""}
                                             className="w-full rounded-none border-0 px-3 py-2 text-sm transition-all duration-200"
                                          />
                                       </div>
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name={"gender"}
                           render={({ field }) => (
                              <FormItem className="flex w-full flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                    Gender
                                 </FormLabel>
                                 <FormControl>
                                    <div className="w-full rounded-md bg-white/50 border-2 border-white overflow-hidden border-dashed">
                                       <Input
                                          {...field}
                                          readOnly
                                          disabled
                                          placeholder="Gender"
                                          value={field.value || ""}
                                          className="w-full rounded-md border-0 bg-black/10 px-3 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-100"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={form.control}
                           name={"govIdType"}
                           render={({ field }) => (
                              <FormItem className="flex w-full flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                    Government ID Type
                                 </FormLabel>
                                 <FormControl>
                                    <div className="w-full rounded-md bg-white/50 border-2 border-white overflow-hidden border-dashed">
                                       <select
                                          value={field.value || ""}
                                          onChange={(e) =>
                                             field.onChange(e.target.value)
                                          }
                                          disabled={!!field.value}
                                          className="w-full rounded-md border-0 bg-black/10 px-3 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-100"
                                       >
                                          <option value="" disabled>
                                             Select ID Type
                                          </option>
                                          {GOV_ID_OPTIONS.map((opt) => (
                                             <option
                                                key={opt.value}
                                                value={opt.value}
                                             >
                                                {opt.label}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                 </FormControl>
                                 {/* {field.value && (
                        <p className="text-xs text-gray-500 mt-1">
                          Government ID type cannot be changed once selected. Contact support if you need to update it.
                        </p>
                      )} */}
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <FormField
                        control={form.control}
                        name={"address"}
                        render={({ field }) => (
                           <FormItem className="flex flex-col gap-1">
                              <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                 Address
                              </FormLabel>
                              <FormControl>
                                 <div className="w-full rounded-md bg-white/50 border-2 border-white overflow-hidden border-dashed">
                                    <Textarea
                                       placeholder="Your address"
                                       {...field}
                                       value={field.value || ""}
                                       rows={9}
                                       className="w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name={"skills"}
                        render={({ field }) => {
                           const addSkill = (text: string) => {
                              const value = text.trim();
                              if (!value) return;
                              const current = Array.isArray(field.value)
                                 ? field.value
                                 : [];
                              if (current.length >= 10) return;
                              if (current.includes(value)) return;
                              field.onChange([...current, value]);
                              setSkillInput("");
                           };

                           const removeSkill = (valueToRemove: string) => {
                              const current = Array.isArray(field.value)
                                 ? field.value
                                 : [];
                              field.onChange(
                                 current.filter((c) => c !== valueToRemove)
                              );
                           };

                           const handleKeyDown: React.KeyboardEventHandler<
                              HTMLInputElement
                           > = (e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                 e.preventDefault();
                                 addSkill(skillInput);
                              } else if (
                                 e.key === "Backspace" &&
                                 skillInput === ""
                              ) {
                                 const current = Array.isArray(field.value)
                                    ? field.value
                                    : [];
                                 if (current.length > 0) {
                                    removeSkill(current[current.length - 1]);
                                 }
                              }
                           };

                           return (
                              <FormItem className="flex w-full flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                    Skills (press Enter to add, max 10)
                                 </FormLabel>
                                 <FormControl>
                                    <div className="flex h-10 w-full flex-wrap items-center justify-center gap-2 rounded-md bg-white/50 border-2 border-white overflow-hidden border-dashed px-2 text-sm">
                                       {(Array.isArray(field.value)
                                          ? field.value
                                          : []
                                       ).length > 0 &&
                                          (Array.isArray(field.value)
                                             ? field.value
                                             : []
                                          ).map((skill) => (
                                             <Tag
                                                key={skill}
                                                label={skill}
                                                onRemove={() =>
                                                   removeSkill(skill)
                                                }
                                             />
                                          ))}
                                       <input
                                          value={skillInput}
                                          onChange={(e) =>
                                             setSkillInput(e.target.value)
                                          }
                                          onKeyDown={handleKeyDown}
                                          placeholder={
                                             (Array.isArray(field.value)
                                                ? field.value
                                                : []
                                             ).length >= 10
                                                ? "Maximum 10 skills"
                                                : "Type and press Enter"
                                          }
                                          disabled={
                                             (Array.isArray(field.value)
                                                ? field.value
                                                : []
                                             ).length >= 10
                                          }
                                          className="min-w-[160px] flex-1 bg-transparent text-sm outline-none placeholder:pl-1 placeholder:text-gray-500"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           );
                        }}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 lg:w-[380px]">
                     <FormField
                        control={form.control}
                        name={"profileImage"}
                        render={({ field }) => (
                           <FormItem className="flex flex-col gap-1">
                              <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                 Profile Image
                              </FormLabel>
                              <div>
                                 <FormControl>
                                    <div className="h-fit w-full rounded-md shadow-md shadow-black/10">
                                       <FileUpload
                                          type="image"
                                          accept="image/*"
                                          placeholder="Upload profile image"
                                          folder="users/profile"
                                          variant="dark"
                                          onFileChange={field.onChange}
                                          value={field.value}
                                          objectFit="cover"
                                          className="aspect-video h-full w-full overflow-hidden rounded-md object-top bg-white/50 border-2 border-white border-dashed"
                                       />
                                    </div>
                                 </FormControl>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name={"govIdImage"}
                        render={({ field }) => (
                           <FormItem className="flex flex-col gap-1">
                              <FormLabel className="ml-0.5 block text-xs font-medium text-muted-background capitalize">
                                 Government ID Image
                              </FormLabel>
                              <div>
                                 <FormControl>
                                    <div className="h-fit w-full rounded-md shadow-md shadow-black/10">
                                       <FileUpload
                                          type="image"
                                          accept="image/*"
                                          placeholder="Upload government ID image"
                                          folder="users/gov-id"
                                          variant="dark"
                                          onFileChange={field.onChange}
                                          value={field.value}
                                          objectFit="cover"
                                          className="aspect-video bg-white/50 border-2 border-white border-dashed h-full w-full overflow-hidden rounded-md"
                                          disabled={!!field.value}
                                       />
                                    </div>
                                 </FormControl>
                              </div>
                              {/* {field.value && (
                                 <p className="mt-1 text-xs text-muted-foreground">
                                    Government ID type and image cannot be
                                    changed once uploaded. Contact support if
                                    you need to update it.
                                 </p>
                              )} */}
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>
               </div>
            </form>

            <Button
               type="submit"
               onClick={form.handleSubmit(handleFormSubmit)}
               className="mt-5 block w-full bg-black text-white md:hidden"
            >
               Save Changes
            </Button>
         </Form>
      </Section>
   );
}
