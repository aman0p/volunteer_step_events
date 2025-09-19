"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   approveEnrollment,
   rejectEnrollment,
} from "@/lib/actions/admin/enrollment";
import { toast } from "sonner";

interface EnrollmentActionsProps {
   enrollmentId: string;
   userName: string;
}

export default function EnrollmentActions({
   enrollmentId,
   userName,
}: EnrollmentActionsProps) {
   const [isLoading, setIsLoading] = useState(false);

   const handleApprove = async () => {
      setIsLoading(true);
      try {
         const result = await approveEnrollment(enrollmentId);
         if (result.success) {
            toast.success(`Enrollment for ${userName} approved!`);
         } else {
            toast.error(result.message || "Failed to approve enrollment.");
         }
      } catch (error) {
         console.error("Error approving enrollment:", error);
         toast.error("An unexpected error occurred during approval.");
      } finally {
         setIsLoading(false);
      }
   };

   const handleReject = async () => {
      setIsLoading(true);
      try {
         const result = await rejectEnrollment(enrollmentId);
         if (result.success) {
            toast.success(`Enrollment for ${userName} rejected.`);
         } else {
            toast.error(result.message || "Failed to reject enrollment.");
         }
      } catch (error) {
         console.error("Error rejecting enrollment:", error);
         toast.error("An unexpected error occurred during rejection.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex gap-2">
         <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-500 text-white hover:bg-green-600"
         >
            {isLoading ? "Approving..." : "Approve"}
         </Button>
         <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
         >
            {isLoading ? "Rejecting..." : "Reject"}
         </Button>
      </div>
   );
}
