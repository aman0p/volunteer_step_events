"use client";

import React, { useRef, useState } from "react";
import FileUpload from "@/components/FileUpload";
import { cn } from "@/lib/utils";
import useMultiFileUpload from "@/lib/hooks/useMultiFileUpload";
import Image from "next/image";

type Props = {
  value?: string;
  onChange: (value: string | null) => void;
  folder: string;
  className?: string;
  add?: boolean; // if true, shows the + tile; otherwise shows the image tile
  multiple?: boolean; // allow multiple selection at once when add is true
  placeholder?: string; // optional placeholder to mirror cover wording
  mediaType?: "image" | "video" | "both"; // what type of media to accept
};

export default function ImageTileUpload({ value, onChange, folder, className, add, multiple, placeholder, mediaType = "image" }: Props) {
  // Add tile
  if (add) {
    // When multiple is enabled, handle uploads here to spawn per-file progress tiles
    const { pending, startUploads } = useMultiFileUpload(folder, (filePath) => onChange(filePath), mediaType);
    const inputRef = useRef<HTMLInputElement>(null);

    if (multiple) {
      return (
        <div className={cn("flex items-start gap-3 flex-wrap", className)}>
          {pending.map((item) => (
            <div key={item.id} className="relative w-[310px] md:w-[290px] aspect-video rounded-md overflow-hidden border bg-white shadow-xs">
              <div className="absolute inset-0 bg-green-100" />
              <div className="absolute inset-0 bg-green-300" style={{ width: `${item.progress}%` }} />
              <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-700">{item.progress}% Uploading...</div>
            </div>
          ))}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              inputRef.current?.click();
            }}
            className="w-[310px] md:w-[290px] aspect-video border border-gray-200 rounded-md bg-white shadow-xs hover:bg-gray-50 flex items-center justify-center"
            title="Add images"
          >
            <div className="flex items-center gap-1.5">
            <Image
            src="/icons/upload.svg"
            alt="upload-icon"
            width={15}
            height={15}
            className="object-contain relative z-10"
          />
              <span className="text-sm ">{placeholder ?? "Upload event images"}</span>
            </div>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={mediaType === "both" ? "image/*,video/*" : mediaType === "video" ? "video/*" : "image/*"}
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                startUploads(files);
                e.currentTarget.value = ""; // reset to allow reselecting same files
              }
            }}
          />
        </div>
      );
    }

    // Single add: delegate to FileUpload so its built-in progress is used
    const [nonce, setNonce] = useState(0);
    return (
      <div className="w-[310px] md:w-[290px]">
        <FileUpload
          key={nonce}
          type={mediaType === "video" ? "video" : "image"}
          accept={mediaType === "both" ? "image/*,video/*" : mediaType === "video" ? "video/*" : "image/*"}
          placeholder={placeholder ?? (mediaType === "both" ? "Add media" : mediaType === "video" ? "Add video" : "Add image")}
          folder={folder}
          variant="dark"
          onFileChange={(p) => {
            onChange(p);
            setNonce((n) => n + 1);
          }}
          className={cn("w-[310px] md:w-[290px] aspect-video")}
        />
      </div>
    );
  }

  // Media tile with change on click - auto-detect type for "both"
  const detectMediaType = (filePath: string) => {
    if (mediaType === "both") {
      const extension = filePath.split('.').pop()?.toLowerCase();
      return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension || '') ? "video" : "image";
    }
    return mediaType === "video" ? "video" : "image";
  };

  return (
    <div className={cn("w-[310px] md:w-[290px]", className)}>
      <FileUpload
        type={detectMediaType(value || "")}
        accept={mediaType === "both" ? "image/*,video/*" : mediaType === "video" ? "video/*" : "image/*"}
        placeholder={placeholder ?? (mediaType === "video" ? "Change video" : "Change image")}
        folder={folder}
        variant="dark"
        value={value ?? undefined}
        onFileChange={(p) => onChange(p)}
        overlayMode="remove"
        onRemove={() => onChange(null)}
        className="w-[310px] md:w-[290px]"
      />
    </div>
  );
}


