import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import { Badge } from "@/components/ui/badge";
import VerificationDetailActions from "@/components/admin/VerificationDetailActions";
import config from "@/lib/config";
import RejectionReasonInput from "@/components/admin/RejectionReasonInput";

export default async function AccountVerificationDetail({
   params,
}: {
   params: { id: string };
}) {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/sign-in");
   }

   // Check if user has admin role
   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
   });

   if (!user || user.role !== "ADMIN") {
      redirect("/");
   }

   // Fetch verification request with user details
   const request = await prisma.verificationRequest.findUnique({
      where: { id: (await params).id },
      include: {
         user: {
            select: {
               id: true,
               fullName: true,
               email: true,
               phoneNumber: true,
               profileImage: true,
               skills: true,
               address: true,
               gender: true,
               govIdType: true,
               govIdImage: true,
               createdAt: true,
            },
         },
         reviewedBy: {
            select: {
               id: true,
               fullName: true,
            },
         },
      },
   });

   if (!request) {
      redirect("/admin/account-verification");
   }

   // Fetch the most recent rejected verification request to get the previous rejection reason
   const previousRejectedRequest = await prisma.verificationRequest.findFirst({
      where: {
         userId: request.user.id,
         status: "REJECTED",
         id: { not: (await params).id }, // Exclude current request
      },
      orderBy: { submittedAt: "desc" },
      include: {
         reviewedBy: {
            select: {
               fullName: true,
            },
         },
      },
   });

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(date);
   };

   return (
      <div className="space-y-6">
         {/* Back Button */}
         <div className="flex items-center">
            <Link
               href="/admin/account-verification"
               className="text-muted-foreground hover:text-foreground flex items-center text-sm transition-colors"
            >
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Verification Requests
            </Link>
         </div>

         <div className="flex w-full justify-between">
            {/* Header */}
            <div className="space-y-1">
               <h1 className="text-3xl font-bold tracking-tight">
                  Verification Request Details
               </h1>
               <p className="text-muted-foreground">
                  Review user verification request for {request.user.fullName}
               </p>
            </div>

            {/* Actions - Accept & Reject */}
            <VerificationDetailActions
               requestId={request.id}
               currentStatus={request.status}
            />
         </div>

         <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
               {/* User Information */}
               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                     User Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Name
                        </label>
                        <p className="text-sm">{request.user.fullName}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Email
                        </label>
                        <p className="text-sm">{request.user.email}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Phone Number
                        </label>
                        <p className="text-sm">{request.user.phoneNumber}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Gender
                        </label>
                        <p className="text-sm">{request.user.gender}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Address
                        </label>
                        <p className="text-sm">{request.user.address}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Government ID Type
                        </label>
                        <p className="text-sm">
                           {request.user.govIdType.replace("_", " ")}
                        </p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Member Since
                        </label>
                        <p className="text-sm">
                           {formatDate(request.user.createdAt)}
                        </p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Submitted On
                        </label>
                        <p className="text-sm">
                           {formatDate(request.submittedAt)}
                        </p>
                     </div>
                  </div>

                  <div className="mt-4">
                     {request.user.skills.length > 0 && (
                        <div>
                           <label className="text-muted-foreground text-sm font-medium">
                              Skills
                           </label>
                           <div className="mt-1 flex flex-wrap gap-1">
                              {request.user.skills.map(
                                 (skill: string, index: number) => (
                                    <Badge
                                       key={index}
                                       variant="default"
                                       className="px-2 py-1 text-xs"
                                    >
                                       {skill}
                                    </Badge>
                                 )
                              )}
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Rejection Reason Input - Show for both pending and rejected requests */}
               {(request.status === "PENDING" ||
                  request.status === "REJECTED") && (
                  <RejectionReasonInput
                     requestId={request.id}
                     currentStatus={request.status}
                     existingReason={
                        request.rejectionReason ||
                        previousRejectedRequest?.rejectionReason ||
                        ""
                     }
                     reviewedAt={request.reviewedAt}
                     reviewedBy={request.reviewedBy}
                  />
               )}
            </div>

            {/* Profile Image & Gov ID Image */}
            <div className="space-y-6">
               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Profile Image</h2>
                  <div className="relative">
                     {request.user.profileImage && (
                        <Image
                           urlEndpoint={config.env.imagekit.urlEndpoint}
                           src={request.user.profileImage}
                           alt={request.user.fullName}
                           width={1000}
                           height={1000}
                           className="aspect-video rounded-lg object-cover object-top"
                        />
                     )}
                  </div>
               </div>

               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                     Government ID Image
                  </h2>
                  <div className="relative">
                     {request.user.govIdImage && (
                        <Image
                           urlEndpoint={config.env.imagekit.urlEndpoint}
                           src={request.user.govIdImage}
                           alt={request.user.fullName}
                           width={1000}
                           height={1000}
                           className="aspect-video rounded-lg object-cover object-top"
                        />
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
