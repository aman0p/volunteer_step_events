"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
   useForm,
   type UseFormReturn,
   type SubmitHandler,
   useFieldArray,
} from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { eventSchema } from "@/lib/validations";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ImageTileUpload from "@/components/ui/image-tile-upload";
import { toast } from "sonner";
import Tag from "@/components/ui/tag";
import { createEvent, updateEvent } from "@/lib/actions/admin/events";
import { EventParams } from "@/types";
import { Trash2, Plus } from "lucide-react";

interface Props {
   type?: "create" | "update";
   id?: string;
   title?: string;
   description?: string;
   location?: string;
   startDate?: Date | string;
   endDate?: Date | string;
   dressCode?: string;
   coverUrl?: string;
   videoUrl?: string | null;
   eventImages?: string[];
   category?: string[];
   maxVolunteers?: number | null;
   createdAt?: Date | string;
   updatedAt?: Date | string;
   eventRoles?: {
      name: string;
      description: string;
      payout: number;
      maxCount: number;
   }[];
   quickLinks?: {
      id?: string;
      title: string;
      url: string;
      isActive: boolean;
   }[];
}

const EventForm = ({ type, ...event }: Props) => {
   const router = useRouter();
   const isUpdate = type === "update" && !!event.id;

   const form = useForm({
      resolver: zodResolver(eventSchema),
      defaultValues: isUpdate
         ? {
              title: (event.title as string) ?? "",
              description: (event.description as string) ?? "",
              location: (event.location as string) ?? "",
              startDate: event.startDate
                 ? new Date(event.startDate)
                 : new Date(),
              endDate: event.endDate ? new Date(event.endDate) : new Date(),
              dressCode: (event.dressCode as string) ?? "",
              coverUrl: (event.coverUrl as string) ?? "",
              videoUrl: (event.videoUrl as string) ?? "",
              eventImages: (event.eventImages as string[]) ?? [],
              category: (event.category as string[]) ?? [],
              maxVolunteers:
                 typeof event.maxVolunteers === "number"
                    ? event.maxVolunteers
                    : undefined,
              createdAt: event.createdAt
                 ? new Date(event.createdAt)
                 : new Date(),
              updatedAt: new Date(),
              eventRoles: event.eventRoles ?? [],
              quickLinks: event.quickLinks ?? [],
           }
         : {
              title: "",
              description: "",
              location: "",
              startDate: new Date(),
              endDate: new Date(),
              dressCode: "",
              coverUrl: "",
              videoUrl: "",
              eventImages: [],
              category: [],
              maxVolunteers: undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
              eventRoles: [],
              quickLinks: [],
           },
   }) as UseFormReturn<z.infer<typeof eventSchema>>;

   const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "eventRoles",
   });

   const {
      fields: quickLinkFields,
      append: appendQuickLink,
      remove: removeQuickLink,
   } = useFieldArray({
      control: form.control,
      name: "quickLinks",
   });

   const formatDateTimeLocal = (date: Date) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const yyyy = date.getFullYear();
      const MM = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const mm = pad(date.getMinutes());
      return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
   };

   const onSubmit: SubmitHandler<z.infer<typeof eventSchema>> = async (
      values
   ) => {
      // Calculate maxVolunteers from event roles
      const calculatedMaxVolunteers = fields.reduce((sum, _, index) => {
         const maxCount = form.watch(`eventRoles.${index}.maxCount`) || 0;
         return sum + maxCount;
      }, 0);

      // Normalize schema values to match EventParams shape
      const payload: EventParams = {
         title: values.title,
         description: values.description,
         location: values.location,
         startDate: values.startDate,
         endDate: values.endDate,
         dressCode: values.dressCode,
         category: values.category,
         coverUrl: values.coverUrl,
         videoUrl: values.videoUrl ?? null,
         eventImages: values.eventImages,
         maxVolunteers: calculatedMaxVolunteers,
         createdAt: values.createdAt,
         updatedAt: values.updatedAt,
         eventRoles: values.eventRoles,
         quickLinks: values.quickLinks,
      };

      const result =
         isUpdate && event.id
            ? await updateEvent(event.id as string, payload)
            : await createEvent(payload);

      if (result.success) {
         toast.success(
            isUpdate
               ? "Event updated successfully"
               : "Event created successfully"
         );
         form.reset();
         router.push(`/admin/events`);
         router.refresh();
      } else {
         toast.error(result.message);
      }
   };

   return (
      <>
         <div className="w-full overflow-hidden">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5 bg-transparent"
               >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                     <h2 className="text-xl font-bold md:text-2xl lg:text-3xl">
                        {isUpdate ? "Update Event" : "Create a New Event"}
                     </h2>
                     {/* Submit Button */}
                     <Button
                        type="submit"
                        className="hidden w-fit bg-black text-white md:block"
                     >
                        {isUpdate ? "Update Event" : "Create Event"}
                     </Button>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr] lg:gap-10">
                     <div className="flex flex-col gap-5">
                        {/* Title */}
                        <FormField
                           control={form.control}
                           name={"title"}
                           render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                    Event Title
                                 </FormLabel>
                                 <FormControl>
                                    <div className="w-full rounded-md border border-gray-300">
                                       <Input
                                          required
                                          placeholder="Event title"
                                          {...field}
                                          className="w-full rounded-md border-0 px-3 py-2 text-sm transition-all duration-200"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Starting & Ending Date */}
                        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
                           {/* Starting Date */}
                           <FormField
                              control={form.control}
                              name={"startDate"}
                              render={({ field }) => (
                                 <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Start Date
                                    </FormLabel>
                                    <FormControl>
                                       <div className="w-full rounded-md border border-gray-300">
                                          <Input
                                             required
                                             type="datetime-local"
                                             placeholder="Event start date"
                                             value={
                                                field.value
                                                   ? formatDateTimeLocal(
                                                        field.value as Date
                                                     )
                                                   : ""
                                             }
                                             onChange={(e) =>
                                                field.onChange(
                                                   new Date(e.target.value)
                                                )
                                             }
                                             onBlur={field.onBlur}
                                             name={field.name}
                                             ref={field.ref}
                                             className="w-full rounded-md border-0 px-3 py-2 text-sm transition-all duration-200"
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           {/* Ending Date */}
                           <FormField
                              control={form.control}
                              name={"endDate"}
                              render={({ field }) => (
                                 <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       End Date
                                    </FormLabel>
                                    <FormControl>
                                       <div className="w-full rounded-md border border-gray-300">
                                          <Input
                                             required
                                             type="datetime-local"
                                             placeholder="Event end date"
                                             value={
                                                field.value
                                                   ? formatDateTimeLocal(
                                                        field.value as Date
                                                     )
                                                   : ""
                                             }
                                             onChange={(e) =>
                                                field.onChange(
                                                   new Date(e.target.value)
                                                )
                                             }
                                             onBlur={field.onBlur}
                                             name={field.name}
                                             ref={field.ref}
                                             className="w-full rounded-md border-0 px-3 py-2 text-sm transition-all duration-200"
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           {/* Dress Code */}
                           <FormField
                              control={form.control}
                              name={"dressCode"}
                              render={({ field }) => (
                                 <FormItem className="flex w-full flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Dress Code
                                    </FormLabel>
                                    <FormControl>
                                       <div className="w-full rounded-md border border-gray-300">
                                          <Input
                                             placeholder="Dress code"
                                             {...field}
                                             className="w-full rounded-md border-0 px-3 py-2 text-sm transition-all duration-200"
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        {/* Categories */}
                        <FormField
                           control={form.control}
                           name={"category"}
                           render={({ field }) => {
                              const [categoryInput, setCategoryInput] =
                                 useState("");

                              const addCategory = (text: string) => {
                                 const value = text.trim();
                                 if (!value) return;
                                 const current = Array.isArray(field.value)
                                    ? field.value
                                    : [];
                                 if (current.length >= 3) return; // UI cap; schema enforces too
                                 if (current.includes(value)) return; // avoid duplicates
                                 field.onChange([...current, value]);
                                 setCategoryInput("");
                              };

                              const removeCategory = (
                                 valueToRemove: string
                              ) => {
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
                                    addCategory(categoryInput);
                                 } else if (
                                    e.key === "Backspace" &&
                                    categoryInput === ""
                                 ) {
                                    const current = Array.isArray(field.value)
                                       ? field.value
                                       : [];
                                    if (current.length > 0) {
                                       removeCategory(
                                          current[current.length - 1]
                                       );
                                    }
                                 }
                              };

                              return (
                                 <FormItem className="flex w-full flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Categories (press Enter to add, max 3)
                                    </FormLabel>
                                    <FormControl>
                                       <div className="flex h-10 w-full flex-wrap items-center justify-center gap-2 rounded-md border border-gray-300 px-2 text-sm">
                                          {Array.isArray(field.value) &&
                                             field.value.length > 0 &&
                                             field.value.map((cat) => (
                                                <Tag
                                                   key={cat}
                                                   label={cat}
                                                   onRemove={() =>
                                                      removeCategory(cat)
                                                   }
                                                />
                                             ))}
                                          <input
                                             value={categoryInput}
                                             onChange={(e) =>
                                                setCategoryInput(e.target.value)
                                             }
                                             onKeyDown={handleKeyDown}
                                             placeholder={
                                                Array.isArray(field.value) &&
                                                field.value.length >= 3
                                                   ? "Maximum 3 categories"
                                                   : "Type and press Enter to add Event Category (genre, theme, etc.)"
                                             }
                                             disabled={
                                                Array.isArray(field.value) &&
                                                field.value.length >= 3
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

                        {/* Description */}
                        <FormField
                           control={form.control}
                           name={"description"}
                           render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                    Event Description
                                 </FormLabel>
                                 <FormControl>
                                    <div className="w-full rounded-md border border-gray-300">
                                       <Textarea
                                          placeholder="Event description"
                                          {...field}
                                          rows={8}
                                          className="w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                                       />
                                    </div>
                                 </FormControl>

                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Event Roles */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                              <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                 Volunteer Roles & Payouts
                              </FormLabel>
                           </div>

                           {fields.length === 0 && (
                              <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                                 <p>No volunteer roles defined yet</p>
                                 <p>
                                    Click "Add Role" to define volunteer
                                    positions and payouts
                                 </p>
                              </div>
                           )}

                           <div className="flex flex-col gap-4">
                              {fields.map((field, index) => (
                                 <div
                                    key={field.id}
                                    className="space-y-4 rounded-lg border border-gray-300 p-4"
                                 >
                                    <div className="mb-4 flex items-center justify-between">
                                       <h4 className="font-medium text-gray-900">
                                          Role #{index + 1}
                                       </h4>
                                       <Button
                                          type="button"
                                          onClick={() => remove(index)}
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[3fr_1.5fr_1fr]">
                                       {/* Role Name */}
                                       <FormField
                                          control={form.control}
                                          name={`eventRoles.${index}.name`}
                                          render={({ field }) => (
                                             <FormItem className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                   Role Name
                                                </label>
                                                <FormControl>
                                                   <Input
                                                      placeholder="e.g., Event Coordinator"
                                                      {...field}
                                                      className="w-full rounded-md border-dashed border-gray-400 px-3 py-2 text-sm"
                                                   />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />

                                       {/* Payout */}
                                       <FormField
                                          control={form.control}
                                          name={`eventRoles.${index}.payout`}
                                          render={({ field }) => (
                                             <FormItem className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                   Payout Amount
                                                </label>
                                                <FormControl>
                                                   <div className="flex w-full overflow-hidden rounded-md border border-dashed border-gray-400">
                                                      <span className="flex items-center border-r border-gray-400 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                                                         ₹
                                                      </span>
                                                      <Input
                                                         type="number"
                                                         placeholder="0.00"
                                                         value={
                                                            field.value === 0
                                                               ? ""
                                                               : field.value
                                                         }
                                                         onChange={(e) =>
                                                            field.onChange(
                                                               parseFloat(
                                                                  e.target.value
                                                               ) || 0
                                                            )
                                                         }
                                                         className="flex-1 rounded-r-md border-0 px-3 py-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                                      />
                                                   </div>
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />

                                       {/* Max Count */}
                                       <FormField
                                          control={form.control}
                                          name={`eventRoles.${index}.maxCount`}
                                          render={({ field }) => (
                                             <FormItem className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                   Max Volunteers
                                                </label>
                                                <FormControl>
                                                   <Input
                                                      type="number"
                                                      placeholder="1"
                                                      value={
                                                         field.value === 0
                                                            ? ""
                                                            : field.value
                                                      }
                                                      onChange={(e) =>
                                                         field.onChange(
                                                            parseInt(
                                                               e.target.value
                                                            ) || 1
                                                         )
                                                      }
                                                      className="w-full rounded-md border-dashed border-gray-400 px-3 py-2 text-sm"
                                                   />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                    </div>

                                    {/* Role Description */}
                                    <FormField
                                       control={form.control}
                                       name={`eventRoles.${index}.description`}
                                       render={({ field }) => (
                                          <FormItem className="flex flex-col gap-1 md:col-span-2">
                                             <label className="text-xs font-medium text-gray-700">
                                                Role Description
                                             </label>
                                             <FormControl>
                                                <Textarea
                                                   placeholder="Describe the responsibilities and requirements for this role..."
                                                   {...field}
                                                   rows={3}
                                                   className="w-full rounded-md border border-dashed border-gray-400 bg-white px-3 py-2 text-sm focus:ring-0 focus:ring-offset-0"
                                                />
                                             </FormControl>
                                             <FormMessage />
                                          </FormItem>
                                       )}
                                    />
                                 </div>
                              ))}
                           </div>

                           {/* Summary Section */}
                           {fields.length > 0 && (
                              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                 <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                       <h5 className="text-sm font-semibold text-gray-900">
                                          Roles Summary
                                       </h5>
                                       <p className="text-sm text-gray-600">
                                          Total Roles: {fields.length} | Total
                                          Max Volunteers:{" "}
                                          {fields.reduce((sum, _, index) => {
                                             const maxCount =
                                                form.watch(
                                                   `eventRoles.${index}.maxCount`
                                                ) || 0;
                                             return sum + maxCount;
                                          }, 0)}
                                       </p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-sm font-semibold text-gray-900">
                                          Total Payout
                                       </p>
                                       <p className="text-sm text-gray-600">
                                          ₹
                                          {fields
                                             .reduce((sum, _, index) => {
                                                const payout =
                                                   form.watch(
                                                      `eventRoles.${index}.payout`
                                                   ) || 0;
                                                const maxCount =
                                                   form.watch(
                                                      `eventRoles.${index}.maxCount`
                                                   ) || 0;
                                                return sum + payout * maxCount;
                                             }, 0)
                                             .toLocaleString("en-IN")}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           )}

                           <Button
                              type="button"
                              onClick={() =>
                                 append({
                                    name: "",
                                    description: "",
                                    payout: 0,
                                    maxCount: 0,
                                 })
                              }
                              variant="default"
                              size="sm"
                              className="mt-3 flex items-center gap-2 bg-black py-4 text-white hover:bg-gray-800"
                           >
                              <Plus className="h-4 w-4" />
                              Add Role
                           </Button>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center justify-between">
                              <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                 Quick Links
                              </FormLabel>
                           </div>

                           {quickLinkFields.length === 0 && (
                              <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                                 <p>No quick links defined yet</p>
                                 <p>
                                    Click "Add Link" to define helpful links for
                                    enrolled volunteers
                                 </p>
                              </div>
                           )}

                           <div className="flex flex-col gap-4">
                              {quickLinkFields.map((field, index) => (
                                 <div
                                    key={field.id}
                                    className="space-y-4 rounded-lg border border-gray-300 p-4"
                                 >
                                    <div className="mb-4 flex items-center justify-between">
                                       <h4 className="font-medium text-gray-900">
                                          Link #{index + 1}
                                       </h4>
                                       <Button
                                          type="button"
                                          onClick={() => removeQuickLink(index)}
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_3fr_1fr]">
                                       {/* Link Title */}
                                       <FormField
                                          control={form.control}
                                          name={`quickLinks.${index}.title`}
                                          render={({ field }) => (
                                             <FormItem className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                   Link Title
                                                </label>
                                                <FormControl>
                                                   <Input
                                                      placeholder="e.g., Event Schedule"
                                                      {...field}
                                                      className="w-full rounded-md border-dashed border-gray-400 px-3 py-2 text-sm"
                                                   />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />

                                       {/* URL */}
                                       <FormField
                                          control={form.control}
                                          name={`quickLinks.${index}.url`}
                                          render={({ field }) => (
                                             <FormItem className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                   URL
                                                </label>
                                                <FormControl>
                                                   <Input
                                                      type="url"
                                                      placeholder="https://example.com"
                                                      {...field}
                                                      className="w-full rounded-md border-dashed border-gray-400 px-3 py-2 text-sm"
                                                   />
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />

                                       {/* Active Status */}
                                       <FormField
                                          control={form.control}
                                          name={`quickLinks.${index}.isActive`}
                                          render={({ field }) => (
                                             <FormItem className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">
                                                   Status
                                                </label>
                                                <FormControl>
                                                   <select
                                                      {...field}
                                                      value={
                                                         field.value
                                                            ? "true"
                                                            : "false"
                                                      }
                                                      onChange={(e) =>
                                                         field.onChange(
                                                            e.target.value ===
                                                               "true"
                                                         )
                                                      }
                                                      className="w-full rounded-md border-dashed border-gray-400 px-3 py-2 text-sm"
                                                   >
                                                      <option value="true">
                                                         Active
                                                      </option>
                                                      <option value="false">
                                                         Inactive
                                                      </option>
                                                   </select>
                                                </FormControl>
                                                <FormMessage />
                                             </FormItem>
                                          )}
                                       />
                                    </div>
                                 </div>
                              ))}
                           </div>

                           <Button
                              type="button"
                              onClick={() =>
                                 appendQuickLink({
                                    title: "",
                                    url: "",
                                    isActive: true,
                                 })
                              }
                              variant="default"
                              size="sm"
                              className="mt-3 flex items-center gap-2 bg-black py-4 text-white hover:bg-gray-800"
                           >
                              <Plus className="h-4 w-4" />
                              Add Link
                           </Button>
                        </div>
                     </div>

                     <div className="flex w-full flex-col gap-5 md:flex-row lg:w-[450px] lg:flex-col">
                        {/* Cover */}
                        <FormField
                           control={form.control}
                           name={"coverUrl"}
                           render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                 <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                    Event Cover
                                 </FormLabel>
                                 <div className="">
                                    <FormControl>
                                       <div className="w-full max-w-[450px] min-w-[310px] rounded-md border border-dashed border-gray-400">
                                          <FileUpload
                                             type="image"
                                             accept="image/*"
                                             placeholder="Upload an event cover"
                                             folder="events/covers"
                                             variant="dark"
                                             onFileChange={field.onChange}
                                             value={field.value}
                                             className="aspect-video w-full rounded-md border-0 object-cover"
                                          />
                                       </div>
                                    </FormControl>
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className="flex w-full flex-col gap-5">
                           {/* Location */}
                           <FormField
                              control={form.control}
                              name={"location"}
                              render={({ field }) => (
                                 <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Location
                                    </FormLabel>
                                    <FormControl>
                                       <div className="w-full rounded-md border border-gray-300">
                                          <Input
                                             required
                                             placeholder="Event location"
                                             {...field}
                                             className="w-full rounded-md border-0 px-3 py-2 text-sm transition-all duration-200"
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           {/* Max Volunteers - Auto-calculated */}
                           <FormField
                              control={form.control}
                              name={"maxVolunteers"}
                              render={({ field }) => (
                                 <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Max Volunteers (Auto-calculated)
                                    </FormLabel>
                                    <FormControl>
                                       <div className="w-full rounded-md border border-gray-300 bg-gray-50">
                                          <Input
                                             type="number"
                                             placeholder="Auto-calculated from roles"
                                             value={fields.reduce(
                                                (sum, _, index) => {
                                                   const maxCount =
                                                      form.watch(
                                                         `eventRoles.${index}.maxCount`
                                                      ) || 0;
                                                   return sum + maxCount;
                                                },
                                                0
                                             )}
                                             disabled
                                             className="w-full cursor-not-allowed rounded-md border-0 bg-gray-50 px-3 py-2 text-sm transition-all duration-200"
                                          />
                                       </div>
                                    </FormControl>
                                    <p className="text-xs text-gray-500">
                                       This value is automatically calculated
                                       from the sum of all role max counts
                                    </p>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           {/* Event Video */}
                           <FormField
                              control={form.control}
                              name={"videoUrl"}
                              render={({ field }) => (
                                 <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Event Video
                                    </FormLabel>
                                    <FormControl>
                                       <div className="w-full rounded-md border border-gray-300">
                                          <FileUpload
                                             type="video"
                                             accept="video/*"
                                             placeholder="Upload an event video"
                                             folder="events/videos"
                                             variant="dark"
                                             onFileChange={field.onChange}
                                             value={field.value}
                                             className="aspect-video w-full max-w-[450px] min-w-[310px] rounded-md border-dashed border-gray-400 object-cover"
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           {/* Event Images */}
                           <FormField
                              control={form.control}
                              name={"eventImages"}
                              render={({ field }) => (
                                 <FormItem className="flex flex-col gap-1">
                                    <FormLabel className="ml-0.5 block text-xs font-medium text-gray-700 capitalize">
                                       Event Media (Images & Videos)
                                    </FormLabel>
                                    <FormControl>
                                       <div className="flex flex-wrap gap-3">
                                          {Array.isArray(field.value) &&
                                             field.value.length > 0 &&
                                             field.value.map((img, idx) => (
                                                <div
                                                   key={`${img}-${idx}`}
                                                   className="rounded-md border border-gray-300"
                                                >
                                                   <ImageTileUpload
                                                      value={img}
                                                      placeholder="Upload multiple event image"
                                                      mediaType="both"
                                                      onChange={(
                                                         newPath: string | null
                                                      ) => {
                                                         const list =
                                                            Array.isArray(
                                                               field.value
                                                            )
                                                               ? [
                                                                    ...field.value,
                                                                 ]
                                                               : [];
                                                         list[idx] =
                                                            newPath ?? "";
                                                         field.onChange(
                                                            list.filter(Boolean)
                                                         );
                                                      }}
                                                      folder="events/images"
                                                   />
                                                </div>
                                             ))}

                                          {/* Add tile */}
                                          <ImageTileUpload
                                             add
                                             multiple
                                             mediaType="both"
                                             onChange={(
                                                newPath: string | null
                                             ) => {
                                                const current =
                                                   (form.getValues(
                                                      "eventImages"
                                                   ) as string[] | undefined) ??
                                                   [];
                                                field.onChange(
                                                   [
                                                      ...current,
                                                      newPath ?? "",
                                                   ].filter(Boolean)
                                                );
                                             }}
                                             folder="events/images"
                                             className="rounded-md border border-dashed border-gray-400"
                                          />
                                       </div>
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>
                  </div>
               </form>

               {/* Submit Button */}
               <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="mt-5 block w-full bg-black text-white md:hidden"
               >
                  {isUpdate ? "Update Event" : "Create Event"}
               </Button>
            </Form>
         </div>
      </>
   );
};

export default EventForm;
