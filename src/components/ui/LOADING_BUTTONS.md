# Loading Button Implementation

This document describes the loading button functionality implemented across the codebase.

## Overview

We've implemented a comprehensive loading button system that provides consistent user feedback during async operations. The system includes:

1. **Built-in Button loading prop** - Simple loading state for basic use cases
2. **LoadingButton component** - Advanced loading state with custom text and icons
3. **Consistent patterns** - Standardized loading behavior across all components

## Components

### 1. Button Component (Enhanced)

The base `Button` component now includes a `loading` prop:

```tsx
<Button loading={isLoading} onClick={handleClick}>
   Save Changes
</Button>
```

**Features:**

- Automatically disables the button when loading
- Shows a spinning loader icon
- Replaces button content with the loader

### 2. LoadingButton Component

For more complex loading states, use the `LoadingButton` component:

```tsx
<LoadingButton
   loading={isLoading}
   loadingText="Custom loading text..."
   loadingIcon={<CustomIcon />}
   onClick={handleClick}
>
   <SaveIcon className="mr-2 h-4 w-4" />
   Save Changes
</LoadingButton>
```

**Features:**

- Custom loading text
- Custom loading icons
- Maintains button styling and behavior
- Extends all Button props

## Implementation Examples

### Basic Usage

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
   setIsLoading(true);
   try {
      await submitData();
   } finally {
      setIsLoading(false);
   }
};

return (
   <Button loading={isLoading} onClick={handleSubmit}>
      Submit
   </Button>
);
```

### Advanced Usage

```tsx
const [isUploading, setIsUploading] = useState(false);

return (
   <LoadingButton
      loading={isUploading}
      loadingText="Uploading file..."
      onClick={handleUpload}
   >
      <Upload className="mr-2 h-4 w-4" />
      Upload File
   </LoadingButton>
);
```

## Updated Components

The following components have been updated to use the new loading patterns:

### 1. DeleteEvent Component

- **File:** `src/components/admin/forms/DeleteEvent.tsx`
- **Changes:** Replaced custom spinner with built-in loading prop
- **Before:** Manual spinner with conditional rendering
- **After:** Clean `loading={loading}` prop

### 2. EnrollButton Component

- **File:** `src/components/EnrollButton.tsx`
- **Changes:** Updated both enroll and cancel buttons
- **Benefits:** Consistent loading behavior across all enrollment actions

### 3. EnrollmentActions Component

- **File:** `src/components/admin/EnrollmentActions.tsx`
- **Changes:** Simplified approve/reject button loading states
- **Benefits:** Cleaner code, better UX

### 4. EventOverview Component

- **File:** `src/components/EventOverview.tsx`
- **Changes:** Updated enrollment button loading state
- **Benefits:** Consistent with other enrollment components

### 5. Profile Page

- **File:** `src/app/(root)/profile/page.tsx`
- **Changes:** Updated verification request and refresh buttons
- **Benefits:** Better user feedback during profile operations

### 6. FileUpload Component

- **File:** `src/components/FileUpload.tsx`
- **Changes:** Enhanced with Button component and loading prop
- **Benefits:** Consistent with other button components

## Benefits

### 1. Consistency

- All buttons now use the same loading pattern
- Uniform spinner design and behavior
- Consistent user experience across the app

### 2. Developer Experience

- Simple `loading` prop for basic cases
- Advanced `LoadingButton` for complex scenarios
- TypeScript support with proper prop types
- Reduced boilerplate code

### 3. User Experience

- Clear visual feedback during async operations
- Prevents multiple submissions
- Professional loading animations
- Accessible loading states

### 4. Maintainability

- Centralized loading logic
- Easy to update loading behavior globally
- Consistent error handling patterns
- Reduced code duplication

## Usage Guidelines

### When to Use Basic Button

- Simple async operations
- Standard loading behavior is sufficient
- Quick implementation needed

```tsx
<Button loading={isLoading} onClick={handleClick}>
   Action
</Button>
```

### When to Use LoadingButton

- Need custom loading text
- Want custom loading icons
- Complex loading states
- Need to maintain button content during loading

```tsx
<LoadingButton
   loading={isLoading}
   loadingText="Processing..."
   loadingIcon={<CustomIcon />}
   onClick={handleClick}
>
   <Icon className="mr-2 h-4 w-4" />
   Action
</LoadingButton>
```

## Migration Guide

### From Custom Loading Implementation

**Before:**

```tsx
<Button disabled={isLoading} onClick={handleClick}>
   {isLoading ? (
      <>
         <Spinner className="animate-spin" />
         Loading...
      </>
   ) : (
      "Save"
   )}
</Button>
```

**After:**

```tsx
<Button loading={isLoading} onClick={handleClick}>
   Save
</Button>
```

### From Manual State Management

**Before:**

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleClick = async () => {
   setIsLoading(true);
   try {
      await doSomething();
   } finally {
      setIsLoading(false);
   }
};
```

**After:**

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleClick = async () => {
   setIsLoading(true);
   try {
      await doSomething();
   } finally {
      setIsLoading(false);
   }
};

// Button automatically handles loading state
<Button loading={isLoading} onClick={handleClick}>
   Action
</Button>;
```

## Future Enhancements

1. **Progress Indicators** - Add progress bars for long-running operations
2. **Success States** - Show success feedback after completion
3. **Error States** - Visual error indicators
4. **Animation Variants** - Different loading animations
5. **Accessibility** - Enhanced screen reader support

## Testing

The loading button functionality can be tested using the example component:

```tsx
import LoadingButtonExample from "@/components/examples/LoadingButtonExample";

// Use in your test page
<LoadingButtonExample />;
```

This provides interactive examples of all loading button patterns and can be used for manual testing and demonstration purposes.
