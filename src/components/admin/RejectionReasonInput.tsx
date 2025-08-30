"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { rejectVerificationRequest } from "@/lib/actions/admin/verification";

interface RejectionReasonInputProps {
  requestId: string;
  currentStatus: string;
  existingReason?: string | null;
  reviewedAt?: Date | null;
  reviewedBy?: { fullName: string } | null;
}

export default function RejectionReasonInput({ 
  requestId, 
  currentStatus, 
  existingReason,
  reviewedAt,
  reviewedBy
}: RejectionReasonInputProps) {
  const [rejectionReason, setRejectionReason] = useState(existingReason || "");
  const [isRejecting, setIsRejecting] = useState(false);

  // Update local state when existing reason changes
  useEffect(() => {
    setRejectionReason(existingReason || "");
  }, [existingReason]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleReject = async () => {
    if (currentStatus !== "PENDING") {
      toast.error("Can only reject pending requests");
      return;
    }

    setIsRejecting(true);
    try {
      const result = await rejectVerificationRequest(requestId, rejectionReason);
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
    <div className="rounded-lg border p-6 bg-black/10">
      <h2 className="text-xl font-semibold mb-4">
        {currentStatus === "PENDING" ? "Rejection Reason (Optional)" : "Rejection Reason"}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {currentStatus === "PENDING" 
          ? "If you plan to reject this request, you can provide a reason here. This will be visible to the user."
          : "You can modify the rejection reason below. Changes will be saved when you reject the request again."
        }
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="rejection-reason" className="text-sm font-medium text-muted-foreground">
            Reason for rejection
          </label>
          <div className="w-full border border-gray-300 rounded-md mt-2">
            <textarea
              id="rejection-reason"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md bg-transparent transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0 border-0 resize-none"
              rows={4}
            />
          </div>
        </div>
        
        {currentStatus === "PENDING" && (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleReject}
              disabled={isRejecting}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isRejecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject Request
            </Button>
            <p className="text-xs text-muted-foreground">
              Click the button above to reject this verification request with the reason provided.
            </p>
          </div>
        )}
        
        {currentStatus === "REJECTED" && (
          <div className="space-y-3">
            {reviewedAt && reviewedBy && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Rejected on: {formatDate(reviewedAt)} by {reviewedBy.fullName}
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground italic">
              Note: You can modify this reason and reject the request again using the reject action above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
