'use client';

import React from 'react';
import { IoCloseCircle } from 'react-icons/io5';

type TagProps = {
   label: string;
   onRemove?: () => void;
   className?: string;
};

export function Tag({ label, onRemove, className }: TagProps) {
   if (onRemove) {
      return (
         <button
            type="button"
            onClick={onRemove}
            title={`Remove ${label}`}
            aria-label={`Remove ${label}`}
            className={`group relative inline-flex items-center gap-1 rounded-sm bg-gray-200 px-2.5 py-1.5 text-xs text-gray-800 ${className ?? ''}`}
         >
            <span>{label}</span>
            <IoCloseCircle className="pointer-events-none absolute top-[-3px] right-[-3px] h-3.5 w-3.5 scale-120 rounded-full bg-white text-black group-hover:text-red-500" />
         </button>
      );
   }

   return (
      <span
         className={`inline-flex items-center gap-1 rounded-sm bg-gray-200 px-2.5 py-1.5 text-xs text-gray-800 ${className ?? ''}`}
      >
         {label}
      </span>
   );
}

export default Tag;
