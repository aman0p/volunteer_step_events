import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Filter, Download, Plus, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import VolunteerSearch from "@/components/admin/VolunteerSearch";
import VolunteerMgmtTable from "@/components/admin/tables/VolunteerMgmtTable";

export default async function VolunteerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  // Check if user has admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
    redirect("/");
  }

  // Fetch all volunteers with their enrollments and event details
  const volunteers = await prisma.user.findMany({
    where: { 
      OR: [
        { role: "USER" },
        { role: "VOLUNTEER" },
        { role: "ADMIN" }
      ]
    },
    include: {
      enrollments: {
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true,
              location: true,
              category: true
            }
          }
        },
        orderBy: { enrolledAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteer Management</h1>
          <p className="text-muted-foreground">
            Manage volunteers and their roles
          </p>
        </div>

        <VolunteerMgmtTable volunteers={volunteers} currentUserRole={user.role} />
      </div>
  );
}