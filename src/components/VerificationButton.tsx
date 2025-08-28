"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitVerificationRequest } from "@/lib/actions/user/verification";

interface VerificationButtonProps {
  isVerified: boolean;
  hasPendingRequest: boolean;
}

export default function VerificationButton({ isVerified, hasPendingRequest }: VerificationButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitVerificationRequest();
      if (result.success) {
        toast.success("Verification request submitted successfully");
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to submit verification request");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerified) {
    return (
      <Button disabled className="bg-green-600 hover:bg-green-700">
        <UserCheck className="mr-2 h-4 w-4" />
        Verified
      </Button>
    );
  }

  if (hasPendingRequest) {
    return (
      <Button disabled variant="outline">
        <UserCheck className="mr-2 h-4 w-4" />
        Verification Pending
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSubmitVerification}
      disabled={isSubmitting}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isSubmitting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <UserCheck className="mr-2 h-4 w-4" />
      )}
      Request Verification
    </Button>
  );
}
