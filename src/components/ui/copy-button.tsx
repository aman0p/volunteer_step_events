"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
}

export default function CopyButton({ 
  text, 
  className = "", 
  size = "md", 
  variant = "default" 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3"
  };

  const variantClasses = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    ghost: "bg-transparent hover:transparent text-gray-600",
    outline: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-600"
  };

  const iconSize = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        transition-all duration-200 ease-in-out
        rounded-md
        flex items-center justify-center
        ${className}
      `}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className={`${iconSize[size]} text-green-600`} />
      ) : (
        <Copy className={`${iconSize[size]}`} />
      )}
    </button>
  );
}
