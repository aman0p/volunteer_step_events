"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { requestEnrollment, cancelEnrollment } from "@/lib/actions/user/enrollment";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface EnrollButtonProps {
  eventId: string;
  isFull: boolean;
  enrollmentStatus?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "WAITLISTED" | null;
  className?: string;
}

export default function EnrollButton({ eventId, isFull, enrollmentStatus, className }: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [localStatus, setLocalStatus] = useState<"PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "WAITLISTED" | null>(enrollmentStatus ?? null);
  const { data: session, status } = useSession();

  const handleEnroll = async () => {
    if (isFull || localStatus) return;

    setIsEnrolling(true);
    try {
      const result = await requestEnrollment(eventId);
      if (result.success) {
        toast.success(result.message);
        setLocalStatus("PENDING");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send enrollment request");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCancel = async () => {
    setIsEnrolling(true);
    try {
      const result = await cancelEnrollment(eventId);
      if (result.success) {
        toast.success(result.message || "Enrollment request cancelled");
        if ((result as any).nextStatus === "REJECTED") {
          setLocalStatus("REJECTED");
        } else {
          // First cancel: show cancelled for 2s then allow re-apply
          setLocalStatus("CANCELLED");
          setTimeout(() => setLocalStatus(null), 2000);
        }
      } else {
        toast.error(result.message || "Failed to cancel request");
      }
    } catch (error) {
      toast.error("Failed to cancel request");
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
  if (localStatus === "APPROVED") {
    return (
      <Button
        // disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-green-600 hover:bg-green-600/90 cursor-not-allowed text-white/90 hover:text-white", className)}
      >
        Enrollment Approved
      </Button>
    );
  }

  if (localStatus === "PENDING") {
    return (
      <div className={cn("flex w-full md:w-fit items-center gap-2", className)}>
        <Button
          disabled
          variant="default"
          className={cn("h-fit rounded-full py-3 px-5 text-white")}
        >
          Pending Approval
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isEnrolling}
          className="h-fit rounded-full py-3 px-5"
        >
          {isEnrolling ? "Cancelling..." : "Cancel Request"}
        </Button>
      </div>
    );
  }

  if (localStatus === "REJECTED") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-red-600 text-white/90 hover:text-white", className)}
      >
        Enrollment Rejected
      </Button>
    );
  }

  if (localStatus === "CANCELLED") {
    return (
      <Button
        disabled
        className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-500 text-white/90 hover:text-white", className)}
      >
        Enrollment Cancelled
      </Button>
    );
  }

  if (localStatus === "WAITLISTED") {
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
        // disabled
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
      <Link href="/profile">
        <Button
          className={cn("w-45 h-fit rounded-full py-3 px-5 bg-gray-700 text-white/90 hover:text-white", className)}
          title="Complete your profile and request verification to enroll in events"
        >
          Apply for Verification
        </Button>
      </Link>
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
