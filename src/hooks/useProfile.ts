import { useState, useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { profileSchema } from "@/lib/validations";
import { updateCurrentUserProfile, getCurrentUserProfile } from "@/lib/actions/user/profile";
import { submitVerificationRequest, getVerificationStatus } from "@/lib/actions/user/verification";

export function useProfile() {
  const form = (useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      gender: undefined,
      profileImage: "",
      skills: [],
      govIdType: undefined,
      govIdImage: "",
    },
  }) as UseFormReturn<z.infer<typeof profileSchema>>);

  const [role, setRole] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [hasRejectedRequest, setHasRejectedRequest] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const [isRefreshingVerification, setIsRefreshingVerification] = useState(false);
  const [formCompletionStatus, setFormCompletionStatus] = useState({
    fullName: false,
    phoneNumber: false,
    address: false,
    gender: false,
    profileImage: false,
    govIdType: false,
    govIdImage: false,
  });

  // Function to check if all required fields are filled
  const areAllFieldsFilled = () => {
    return Object.values(formCompletionStatus).every(Boolean);
  };

  // Function to update form completion status
  const updateFormCompletionStatus = () => {
    const values = form.getValues();
    setFormCompletionStatus({
      fullName: values.fullName.trim() !== "",
      phoneNumber: values.phoneNumber.trim() !== "",
      address: values.address.trim() !== "",
      gender: !!values.gender,
      profileImage: values.profileImage.trim() !== "",
      govIdType: !!values.govIdType,
      govIdImage: values.govIdImage.trim() !== "",
    });
  };

  // Function to get missing fields for better error messages
  const getMissingFields = () => {
    const missing = [];
    if (!formCompletionStatus.fullName) missing.push("Full Name");
    if (!formCompletionStatus.phoneNumber) missing.push("Phone Number");
    if (!formCompletionStatus.address) missing.push("Address");
    if (!formCompletionStatus.gender) missing.push("Gender");
    if (!formCompletionStatus.profileImage) missing.push("Profile Image");
    if (!formCompletionStatus.govIdType) missing.push("Government ID Type");
    if (!formCompletionStatus.govIdImage) missing.push("Government ID Image");
    return missing;
  };

  // Function to fetch verification status
  const fetchVerificationStatus = async () => {
    const result = await getVerificationStatus();
    if (result.success) {
      const wasVerified = isVerified;
      const wasPending = hasPendingRequest;

      setIsVerified(result.isVerified ?? false);
      setHasPendingRequest(result.latestRequest?.status === "PENDING");
      setHasRejectedRequest(result.latestRequest?.status === "REJECTED");
      setRejectionReason(result.latestRequest?.rejectionReason ?? null);

      // No need for toast notifications here - sidebar notifications will handle this
    }
  };

  // Function to refresh verification status
  const refreshVerificationStatus = async () => {
    setIsRefreshingVerification(true);
    try {
      await fetchVerificationStatus();
      toast.success("Verification status refreshed");
    } catch (error) {
      toast.error("Failed to refresh verification status");
    } finally {
      setIsRefreshingVerification(false);
    }
  };

  // Function to submit verification request
  const handleSubmitVerification = async () => {
    if (!areAllFieldsFilled()) {
      const missingFields = getMissingFields();
      toast.error(`Please complete the following fields: ${missingFields.join(", ")}`);
      return;
    }
    
    setIsSubmittingVerification(true);
    try {
      // First, save the profile changes automatically
      const profileValues = form.getValues();
      const profileResult = await updateCurrentUserProfile(profileValues);
      
      if (!profileResult.success) {
        toast.error("Failed to save profile changes. Please try again.");
        return;
      }
      
      // Then submit the verification request
      const result = await submitVerificationRequest();
      if (result.success) {
        setHasPendingRequest(true);
        toast.success("Profile saved and verification request submitted successfully");
        // Toast notification removed - sidebar notification will handle this
      } else {
        toast.error(result.message || "Failed to submit verification request");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the request");
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  // Function to submit profile form
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    const result = await updateCurrentUserProfile(values);
    if (result.success) {
      toast.success("Profile updated successfully");
    } else {
      toast.error(result.message);
    }
  };

  // Load profile data on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const result = await getCurrentUserProfile();
      if (isMounted && result.success && result.data) {
        form.reset({
          fullName: result.data.fullName ?? "",
          phoneNumber: result.data.phoneNumber ?? "",
          address: result.data.address ?? "",
          gender: result.data.gender ?? undefined,
          profileImage: result.data.profileImage ?? "",
          skills: Array.isArray(result.data.skills) ? result.data.skills : [],
          govIdType: result.data.govIdType ?? undefined,
          govIdImage: result.data.govIdImage ?? "",
        });
        setRole((result.data as any).role ?? "");
        
        // Update form completion status after form is loaded
        setTimeout(() => updateFormCompletionStatus(), 100);
      }
    })();

    // Fetch verification status separately
    fetchVerificationStatus();

    // Set up periodic refresh of verification status (every 30 seconds)
    const intervalId = setInterval(() => {
      if (isMounted && !isVerified && hasPendingRequest) {
        fetchVerificationStatus();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [form, isVerified, hasPendingRequest]);

  // Watch form changes to update completion status
  useEffect(() => {
    const subscription = form.watch(() => {
      updateFormCompletionStatus();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Refresh verification status when component becomes visible (e.g., user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isVerified && hasPendingRequest) {
        fetchVerificationStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVerified, hasPendingRequest]);

  return {
    form,
    role,
    isVerified,
    hasPendingRequest,
    hasRejectedRequest,
    rejectionReason,
    isSubmittingVerification,
    isRefreshingVerification,
    formCompletionStatus,
    areAllFieldsFilled,
    updateFormCompletionStatus,
    getMissingFields,
    fetchVerificationStatus,
    refreshVerificationStatus,
    handleSubmitVerification,
    onSubmit,
  };
}
