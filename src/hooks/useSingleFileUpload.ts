"use client";

import { useState } from "react";
import config from "@/lib/config";
import { upload } from "@imagekit/next";

type Params = {
  type: "image" | "video";
  folder: string;
  onProgress: (percent: number) => void;
  onSuccess: (res: any) => void;
  onError: (err: any) => void;
};

export function useSingleFileUpload({ type, folder, onProgress, onSuccess, onError }: Params) {
  const [isUploading, setIsUploading] = useState(false);

  const validate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        return { ok: false, message: "Please upload an image smaller than 20MB" };
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        return { ok: false, message: "Please upload a video smaller than 50MB" };
      }
    }
    return { ok: true };
  };

  const startUpload = async (file: File) => {
    const result = validate(file);
    if (!result.ok) {
      onError(new Error(result.message));
      return;
    }
    setIsUploading(true);
    onProgress(0);
    try {
      const authRes = await fetch(`${config.env.apiEndpoint}/api/imagekit-auth`);
      if (!authRes.ok) {
        const errorText = await authRes.text();
        throw new Error(`Request failed with status ${authRes.status}: ${errorText}`);
      }
      const { token, expire, signature, publicKey } = await authRes.json();

      const response = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
        folder,
        useUniqueFileName: true,
        onProgress: (evt: { loaded: number; total: number }) => {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress(percent);
        },
      });
      onSuccess(response);
    } catch (err) {
      onError(err);
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, startUpload };
}

export default useSingleFileUpload;


