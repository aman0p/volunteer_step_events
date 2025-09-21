"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Upload, Trash2 } from "lucide-react";

export default function LoadingButtonExample() {
   const [isSaving, setIsSaving] = useState(false);
   const [isDownloading, setIsDownloading] = useState(false);
   const [isUploading, setIsUploading] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const handleSave = async () => {
      setIsSaving(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSaving(false);
   };

   const handleDownload = async () => {
      setIsDownloading(true);
      // Simulate download
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsDownloading(false);
   };

   const handleUpload = async () => {
      setIsUploading(true);
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsUploading(false);
   };

   const handleDelete = async () => {
      setIsDeleting(true);
      // Simulate deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsDeleting(false);
   };

   return (
      <div className="space-y-6 p-6">
         <h2 className="text-2xl font-bold">Loading Button Examples</h2>

         <div className="space-y-4">
            <h3 className="text-lg font-semibold">
               Basic Button with Loading Prop
            </h3>
            <div className="flex gap-4">
               <Button onClick={handleSave} loading={isSaving}>
                  Save Changes
               </Button>
               <Button
                  onClick={handleDownload}
                  loading={isDownloading}
                  variant="outline"
               >
                  Download
               </Button>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-semibold">
               LoadingButton with Custom Loading Text
            </h3>
            <div className="flex gap-4">
               <LoadingButton
                  onClick={handleUpload}
                  loading={isUploading}
                  loadingText="Uploading..."
                  className="bg-blue-600 hover:bg-blue-700"
               >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
               </LoadingButton>
               <LoadingButton
                  onClick={handleDelete}
                  loading={isDeleting}
                  loadingText="Deleting..."
                  variant="destructive"
               >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Item
               </LoadingButton>
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-lg font-semibold">Different Button States</h3>
            <div className="flex gap-4">
               <Button disabled>Disabled Button</Button>
               <Button loading>Always Loading</Button>
               <Button variant="outline" loading>
                  Loading Outline
               </Button>
               <Button variant="destructive" loading>
                  Loading Destructive
               </Button>
            </div>
         </div>
      </div>
   );
}
