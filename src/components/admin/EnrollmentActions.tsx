"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveEnrollment, rejectEnrollment } from "@/lib/action/admin/enrollment";
import { toast } from "sonner";

interface EnrollmentActionsProps {
  enrollmentId: string;
  userName: string;
  eventId: string;
}

export default function EnrollmentActions({ enrollmentId, userName, eventId }: EnrollmentActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await approveEnrollment(enrollmentId);
      
      if (result.success) {
        toast.success(`Approved ${userName}'s enrollment`);
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to approve enrollment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const result = await rejectEnrollment(enrollmentId);
      
      if (result.success) {
        toast.success(`Rejected ${userName}'s enrollment`);
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to reject enrollment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <Button 
        size="sm" 
        onClick={handleApprove} 
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoading ? "Processing..." : "Approve"}
      </Button>
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={handleReject} 
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Reject"}
      </Button>
    </div>
  );
}
