import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import VerificationActions from "@/components/admin/VerificationActions";

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

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "👨";
      case "FEMALE":
        return "👩";
      case "OTHER":
        return "👤";
      default:
        return "👤";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/account-verification">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Request Details</h1>
          <p className="text-muted-foreground">
            Review user verification request for {request.user.fullName}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Information */}
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              {request.user.profileImage ? (
                <Image
                  src={request.user.profileImage}
                  alt={request.user.fullName}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-medium">
                    {request.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium">{request.user.fullName}</h3>
                <p className="text-muted-foreground">{request.user.email}</p>
                <p className="text-muted-foreground">{request.user.phoneNumber}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-muted-foreground">
                    {getGenderIcon(request.user.gender)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{request.user.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Government ID Type</label>
                <p className="text-sm">{request.user.govIdType.replace('_', ' ')}</p>
              </div>

              {request.user.skills.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skills</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {request.user.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-sm">{formatDate(request.user.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Government ID Image */}
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Government ID</h2>
            {request.user.govIdImage ? (
              <div className="space-y-2">
                <Image
                  src={request.user.govIdImage}
                  alt="Government ID"
                  width={400}
                  height={300}
                  className="rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                  {request.user.govIdType.replace('_', ' ')} - {request.user.fullName}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                <p>No government ID image provided</p>
              </div>
            )}
          </div>
        </div>

        {/* Request Details & Actions */}
        <div className="space-y-6">
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

              {request.adminNote && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Admin Note</label>
                  <p className="text-sm">{request.adminNote}</p>
                </div>
              )}

              {request.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
                  <p className="text-sm text-red-600">{request.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {request.status === "PENDING" && (
            <VerificationActions requestId={request.id} />
          )}
        </div>
      </div>
    </div>
  );
}
