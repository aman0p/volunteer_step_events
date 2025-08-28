"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { approveVerificationRequest, rejectVerificationRequest } from "@/lib/actions/admin/verification";

interface VerificationActionsProps {
  requestId: string;
}

export default function VerificationActions({ requestId }: VerificationActionsProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    if (!adminNote.trim()) {
      toast.error("Please provide an admin note");
      return;
    }

    setIsApproving(true);
    try {
      const result = await approveVerificationRequest(requestId, adminNote);
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
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
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
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Actions</h2>
      
      <div className="space-y-4">
        {/* Admin Note */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Admin Note (required for approval)
          </label>
          <Textarea
            placeholder="Add a note about this verification request..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleApprove}
            disabled={isApproving || !adminNote.trim()}
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
            onClick={() => setShowRejectForm(!showRejectForm)}
            variant="outline"
            className="flex-1"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>

        {/* Rejection Form */}
        {showRejectForm && (
          <div className="space-y-3 p-4 border rounded-lg bg-red-50">
            <label className="text-sm font-medium text-red-700">
              Rejection Reason (required)
            </label>
            <Textarea
              placeholder="Explain why this verification request is being rejected..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="border-red-200 focus:border-red-400"
              rows={3}
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleReject}
                disabled={isRejecting || !rejectionReason.trim()}
                variant="destructive"
                className="flex-1"
              >
                {isRejecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Confirm Rejection
              </Button>
              <Button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
