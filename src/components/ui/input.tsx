import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  // const themedStyle: React.CSSProperties = {
  //   backgroundColor: "var(--themed-input-
  // bg, var(--themed-surface, transparent))",
  //   ...(style as React.CSSProperties),
  // }
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className
      )}
      // style={themedStyle}
      {...props}
    />
  )
}

export { Input }
