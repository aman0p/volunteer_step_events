"use client";

import config from "@/lib/config";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Image as IKImage, Video as IKVideo } from "@imagekit/next";
import useSingleFileUpload from "@/lib/hooks/useSingleFileUpload";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

// Legacy authenticator kept for backward compatibility, now unused internally
const authenticator = async () => {
  const response = await fetch(`${config.env.apiEndpoint}/api/imagekit-auth`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  const { token, expire, signature, publicKey } = data;
  return { token, expire, signature, publicKey };
};

interface FileUploadProps {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
  className?: string;
  overlayMode?: "change" | "remove"; // which overlay button to show when file is present
  onRemove?: () => void; // called when overlayMode is remove and user clicks
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
  className,
  overlayMode = "change",
  onRemove,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Sync internal state with value prop changes
  useEffect(() => {
    setFile({ filePath: value ?? null });
  }, [value]);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100 text-sm" : "text-slate-500 text-sm",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.log(error);
    setIsUploading(false);
    setProgress(0);

    toast.error(`${type} upload failed`, {
      description: `Your ${type} could not be uploaded. Please try again.`,
    });
  };

  const onSuccess = (res: any) => {
    setFile({ filePath: res.filePath });
    onFileChange(res.filePath);
    setIsUploading(false);
    setProgress(0);

    toast.success(`${type} uploaded successfully`, {
      description: `${res.filePath} uploaded successfully!`,
    });
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "Please upload a file that is less than 20MB in size",
        });

        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size too large", {
          description: "Please upload a file that is less than 50MB in size",
        });
        return false;
      }
    }

    return true;
  };

  const { isUploading: isUploadingHook, startUpload } = useSingleFileUpload({
    type,
    folder,
    onProgress: (p) => setProgress(p),
    onSuccess: onSuccess,
    onError,
  });

  useEffect(() => {
    setIsUploading(isUploadingHook);
  }, [isUploadingHook]);

  const handleFileUpload = async (selectedFile: File) => {
    if (!onValidate(selectedFile)) return;
    await startUpload(selectedFile);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!file.filePath ? (
        <button
          className={cn("flex min-h-9 w-full items-center justify-center gap-1.5 text-sm border border-gray-200 rounded-md bg-white shadow-xs transition-all duration-200 focus:outline-none relative overflow-hidden", styles.button, className)}
          onClick={(e) => {
            e.preventDefault();
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          disabled={isUploading}
        >
          {/* Progress bar background */}
          {isUploading && (
            <div className="absolute inset-0 bg-green-100 transition-all duration-300 ease-out" />
          )}
          
          {/* Progress bar fill */}
          {isUploading && (
            <div 
              className="absolute inset-0 bg-green-300 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          )}

          <Image
            src="/icons/upload.svg"
            alt="upload-icon"
            width={15}
            height={15}
            className="object-contain relative z-10"
          />

          <p className={cn("text-sm relative z-10", styles.placeholder)}>
            {isUploading ? `${progress}% Uploading...` : placeholder}
          </p>
        </button>
      ) : (
        <div className={cn("relative", className)}>
          <div className="relative w-full aspect-video rounded-md overflow-hidden border">
            {type === "image" ? (
              <IKImage
                src={file.filePath}
                urlEndpoint={urlEndpoint}
                alt={file.filePath}
                width={400}
                height={225}
                className="object-cover w-full h-full"
              />
            ) : type === "video" ? (
              <IKVideo
                src={file.filePath}
                urlEndpoint={urlEndpoint}
                controls={true}
                className="w-full h-full object-cover"
              />
            ) : null}
            
            {/* Overlay button: change or remove in the exact same position */}
            {overlayMode === "change" ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors duration-200"
                title="Change file"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M3 21v-5h5"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Clear current file and notify parent
                  setFile({ filePath: null });
                  try { onFileChange(""); } catch {}
                  if (onRemove) onRemove();
                }}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-2 transition-colors duration-200"
                title="Remove file"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18"/>
                  <path d="M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress is now shown inside the button */}
    </>
  );
};

export default FileUpload;
