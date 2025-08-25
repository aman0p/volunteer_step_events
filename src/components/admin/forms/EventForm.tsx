"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
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
import { createEvent } from "@/lib/admin/action/events";

interface Props extends Partial<Event> {
  type?: "create" | "update";
}

const EventForm = ({ type, ...event }: Props) => {
  const router = useRouter();

  const form = (useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      dressCode: "",
      coverUrl: "",
      eventImages: [],
      category: [],
      maxVolunteers: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }) as UseFormReturn<z.infer<typeof eventSchema>>);
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
    const result = await createEvent(values);

    if (result.success) {
      toast.success("Event created successfully");
      console.log(result.data);
      form.reset();
      router.push(`/admin/events`);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 bg-transparent">
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
                    <Input
                      required
                      placeholder="Event title"
                      {...field}
                      className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Starting & Ending Date */}
            <div className="flex flex-col md:flex-row gap-5 w-full">

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
                      <Input
                        required
                        type="datetime-local"
                        placeholder="Event start date"
                        value={field.value ? formatDateTimeLocal(field.value as Date) : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200"
                      />
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
                      <Input
                        required
                        type="datetime-local"
                        placeholder="Event end date"
                        value={field.value ? formatDateTimeLocal(field.value as Date) : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200"
                      />
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
                      <Input
                        placeholder="Dress code"
                        {...field}
                        className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200"
                      />
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
                      <div className="w-full border border-gray-200 h-10 px-2 items-center justify-center text-sm rounded-md bg-gray-50 flex gap-2 flex-wrap">
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
                              : "Type and press Enter"
                          }
                          disabled={Array.isArray(field.value) && field.value.length >= 3}
                          className="flex-1 min-w-[160px] bg-transparent outline-none text-sm placeholder:text-gray-400"
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
                    <Textarea
                      placeholder="Event description"
                      {...field}
                      rows={8}
                      className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload an event cover"
                        folder="events/covers"
                        variant="dark"
                        onFileChange={field.onChange}
                        value={field.value}
                        className="max-w-[450px] min-w-[310px] w-full aspect-video object-cover"
                      />
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
                      <Input
                        required
                        placeholder="Event location"
                        {...field}
                        className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200"
                      />
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
                      <Input
                        type="number"
                        placeholder="Maximum volunteers"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 text-sm border-gray-200 rounded-md bg-gray-50 transition-all duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

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
                    <div key={`${img}-${idx}`} className="flex flex-col">
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
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full mt-5">
          Create Event
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
