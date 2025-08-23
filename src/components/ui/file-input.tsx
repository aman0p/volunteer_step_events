import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  accept?: string
  onFileChange?: (file: File | null) => void
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, label, accept = "image/*", onFileChange, ...props }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null
      onFileChange?.(file)
    }

    return (
      <div className="w-full">
        {label && (
          <label className="text-xs mb-2 block">{label}</label>
        )}
        <div className="relative">
          <input
            type="file"
            className={cn(
              "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
              className
            )}
            accept={accept}
            onChange={handleFileChange}
            ref={ref}
            {...props}
          />
          <div className="flex items-center justify-center w-full h-10 px-3 py-2 text-sm border border-black/50 border-2 rounded-md bg-background hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            <span className="text-muted-foreground">Choose file</span>
          </div>
        </div>
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput }
