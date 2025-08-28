"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { approveVerificationRequest, rejectVerificationRequest } from "@/lib/actions/admin/verification";

interface VerificationActionsProps {
  requestId: string;
}

export default function VerificationActions({ requestId }: VerificationActionsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

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

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const result = await rejectVerificationRequest(requestId);
      if (result.success) {
        toast.success("Verification request rejected successfully");
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to reject verification request");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting the request");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Actions</h2>
      
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isApproving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Approve
          </Button>

          <Button
            onClick={handleReject}
            disabled={isRejecting}
            variant="destructive"
            className="flex-1"
          >
            {isRejecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
