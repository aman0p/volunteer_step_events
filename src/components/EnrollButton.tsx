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
  enrollmentStatus?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "WAITLISTED" | null;
  className?: string;
}

export default function EnrollButton({ eventId, isFull, enrollmentStatus, className }: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { data: session, status } = useSession();

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

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-400 text-white/90", className)}
      >
        Loading...
      </Button>
    );
  }

  // Show different states based on enrollment status
  if (enrollmentStatus === "APPROVED") {
    return (
      <Button
        // disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-green-600 hover:bg-green-600/90 cursor-not-allowed text-white/90 hover:text-white", className)}
      >
        Enrollment Approved
      </Button>
    );
  }

  if (enrollmentStatus === "PENDING") {
    return (
      <Button
        disabled
        variant="default"
        className={cn("w-45 h-fit rounded-full py-3 px-5 text-white", className)}
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

  if (enrollmentStatus === "WAITLISTED") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-blue-600 text-white/90 hover:text-white", className)}
      >
        Waitlisted
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

  // Check if user is not authenticated
  if (!session?.user) {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90", className)}
        title="Please sign in to enroll in events"
      >
        Sign In to Enroll
      </Button>
    );
  }

  // Check user role and show appropriate button
  if (session.user.role === "USER") {
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

  if (session.user.role === "ADMIN" || session.user.role === "ORGANIZER") {
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

  // Only show enroll button for VOLUNTEER role
  if (session.user.role === "VOLUNTEER") {
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

  // Fallback for any other role or undefined role
  return (
    <Button
      disabled
      className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90", className)}
      title="Invalid user role"
    >
      Cannot Enroll
    </Button>
  );
}
