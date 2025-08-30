import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { UserCheck, Filter, Download } from "lucide-react";
import VerificationTable from "@/components/admin/tables/VerificationTable";

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
    redirect("/admin");
  }

  // Fetch all verification requests with proper separation
  const verificationRequests = await prisma.verificationRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          profileImage: true,
          createdAt: true
        }
      }
    },
    orderBy: { submittedAt: "asc" }
  });

  // Separate requests: only show the latest request per user
  const userLatestRequests = new Map();
  
  verificationRequests.forEach(request => {
    const userId = request.user.id;
    if (!userLatestRequests.has(userId) || 
        request.submittedAt > userLatestRequests.get(userId).submittedAt) {
      userLatestRequests.set(userId, request);
    }
  });

  const allRequests = Array.from(userLatestRequests.values());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Account Verification Requests</h1>
          <p className="text-muted-foreground">
            Review and manage user verification requests
          </p>
        </div>
      </div>

      {allRequests.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No verification requests</h3>
          <p className="text-muted-foreground">
            All users have been verified or there are no requests.
          </p>
        </div>
      ) : (
        <VerificationTable verificationRequests={allRequests} />
      )}
    </div>
  );
}
