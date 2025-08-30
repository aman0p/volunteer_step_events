"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { approveVerificationRequest } from "@/lib/actions/admin/verification";

interface VerificationDetailActionsProps {
  requestId: string;
  currentStatus: string;
}

export default function VerificationDetailActions({ 
  requestId, 
  currentStatus
}: VerificationDetailActionsProps) {
  const [isApproving, setIsApproving] = useState(false);

  // Don't show actions if already reviewed
  if (currentStatus !== "PENDING") {
    return null;
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveVerificationRequest(requestId);
      if (result.success) {
        toast.success("Verification request approved successfully");
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to approve verification request");
      }
    } catch (error) {
      toast.error("An error occurred while approving the request");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleApprove} 
        disabled={isApproving} 
        variant="default" 
        className="w-28"
      >
        {isApproving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        Accept
      </Button>
    </div>
  );
}
