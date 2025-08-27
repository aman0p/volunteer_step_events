"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Bordered } from "@/components/ui/bordered";
import { profileSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import Tag from "@/components/ui/tag";
import { updateCurrentUserProfile, getCurrentUserProfile } from "@/lib/user/profile";
import { toast } from "sonner";

export default function Profile() {

    const form = (useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
          fullName: "",
          phoneNumber: "",
          address: "",
          gender: undefined,
          profileImage: "",
          skills: [],
        },
      }) as UseFormReturn<z.infer<typeof profileSchema>>);
    const [role, setRole] = useState("");
    
      useEffect(() => {
        let isMounted = true;
        (async () => {
          const result = await getCurrentUserProfile();
          if (isMounted && result.success && result.data) {
            form.reset({
              fullName: result.data.fullName ?? "",
              phoneNumber: result.data.phoneNumber ?? "",
              address: result.data.address ?? "",
              gender: result.data.gender ?? undefined,
              profileImage: result.data.profileImage ?? "",
              skills: Array.isArray(result.data.skills) ? result.data.skills : [],
            });
            setRole((result.data as any).role ?? "");
          }
        })();
        return () => {
          isMounted = false;
        };
      }, [form]);

      const onSubmit: SubmitHandler<z.infer<typeof profileSchema>> = async (values) => {
        const result = await updateCurrentUserProfile(values);
        if (result.success) {
          toast.success("Profile updated successfully");
        } else {
          toast.error(result.message);
        }
      };


      return (
        <div className="w-full overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 bg-transparent">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Update Profile</h2>
                <Button type="submit" className="w-fit bg-black text-white hidden md:block">Save Changes</Button>
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
                          <Bordered className="w-full">
                            <Input required placeholder="Your full name" {...field} className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0" />
                          </Bordered>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
    
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                    <div className="flex flex-col gap-1 w-full">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Role</FormLabel>
                      <Bordered className="w-full">
                        <Input value={role} readOnly disabled className="w-full bg-black/10 font-medium px-3 py-2 text-sm rounded-md transition-all duration-200 border-0 disabled:opacity-100" />
                      </Bordered>
                    </div>
                    <FormField
                      control={form.control}
                      name={"phoneNumber"}
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1 w-full">
                          <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Phone Number</FormLabel>
                          <FormControl>
                            <Bordered className="w-full">
                              <Input placeholder="Your phone number" {...field} className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0" />
                            </Bordered>
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
                  </div>
    
                  <FormField
                    control={form.control}
                    name={"address"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">Address</FormLabel>
                        <FormControl>
                          <Bordered className="w-full">
                            <Textarea placeholder="Your address" {...field} rows={6} className="w-full px-3 py-2 text-sm rounded-md bg-transparent transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0 border-0" />
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
                                // objectFit="contain"
                                aspectRatio="1:1"
                                className="w-full h-full border-0 rounded-md"
                              />
                            </Bordered>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
    
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="w-full mt-5 bg-black text-white block md:hidden">Save Changes</Button>
          </Form>
        </div>
      );
}