import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "INACTIVE" | "COMPLETED" | "CANCELLED";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  PENDING: {
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "⏳"
  },
  APPROVED: {
    variant: "default" as const,
    className: "bg-green-600 text-white border-green-600",
    icon: "✓"
  },
  REJECTED: {
    variant: "destructive" as const,
    className: "bg-red-600 text-white border-red-600",
    icon: "❌"
  },
  ACTIVE: {
    variant: "default" as const,
    className: "bg-blue-600 text-white border-blue-600",
    icon: "🟢"
  },
  INACTIVE: {
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: "⚪"
  },
  COMPLETED: {
    variant: "default" as const,
    className: "bg-green-700 text-white border-green-700",
    icon: "🏁"
  },
  CANCELLED: {
    variant: "destructive" as const,
    className: "bg-red-700 text-white border-red-700",
    icon: "🚫"
  }
};

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(
        "font-medium text-xs px-2 py-1",
        config.className,
        className
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </Badge>
  );
}

// Export individual status badges for specific use cases
export function PendingBadge({ className }: { className?: string }) {
  return <StatusBadge status="PENDING" className={className} />;
}

export function ApprovedBadge({ className }: { className?: string }) {
  return <StatusBadge status="APPROVED" className={className} />;
}

export function RejectedBadge({ className }: { className?: string }) {
  return <StatusBadge status="REJECTED" className={className} />;
}

export function ActiveBadge({ className }: { className?: string }) {
  return <StatusBadge status="ACTIVE" className={className} />;
}

export function InactiveBadge({ className }: { className?: string }) {
  return <StatusBadge status="INACTIVE" className={className} />;
}

export function CompletedBadge({ className }: { className?: string }) {
  return <StatusBadge status="COMPLETED" className={className} />;
}

export function CancelledBadge({ className }: { className?: string }) {
  return <StatusBadge status="CANCELLED" className={className} />;
}
