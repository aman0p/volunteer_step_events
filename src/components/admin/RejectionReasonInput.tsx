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
   reviewedBy,
}: RejectionReasonInputProps) {
   const [rejectionReason, setRejectionReason] = useState(existingReason || "");
   const [isRejecting, setIsRejecting] = useState(false);

   // Update local state when existing reason changes
   useEffect(() => {
      setRejectionReason(existingReason || "");
   }, [existingReason]);

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(date);
   };

   const handleReject = async () => {
      if (currentStatus !== "PENDING") {
         toast.error("Can only reject pending requests");
         return;
      }

      setIsRejecting(true);
      try {
         const result = await rejectVerificationRequest(
            requestId,
            rejectionReason
         );
         if (result.success) {
            toast.success("Verification request rejected successfully");
            // Refresh the page to show updated status
            window.location.reload();
         } else {
            toast.error(
               result.message || "Failed to reject verification request"
            );
         }
      } catch (error) {
         toast.error("An error occurred while rejecting the request");
      } finally {
         setIsRejecting(false);
      }
   };

   return (
      <div className="rounded-lg border bg-black/10 p-6">
         <h2 className="mb-4 text-xl font-semibold">
            {currentStatus === "PENDING"
               ? "Rejection Reason (Optional)"
               : "Rejection Reason"}
         </h2>
         <p className="text-muted-foreground mb-4 text-sm">
            {currentStatus === "PENDING"
               ? "If you plan to reject this request, you can provide a reason here. This will be visible to the user."
               : "You can modify the rejection reason below. Changes will be saved when you reject the request again."}
         </p>
         <div className="space-y-4">
            <div>
               <label
                  htmlFor="rejection-reason"
                  className="text-muted-foreground text-sm font-medium"
               >
                  Reason for rejection
               </label>
               <div className="mt-2 w-full rounded-md border border-gray-300">
                  <textarea
                     id="rejection-reason"
                     placeholder="Enter reason for rejection..."
                     value={rejectionReason}
                     onChange={(e) => setRejectionReason(e.target.value)}
                     className="w-full resize-none rounded-md border-0 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
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
                        <Loader2 className="h-4 w-4 animate-spin" />
                     ) : (
                        <XCircle className="h-4 w-4" />
                     )}
                     Reject Request
                  </Button>
                  <p className="text-muted-foreground text-xs">
                     Click the button above to reject this verification request
                     with the reason provided.
                  </p>
               </div>
            )}

            {currentStatus === "REJECTED" && (
               <div className="space-y-3">
                  {reviewedAt && reviewedBy && (
                     <div className="border-t pt-3">
                        <p className="text-muted-foreground text-xs">
                           Rejected on: {formatDate(reviewedAt)} by{" "}
                           {reviewedBy.fullName}
                        </p>
                     </div>
                  )}

                  <p className="text-muted-foreground text-xs italic">
                     Note: You can modify this reason and reject the request
                     again using the reject action above.
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
