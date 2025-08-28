import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { UserCheck, Filter, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import { Badge } from "@/components/ui/badge";

export default async function AccountVerification() {
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

  // Fetch all pending verification requests
  const verificationRequests = await prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          profileImage: true,
          skills: true,
          address: true,
          gender: true,
          govIdType: true,
          govIdImage: true,
          createdAt: true
        }
      }
    },
    orderBy: { submittedAt: "asc" }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Verification Requests</h1>
          <p className="text-muted-foreground">
            Review and approve user verification requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {verificationRequests.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No pending verification requests</h3>
          <p className="text-muted-foreground">
            All users have been verified or there are no pending requests.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {verificationRequests.map((request: any) => (
            <div
              key={request.id}
              className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                {request.user.profileImage ? (
                  <Image
                    src={request.user.profileImage}
                    alt={request.user.fullName}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {request.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium truncate">
                    {request.user.fullName}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {request.user.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getGenderIcon(request.user.gender)}
                  </span>
                </div>
                
                <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    📧 {request.user.email}
                  </span>
                  <span className="flex items-center">
                    📍 {request.user.address}
                  </span>
                  <span className="flex items-center">
                    🆔 {request.user.govIdType.replace('_', ' ')}
                  </span>
                  <span className="flex items-center">
                    📅 Requested {formatDate(request.submittedAt)}
                  </span>
                </div>

                {request.user.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {request.user.skills.slice(0, 3).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {request.user.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{request.user.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/account-verification/${request.id}`}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Review
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
