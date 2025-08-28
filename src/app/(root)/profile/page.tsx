"use client";

import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { profileSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import Tag from "@/components/ui/tag";
import { GOV_ID_OPTIONS } from "@/constants";
import { Select } from "@/components/ui/select";
import { UserCheck, Loader2, RefreshCw } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export default function Profile() {
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
  } = useProfile();

  const handleFormSubmit: SubmitHandler<z.infer<typeof profileSchema>> = async (values) => {
    await onSubmit(values);
  };

  return (
    <div className="w-full overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5 bg-transparent">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Update Profile</h2>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <Button disabled className="bg-green-600 hover:bg-green-700">
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
              ) : (
                <Button
                  onClick={handleSubmitVerification}
                  disabled={isSubmittingVerification || !areAllFieldsFilled()}
                  className={`${
                    areAllFieldsFilled() 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-gray-400 cursor-not-allowed"
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
              <Button type="submit" className="w-fit bg-black text-white hidden md:block">Save Changes</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 lg:gap-10 w-full">
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name={"fullName"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Full Name</FormLabel>
                    <FormControl>
                      <div className="w-full border border-gray-300 rounded-md">
                        <Input required placeholder="Your full name" {...field} className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1.5fr] gap-5 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Role</FormLabel>
                  <div className="w-full border border-gray-300 rounded-md">
                    <Input value={role} readOnly disabled className="w-full bg-black/10 font-medium px-3 py-2 text-sm rounded-md transition-all duration-200 border-0 disabled:opacity-100" />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name={"phoneNumber"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 w-full">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Phone Number</FormLabel>
                      <FormControl>
                        <div className="w-full border border-gray-300 rounded-md">
                          <div className="flex items-center w-full">
                            <span className="px-3 py-2 text-sm text-gray-700 bg-gray-50 select-none border-r border-gray-200">+91</span>
                            <Input placeholder="Your phone number" {...field} className="w-full px-3 py-2 text-sm transition-all duration-200 border-0 rounded-none" />
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
                    <FormItem className="flex flex-col gap-1 w-full">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Gender</FormLabel>
                      <FormControl>
                        <Bordered className="w-full">
                          <Input
                            {...field}
                            readOnly
                            disabled
                            placeholder="Gender"
                            className="w-full bg-black/10 font-medium px-3 py-2 text-sm rounded-md transition-all duration-200 border-0 disabled:opacity-100"
                          />
                        </Bordered>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={"govIdType"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1 w-full">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Government ID Type</FormLabel>
                      <FormControl>
                        <Bordered className="w-full">
                          <Select
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value)}
                            disabled={!!field.value}
                            className="w-full bg-black/10 font-medium px-3 py-2 text-sm rounded-md transition-all duration-200 border-0 disabled:opacity-100"
                          >
                            <option value="" disabled>
                              Select ID Type
                            </option>
                            {GOV_ID_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Select>
                        </Bordered>
                      </FormControl>
                      {field.value && (
                        <p className="text-xs text-gray-500 mt-1">
                          Government ID type cannot be changed once selected. Contact support if you need to update it.
                        </p>
                      )}
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
                    <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Address</FormLabel>
                    <FormControl>
                      <Bordered className="w-full">
                        <Textarea placeholder="Your address" {...field} rows={9} className="w-full px-3 py-2 text-sm rounded-md bg-transparent transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0 border-0" />
                      </Bordered>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={"skills"}
                render={({ field }) => {
                  const [skillInput, setSkillInput] = useState("");

                  const addSkill = (text: string) => {
                    const value = text.trim();
                    if (!value) return;
                    const current = Array.isArray(field.value) ? field.value : [];
                    if (current.length >= 10) return;
                    if (current.includes(value)) return;
                    field.onChange([...current, value]);
                    setSkillInput("");
                  };

                  const removeSkill = (valueToRemove: string) => {
                    const current = Array.isArray(field.value) ? field.value : [];
                    field.onChange(current.filter((c) => c !== valueToRemove));
                  };

                  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addSkill(skillInput);
                    } else if (e.key === "Backspace" && skillInput === "") {
                      const current = Array.isArray(field.value) ? field.value : [];
                      if (current.length > 0) {
                        removeSkill(current[current.length - 1]);
                      }
                    }
                  };

                  return (
                    <FormItem className="flex flex-col gap-1 w-full">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Skills (press Enter to add, max 10)</FormLabel>
                      <FormControl>
                        <Bordered className="w-full h-10 px-2 items-center justify-center text-sm  flex gap-2 flex-wrap">
                          {Array.isArray(field.value) && field.value.length > 0 && field.value.map((skill) => (
                            <Tag key={skill} label={skill} onRemove={() => removeSkill(skill)} />
                          ))}
                          <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={Array.isArray(field.value) && field.value.length >= 10 ? "Maximum 10 skills" : "Type and press Enter"}
                            disabled={Array.isArray(field.value) && field.value.length >= 10}
                            className="flex-1 min-w-[160px] bg-transparent outline-none text-sm placeholder:text-gray-500 placeholder:pl-1"
                          />
                        </Bordered>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="flex flex-col gap-5 w-full lg:w-[350px]">
              <FormField
                control={form.control}
                name={"profileImage"}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Profile Image</FormLabel>
                    <div>
                      <FormControl>
                        <Bordered className="h-fit w-full rounded-md border-gray-400 border-dashed">
                          <FileUpload
                            type="image"
                            accept="image/*"
                            placeholder="Upload profile image"
                            folder="users/profile"
                            variant="dark"
                            onFileChange={field.onChange}
                            value={field.value}
                            objectFit="cover"
                            aspectRatio="16:9"
                            className="w-full h-full border-0 rounded-md aspect-video overflow-hidden object-top"
                          />
                        </Bordered>
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
                    <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Government ID Image</FormLabel>
                    <div>
                      <FormControl>
                        <Bordered className="h-fit w-full rounded-md border-gray-400 border-dashed">
                          <FileUpload
                            type="image"
                            accept="image/*"
                            placeholder="Upload government ID image"
                            folder="users/gov-id"
                            variant="dark"
                            onFileChange={field.onChange}
                            value={field.value}
                            objectFit="cover"
                            aspectRatio="4:3"
                            className="w-full h-full border-0 rounded-md aspect-video overflow-hidden"
                            disabled={!!field.value}
                          />
                        </Bordered>
                      </FormControl>
                    </div>
                    {field.value && (
                      <p className="text-xs text-gray-500 mt-1">
                        Government ID image cannot be changed once uploaded. Contact support if you need to update it.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>



        <Button type="submit" onClick={form.handleSubmit(handleFormSubmit)} className="w-full mt-5 bg-black text-white block md:hidden">Save Changes</Button>
      </Form>
    </div>
  );
}