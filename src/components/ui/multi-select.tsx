import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ options, selected, onChange, placeholder = "Select options...", className }, ref) => {
    const toggleOption = (option: string) => {
      if (selected.includes(option)) {
        onChange(selected.filter(item => item !== option))
      } else {
        onChange([...selected, option])
      }
    }

    const removeOption = (option: string) => {
      onChange(selected.filter(item => item !== option))
    }

    return (
      <div className={cn("w-full", className)} ref={ref}>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-black/50 border-2 rounded-md bg-background">
          {selected.map((option) => (
            <div
              key={option}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              <span>{option}</span>
              <button
                type="button"
                onClick={() => removeOption(option)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {selected.length === 0 && (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={cn(
                "text-left px-3 py-2 text-sm rounded-md border transition-colors",
                selected.includes(option)
                  ? "bg-blue-100 border-blue-300 text-blue-800"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
