import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
   status: string;
   className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
   const statusConfig = {
      NOT_ENROLLED: {
         label: "Not Enrolled",
         className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      },
      PENDING: {
         label: "Pending",
         className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
      APPROVED: {
         label: "Approved",
         className:
            "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      },
      REJECTED: {
         label: "Rejected",
         className:
            "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      },
      WAITLISTED: {
         label: "Waitlisted",
         className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      },
      CANCELLED: {
         label: "Cancelled",
         className:
            "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
      },
   };

   const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["NOT_ENROLLED"];

   return (
      <Badge className={`${config.className} ${className || ""}`}>
         {config.label}
      </Badge>
   );
}
