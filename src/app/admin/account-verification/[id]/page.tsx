import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, Image as ImageIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import VerificationActions from "@/components/admin/VerificationActions";
import config from "@/lib/config";

export default async function AccountVerificationDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
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
          createdAt: true
        }
      },
      reviewedBy: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });

  if (!request) {
    redirect("/admin/account-verification");
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between w-full ">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Verification Request Details</h1>
          <p className="text-muted-foreground">
            Review user verification request for {request.user.fullName}
          </p>
        </div>

        {/* Actions - Accept & Reject */}
        <div className="flex gap-2">
          <Button variant="default" className="w-28">
            <CheckCircle className="w-4 h-4" />
            Accept
          </Button>
          <Button variant="outline" className="w-28">
            <Clock className="w-4 h-4" />
            Waitlisted
          </Button>
          <Button variant="destructive" className="w-28">
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">

          {/* User Information */}
          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{request.user.fullName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{request.user.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-sm">{request.user.phoneNumber}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-sm">{request.user.gender}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{request.user.address}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Government ID Type</label>
                <p className="text-sm">{request.user.govIdType.replace('_', ' ')}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-sm">{formatDate(request.user.createdAt)}</p>
              </div>
            </div>

            <div className="mt-4">
              {request.user.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skills</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {request.user.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="default" className="text-xs py-1 px-2">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*  */}
        </div>

        {/* Profile Image & Gov ID Image */}
        <div className="space-y-6">
          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
            <div className="relative ">
              {request.user.profileImage && (
                <Image
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src={request.user.profileImage}
                  alt={request.user.fullName}
                  width={1000}
                  height={1000}
                  className="rounded-lg aspect-video object-cover object-top"
                />
              )}
            </div>

          </div>

          <div className="rounded-lg border p-6 bg-black/10">
            <h2 className="text-xl font-semibold mb-4">Government ID Image</h2>
            <div className="relative ">
              {request.user.govIdImage && (
                <Image
                  urlEndpoint={config.env.imagekit.urlEndpoint}
                  src={request.user.govIdImage}
                  alt={request.user.fullName}
                  width={1000}
                  height={1000}
                  className="rounded-lg aspect-video object-cover object-top"
                />
              )}
            </div>

          </div>
        </div>





      </div>
    </div>
  );
}




{/* <div className="space-y-6">
<div className="rounded-lg border p-6">
  <h2 className="text-xl font-semibold mb-4">Request Details</h2>

  <div className="space-y-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">Status</label>
      <div className="mt-1">
        <StatusBadge status={request.status} />
      </div>
    </div>

    <div>
      <label className="text-sm font-medium text-muted-foreground">Submitted</label>
      <p className="text-sm">{formatDate(request.submittedAt)}</p>
    </div>

    {request.reviewedAt && (
      <div>
        <label className="text-sm font-medium text-muted-foreground">Reviewed</label>
        <p className="text-sm">{formatDate(request.reviewedAt)}</p>
      </div>
    )}

    {request.reviewedBy && (
      <div>
        <label className="text-sm font-medium text-muted-foreground">Reviewed By</label>
        <p className="text-sm">{request.reviewedBy.fullName}</p>
      </div>
    )}


  </div>
</div>

{request.status === "PENDING" && (
  <VerificationActions requestId={request.id} />
)}
</div> */}