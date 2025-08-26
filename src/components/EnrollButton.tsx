"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestEnrollment } from "@/lib/action/enrollment";
import { toast } from "sonner";

interface EnrollButtonProps {
  eventId: string;
  isFull: boolean;
  enrollmentStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
}

export default function EnrollButton({ eventId, isFull, enrollmentStatus }: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (isFull || enrollmentStatus) return;
    
    setIsEnrolling(true);
    try {
      const result = await requestEnrollment(eventId);
      if (result.success) {
        toast.success(result.message);
        // Refresh the page to show updated state
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send enrollment request");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Show different states based on enrollment status
  if (enrollmentStatus === "APPROVED") {
    return (
      <Button 
        disabled
        className="flex-1 bg-green-600 text-white py-3 cursor-default"
      >
        ✓ Enrolled
      </Button>
    );
  }

  if (enrollmentStatus === "PENDING") {
    return (
      <Button 
        disabled
        className="flex-1 bg-yellow-600 text-white py-3 cursor-default"
      >
        ⏳ Pending Approval
      </Button>
    );
  }

  if (enrollmentStatus === "REJECTED") {
    return (
      <Button 
        disabled
        className="flex-1 bg-red-600 text-white py-3 cursor-default"
      >
        ❌ Enrollment Rejected
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button 
        disabled
        className="flex-1 bg-gray-500 text-white py-3 cursor-default"
      >
        Event Full
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleEnroll}
      disabled={isEnrolling}
      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
    >
      {isEnrolling ? "Enrolling..." : "Enroll as Volunteer"}
    </Button>
  );
}
