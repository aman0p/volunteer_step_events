"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestEnrollment } from "@/lib/actions/user/enrollment";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface EnrollButtonProps {
  eventId: string;
  isFull: boolean;
  enrollmentStatus?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | null;
  className?: string;
}

export default function EnrollButton({ eventId, isFull, enrollmentStatus, className }: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { data: session } = useSession();

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
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-green-600 text-white/90 hover:text-white", className)}
      >
        Enrollment Approved
      </Button>
    );
  }

  if (enrollmentStatus === "PENDING") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-yellow-600 text-black/90 hover:text-white", className)}
      >
        Pending Approval
      </Button>
    );
  }

  if (enrollmentStatus === "REJECTED") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-red-600 text-white/90 hover:text-white", className)}
      >
        Enrollment Rejected
      </Button>
    );
  }

  if (enrollmentStatus === "CANCELLED") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90 hover:text-white", className)}
      >
        Enrollment Cancelled
      </Button>
    );
  }

  if (isFull) {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90 hover:text-white", className)}
      >
        Enrollment Full
      </Button>
    );
  }

  // Check user role and show appropriate button
  if (session?.user?.role === "USER") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90 hover:text-white", className)}
        title="Complete your profile and request verification to enroll in events"
      >
        Apply for Verification
      </Button>
    );
  }

  if (session?.user?.role === "ADMIN" || session?.user?.role === "ORGANIZER") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90 hover:text-white", className)}
        title="Admins and Organizers cannot enroll as volunteers"
      >
        Admin/Organizer
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isEnrolling}
      variant="outline"
      className={cn("w-45 h-fit rounded-full py-3 px-5 bg-black hover:bg-black/95 text-white/90 hover:text-white", className)}
    >
      {isEnrolling ? "Enrolling..." : "Enroll as Volunteer"}
    </Button>
  );
}
