"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn, type SubmitHandler, useFieldArray } from "react-hook-form";
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



  const form = (useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: isUpdate
      ? {
        title: (event.title as string) ?? "",
        description: (event.description as string) ?? "",
        location: (event.location as string) ?? "",
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : new Date(),
        dressCode: (event.dressCode as string) ?? "",
        coverUrl: (event.coverUrl as string) ?? "",
        videoUrl: (event.videoUrl as string) ?? "",
        eventImages: (event.eventImages as string[]) ?? [],
        category: (event.category as string[]) ?? [],
        maxVolunteers:
          typeof event.maxVolunteers === "number" ? event.maxVolunteers : undefined,
        createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
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
  }) as UseFormReturn<z.infer<typeof eventSchema>>);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "eventRoles",
  });

  const { fields: quickLinkFields, append: appendQuickLink, remove: removeQuickLink } = useFieldArray({
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

  const onSubmit: SubmitHandler<z.infer<typeof eventSchema>> = async (values) => {
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
      maxVolunteers: values.maxVolunteers,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt,
      eventRoles: values.eventRoles,
      quickLinks: values.quickLinks,
    };

    const result = isUpdate && event.id
      ? await updateEvent(event.id as string, payload)
      : await createEvent(payload);

    if (result.success) {
      toast.success(isUpdate ? "Event updated successfully" : "Event created successfully");
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
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">{isUpdate ? "Update Event" : "Create a New Event"}</h2>
              {/* Submit Button */}
              <Button type="submit" className="w-fit bg-black text-white hidden md:block">
                {isUpdate ? "Update Event" : "Create Event"}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 lg:gap-10 w-full">

              <div className="flex flex-col gap-5">

                {/* Title */}
                <FormField
                  control={form.control}
                  name={"title"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                        Event Title
                      </FormLabel>
                      <FormControl>
                        <div className="w-full border border-gray-300 rounded-md">
                          <Input
                            required
                            placeholder="Event title"
                            {...field}
                            className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Starting & Ending Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">

                  {/* Starting Date */}
                  <FormField
                    control={form.control}
                    name={"startDate"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <div className="w-full border border-gray-300 rounded-md">
                            <Input
                              required
                              type="datetime-local"
                              placeholder="Event start date"
                              value={field.value ? formatDateTimeLocal(field.value as Date) : ""}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0"
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
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          End Date
                        </FormLabel>
                        <FormControl>
                          <div className="w-full border border-gray-300 rounded-md">
                            <Input
                              required
                              type="datetime-local"
                              placeholder="Event end date"
                              value={field.value ? formatDateTimeLocal(field.value as Date) : ""}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0"
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
                      <FormItem className="flex flex-col gap-1 w-full">
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Dress Code
                        </FormLabel>
                        <FormControl>
                          <div className="w-full border border-gray-300 rounded-md">
                            <Input
                              placeholder="Dress code"
                              {...field}
                              className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0"
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
                    const [categoryInput, setCategoryInput] = useState("");

                    const addCategory = (text: string) => {
                      const value = text.trim();
                      if (!value) return;
                      const current = Array.isArray(field.value) ? field.value : [];
                      if (current.length >= 3) return; // UI cap; schema enforces too
                      if (current.includes(value)) return; // avoid duplicates
                      field.onChange([...current, value]);
                      setCategoryInput("");
                    };

                    const removeCategory = (valueToRemove: string) => {
                      const current = Array.isArray(field.value) ? field.value : [];
                      field.onChange(current.filter((c) => c !== valueToRemove));
                    };

                    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
                      e
                    ) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addCategory(categoryInput);
                      } else if (e.key === "Backspace" && categoryInput === "") {
                        const current = Array.isArray(field.value) ? field.value : [];
                        if (current.length > 0) {
                          removeCategory(current[current.length - 1]);
                        }
                      }
                    };

                    return (
                      <FormItem className="flex flex-col gap-1 w-full">
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Categories (press Enter to add, max 3)
                        </FormLabel>
                        <FormControl>
                          <div className="w-full h-10 px-2 items-center justify-center text-sm flex gap-2 flex-wrap border border-gray-300 rounded-md">
                            {Array.isArray(field.value) && field.value.length > 0 && (
                              field.value.map((cat) => (
                                <Tag key={cat} label={cat} onRemove={() => removeCategory(cat)} />
                              ))
                            )}
                            <input
                              value={categoryInput}
                              onChange={(e) => setCategoryInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder={
                                Array.isArray(field.value) && field.value.length >= 3
                                  ? "Maximum 3 categories"
                                  : "Type and press Enter to add Event Category (genre, theme, etc.)"
                              }
                              disabled={Array.isArray(field.value) && field.value.length >= 3}
                              className="flex-1 min-w-[160px] bg-transparent outline-none text-sm placeholder:text-gray-500 placeholder:pl-1"
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
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                        Event Description
                      </FormLabel>
                      <FormControl>
                        <div className="w-full border border-gray-300 rounded-md">
                          <Textarea
                            placeholder="Event description"
                            {...field}
                            rows={8}
                            className="w-full px-3 py-2 text-sm rounded-md bg-transparent transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0 border-0"
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
                    <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                      Volunteer Roles & Payouts
                    </FormLabel>
                  </div>

                  {fields.length === 0 && (
                    <div className="text-center text-sm py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <p>No volunteer roles defined yet</p>
                      <p>Click "Add Role" to define volunteer positions and payouts</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border border-gray-300 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Role #{index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr] gap-4">
                          {/* Role Name */}
                          <FormField
                            control={form.control}
                            name={`eventRoles.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-700">Role Name</label>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Event Coordinator"
                                    {...field}
                                    className="w-full px-3 py-2 text-sm rounded-md border-dashed border-gray-400"
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
                                <label className="text-xs font-medium text-gray-700">Payout Amount</label>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 text-sm rounded-md border-dashed border-gray-400"
                                  />
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
                                <label className="text-xs font-medium text-gray-700">Max Volunteers</label>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                    className="w-full px-3 py-2 text-sm rounded-md border-dashed border-gray-400"
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
                              <label className="text-xs font-medium text-gray-700">Role Description</label>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the responsibilities and requirements for this role..."
                                  {...field}
                                  rows={3}
                                  className="w-full px-3 py-2 text-sm rounded-md border border-dashed border-gray-400 bg-white focus:ring-0 focus:ring-offset-0 "
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
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                          <h5 className="font-semibold text-sm text-gray-900">Roles Summary</h5>
                          <p className="text-sm text-gray-600">
                            Total Roles: {fields.length} | 
                            Total Max Volunteers: {fields.reduce((sum, _, index) => {
                              const maxCount = form.watch(`eventRoles.${index}.maxCount`) || 0;
                              return sum + maxCount;
                            }, 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">Total Payout</p>
                          <p className="text-sm text-gray-600">
                            ₹{fields.reduce((sum, _, index) => {
                              const payout = form.watch(`eventRoles.${index}.payout`) || 0;
                              const maxCount = form.watch(`eventRoles.${index}.maxCount`) || 0;
                              return sum + (payout * maxCount);
                            }, 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() => append({
                      name: "",
                      description: "",
                      payout: 0,
                      maxCount: 1
                    })}
                    variant="default"
                    size="sm"
                    className="flex items-center py-4 gap-2 mt-3 bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Role
                  </Button>

                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                      Quick Links
                    </FormLabel>
                  </div>

                  {quickLinkFields.length === 0 && (
                    <div className="text-center text-sm py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <p>No quick links defined yet</p>
                      <p>Click "Add Link" to define helpful links for enrolled volunteers</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4">
                    {quickLinkFields.map((field, index) => (
                      <div key={field.id} className="border border-gray-300 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Link #{index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeQuickLink(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr] gap-4">
                          {/* Link Title */}
                          <FormField
                            control={form.control}
                            name={`quickLinks.${index}.title`}
                            render={({ field }) => (
                              <FormItem className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-700">Link Title</label>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Event Schedule"
                                    {...field}
                                    className="w-full px-3 py-2 text-sm rounded-md border-dashed border-gray-400"
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
                                <label className="text-xs font-medium text-gray-700">URL</label>
                                <FormControl>
                                  <Input
                                    type="url"
                                    placeholder="https://example.com"
                                    {...field}
                                    className="w-full px-3 py-2 text-sm rounded-md border-dashed border-gray-400"
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
                                <label className="text-xs font-medium text-gray-700">Status</label>
                                <FormControl>
                                  <select
                                    {...field}
                                    value={field.value ? "true" : "false"}
                                    onChange={(e) => field.onChange(e.target.value === "true")}
                                    className="w-full px-3 py-2 text-sm rounded-md border-dashed border-gray-400"
                                  >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
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
                    onClick={() => appendQuickLink({
                      title: "",
                      url: "",
                      isActive: true
                    })}
                    variant="default"
                    size="sm"
                    className="flex items-center py-4 gap-2 mt-3 bg-black text-white hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </Button>

                </div>

              </div>


              <div className="flex flex-col md:flex-row lg:flex-col gap-5 w-full lg:w-[450px]">

                {/* Cover */}
                <FormField
                  control={form.control}
                  name={"coverUrl"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                        Event Cover
                      </FormLabel>
                      <div className="">
                        <FormControl>
                          <div className="max-w-[450px] min-w-[310px] w-full rounded-md border border-gray-400 border-dashed">
                            <FileUpload
                              type="image"
                              accept="image/*"
                              placeholder="Upload an event cover"
                              folder="events/covers"
                              variant="dark"
                              onFileChange={field.onChange}
                              value={field.value}
                              className="w-full aspect-video object-cover border-0 rounded-md"
                            />
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-5 w-full">
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name={"location"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Location
                        </FormLabel>
                        <FormControl>
                          <div className="w-full border border-gray-300 rounded-md">
                            <Input
                              required
                              placeholder="Event location"
                              {...field}
                              className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Max Volunteers */}
                  <FormField
                    control={form.control}
                    name={"maxVolunteers"}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-1">
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Max Volunteers
                        </FormLabel>
                        <FormControl>
                          <div className="w-full border border-gray-300 rounded-md">
                            <Input
                              type="number"
                              placeholder="Maximum volunteers"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === "" ? undefined : Number(e.target.value)
                                )
                              }
                              className="w-full px-3 py-2 text-sm rounded-md transition-all duration-200 border-0"
                            />
                          </div>
                        </FormControl>
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
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Event Video
                        </FormLabel>
                        <FormControl>
                          <div className="w-full border border-gray-300 rounded-md">
                            <FileUpload
                              type="video"
                              accept="video/*"
                              placeholder="Upload an event video"
                              folder="events/videos"
                              variant="dark"
                              onFileChange={field.onChange}
                              value={field.value}
                              className="max-w-[450px] min-w-[310px] aspect-video object-cover w-full rounded-md border-gray-400 border-dashed"
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
                        <FormLabel className="capitalize text-xs font-medium text-gray-700 block ml-0.5">
                          Event Media (Images & Videos)
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-3">
                            {Array.isArray(field.value) && field.value.length > 0 && field.value.map((img, idx) => (
                              <div key={`${img}-${idx}`} className="rounded-md border border-gray-300">
                                <ImageTileUpload
                                  value={img}
                                  placeholder="Upload multiple event image"
                                  mediaType="both"
                                  onChange={(newPath: string | null) => {
                                    const list = Array.isArray(field.value) ? [...field.value] : [];
                                    list[idx] = newPath ?? "";
                                    field.onChange(list.filter(Boolean));
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
                              onChange={(newPath: string | null) => {
                                const current = (form.getValues("eventImages") as string[] | undefined) ?? [];
                                field.onChange([...current, newPath ?? ""].filter(Boolean));
                              }}
                              folder="events/images"
                              className="border border-gray-400 border-dashed rounded-md"
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
            className="w-full mt-5 bg-black text-white block md:hidden"
          >
            {isUpdate ? "Update Event" : "Create Event"}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default EventForm;
