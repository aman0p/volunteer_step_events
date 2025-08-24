# Toast System Documentation

This project now uses **Sonner** directly for all toast notifications instead of the previous Radix UI toast system.

## Features

- ✅ **Modern & Lightweight**: Sonner provides a better user experience with smooth animations
- ✅ **TypeScript Support**: Full type safety with Sonner's built-in types
- ✅ **Multiple Variants**: Support for success, error, info, warning, and destructive toasts
- ✅ **Promise Support**: Built-in promise toast handling
- ✅ **Action Buttons**: Support for clickable actions in toasts
- ✅ **Customizable Duration**: Configurable toast display time
- ✅ **Simplified API**: Direct Sonner usage without wrapper functions

## Usage

### Basic Toast

```tsx
import { toast } from "sonner"

// Simple toast
toast("Success! Your action was completed successfully.")

// Success toast
toast.success("Success! Your action was completed successfully.")

// Error toast
toast.error("Error! Something went wrong.")

// Info toast
toast.info("Info: Here's some information")

// Warning toast
toast.warning("Warning: Please be careful")

// Destructive toast
toast.error("Error: Critical error occurred")
```

### Toast with Description

```tsx
import { toast } from "sonner"

toast.success("File uploaded", {
  description: "Your file has been uploaded successfully"
})

toast.error("Upload failed", {
  description: "Please check your connection and try again"
})
```

### Toast with Actions

```tsx
import { toast } from "sonner"

toast("File uploaded", {
  description: "Your file has been uploaded successfully",
  action: {
    label: "View",
    onClick: () => {
      // Handle action click
      console.log("View file clicked")
    }
  }
})
```

### Promise Toast

```tsx
import { toast } from "sonner"

const uploadFile = async (file: File) => {
  // Simulate file upload
  await new Promise(resolve => setTimeout(resolve, 2000))
  return { success: true }
}

toast.promise(uploadFile(file), {
  loading: "Uploading file...",
  success: "File uploaded successfully!",
  error: "Failed to upload file"
})
```

### Dismiss Toasts

```tsx
import { toast } from "sonner"

// Dismiss specific toast
toast.dismiss("toast-id")

// Dismiss all toasts
toast.dismiss()
```

### Custom Duration

```tsx
import { toast } from "sonner"

toast.success("Quick message", {
  duration: 2000 // 2 seconds
})

toast.info("Long message", {
  duration: 10000 // 10 seconds
})
```

## Toast Variants

- `toast()` - Standard toast (default)
- `toast.success()` - Green success toast
- `toast.error()` - Red error toast
- `toast.info()` - Blue info toast
- `toast.warning()` - Yellow warning toast

## Configuration

The Sonner Toaster is already configured in your root layout (`src/app/layout.tsx`). You can customize it by modifying the `<Toaster />` component props.

## Migration from Old System

The system has been simplified to use Sonner directly:

```tsx
// Old way (no longer works)
toast({
  title: "Hello",
  description: "World",
  variant: "destructive"
})

// New way (Sonner direct)
toast.error("Hello", {
  description: "World"
})
```

## Benefits of Direct Sonner Usage

1. **Simplified API**: No wrapper functions, direct access to all Sonner features
2. **Better Performance**: Lighter bundle size and faster rendering
3. **Modern Design**: Better animations and visual appeal
4. **Accessibility**: Improved keyboard navigation and screen reader support
5. **Mobile Friendly**: Better touch interactions and mobile experience
6. **Customizable**: Easy to customize themes and styles
7. **Promise Support**: Built-in promise handling for async operations
8. **Type Safety**: Full TypeScript support with Sonner's built-in types

## Examples in This Project

Check these files for real usage examples:
- `src/components/FileUpload.tsx` - File upload success/error toasts
- `src/components/AuthForm.tsx` - Authentication success/error toasts

## Sonner Documentation

For advanced features and customization, refer to the official Sonner documentation:
https://sonner.emilkowal.ski/
