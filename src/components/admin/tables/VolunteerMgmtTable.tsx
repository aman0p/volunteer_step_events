"use client";

import { useState } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Image } from "@imagekit/next";
import Link from "next/link";
import config from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import VolunteerSearch from "@/components/admin/VolunteerSearch";
import { GripVertical, Mail, Phone } from "lucide-react";

type Volunteer = {
   id: string;
   fullName: string;
   email: string;
   phoneNumber: string;
   profileImage: string | null;
   gender: string;
   role: string;
   createdAt: Date;
   enrollments: Array<{
      id: string;
      status: string;
      enrolledAt: Date;
      event: {
         id: string;
         title: string;
         startDate: Date;
         endDate: Date;
         location: string;
         category: string[];
      };
   }>;
};

interface VolunteerMgmtTableProps {
   volunteers: Volunteer[];
   currentUserRole: "ADMIN" | "ORGANIZER";
}

export default function VolunteerMgmtTable({
   volunteers,
   currentUserRole,
}: VolunteerMgmtTableProps) {
   const [page, setPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
   const [isSaving, setIsSaving] = useState(false);

   const rolePriority: Record<string, number> = {
      ADMIN: 0,
      VOLUNTEER: 1,
      USER: 2,
   };
   const sortedVolunteers = [...volunteers].sort((a, b) => {
      const aRole = (pendingRoles[a.id] ?? a.role) || "";
      const bRole = (pendingRoles[b.id] ?? b.role) || "";
      const aPri = rolePriority[aRole] ?? 99;
      const bPri = rolePriority[bRole] ?? 99;
      if (aPri !== bPri) return aPri - bPri;
      // fallback: most recent first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
   });

   const paginatedData = sortedVolunteers.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
   );
   const totalPages = Math.ceil(volunteers.length / rowsPerPage);

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      }).format(date);
   };

   const getEnrollmentStats = (enrollments: any[]) => {
      const approved = enrollments.filter(
         (e) => e.status === "APPROVED"
      ).length;
      const pending = enrollments.filter((e) => e.status === "PENDING").length;
      const rejected = enrollments.filter(
         (e) => e.status === "REJECTED"
      ).length;
      return { approved, pending, rejected, total: enrollments.length };
   };

   const allowedRoles =
      currentUserRole === "ADMIN"
         ? ["USER", "VOLUNTEER"]
         : ["USER", "VOLUNTEER", "ADMIN"];

   const handleLocalRoleChange = (volunteerId: string, newRole: string) => {
      setPendingRoles((prev) => ({ ...prev, [volunteerId]: newRole }));
   };

   const handleSave = async () => {
      const updates = Object.entries(pendingRoles)
         .map(([userId, role]) => ({ userId, role }))
         .filter((u) => !!u.role);

      if (updates.length === 0) return;

      setIsSaving(true);
      try {
         const res = await fetch("/api/admin/volunteer/roles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updates }),
         });
         if (!res.ok) {
            console.error("Failed to save role updates");
            setIsSaving(false);
            return;
         }
         // Refresh to reflect changes
         window.location.reload();
      } catch (err) {
         console.error("Error saving roles", err);
         setIsSaving(false);
      }
   };

   const getRoleBadgeVariant = (role: string) => {
      switch (role) {
         case "ADMIN":
            return "destructive";
         case "ORGANIZER":
            return "default";
         case "VOLUNTEER":
            return "secondary";
         case "USER":
            return "outline";
         default:
            return "outline";
      }
   };

   return (
      <div className="relative space-y-4">
         {/* Search Section */}
         <div className="top-0 right-0 w-full md:absolute md:w-xl">
            <VolunteerSearch
               placeholder="Search volunteers by name or email . . ."
               className="w-full"
               onVolunteerSelect={(volunteer) => {
                  // Handle volunteer selection - could navigate to their profile or highlight in table
                  console.log("Selected volunteer:", volunteer);
               }}
            />
         </div>

         {/* Top bar */}
         <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
            <span className="text-muted-foreground order-last text-sm md:order-first">
               Showing {paginatedData.length} of {volunteers.length} volunteers
            </span>
            <div className="z-10 flex items-center gap-2 pt-0.5 pr-1 text-sm text-gray-600">
               <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving || Object.keys(pendingRoles).length === 0}
                  className="order-first w-28 bg-black hover:bg-black/90 md:order-last"
               >
                  {isSaving ? "Saving..." : "Save changes"}
               </Button>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto rounded-md border">
            <Table className="min-w-[900px]">
               <TableHeader className="border-b border-black bg-black/10">
                  <TableRow>
                     <TableHead className="w-8 min-w-[32px]"></TableHead>
                     <TableHead className="w-48 min-w-[192px]">
                        Volunteer
                     </TableHead>
                     <TableHead className="w-48 min-w-[192px]">
                        Contact Info
                     </TableHead>
                     <TableHead className="w-24 min-w-[96px]">Gender</TableHead>
                     <TableHead className="w-40 min-w-[160px]">
                        Enrollment Stats
                     </TableHead>
                     <TableHead className="w-10 min-w-[40px]">Role</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {paginatedData.map((volunteer) => {
                     const stats = getEnrollmentStats(volunteer.enrollments);
                     return (
                        <TableRow
                           key={volunteer.id}
                           className="hover:bg-muted/50"
                        >
                           <TableCell className="w-8 min-w-[32px]">
                              <div className="flex cursor-grab items-center justify-center active:cursor-grabbing">
                                 <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                           </TableCell>
                           <TableCell className="w-48 min-w-[192px]">
                              <Link
                                 href={`/admin/volunteer/${volunteer.id}`}
                                 className="flex items-center space-x-3"
                              >
                                 <div className="flex-shrink-0">
                                    {volunteer.profileImage ? (
                                       <Image
                                          urlEndpoint={
                                             config.env.imagekit.urlEndpoint
                                          }
                                          src={volunteer.profileImage}
                                          alt={volunteer.fullName}
                                          width={70}
                                          height={70}
                                          className="aspect-square h-10 w-10 rounded-full object-cover"
                                       />
                                    ) : (
                                       <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                                          <span className="text-sm font-medium">
                                             {volunteer.fullName
                                                .split(" ")
                                                .map((n: string) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                          </span>
                                       </div>
                                    )}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <div className="truncate font-medium">
                                       {volunteer.fullName}
                                    </div>
                                    {/* <div className="text-sm text-muted-foreground">ID: {volunteer.id.slice(0, 8)}...</div> */}
                                 </div>
                              </Link>
                           </TableCell>
                           <TableCell className="w-48 min-w-[192px]">
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2 text-sm">
                                    <Mail className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                                    <span
                                       className="truncate font-mono"
                                       title={volunteer.email}
                                    >
                                       {volunteer.email}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                    <Phone className="text-muted-foreground h-3 w-3 flex-shrink-0" />
                                    <span
                                       className="truncate font-mono"
                                       title={volunteer.phoneNumber}
                                    >
                                       {volunteer.phoneNumber}
                                    </span>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="w-24 min-w-[96px]">
                              <div className="flex items-center gap-2">
                                 <span className="truncate text-sm capitalize">
                                    {volunteer.gender?.toLowerCase() ||
                                       "Not specified"}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="w-40 min-w-[160px]">
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2">
                                    <Badge
                                       variant="secondary"
                                       className="bg-green-100 text-green-800 hover:bg-green-100"
                                    >
                                       {stats.approved}
                                    </Badge>
                                    <Badge
                                       variant="secondary"
                                       className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    >
                                       {stats.pending}
                                    </Badge>
                                    <Badge
                                       variant="secondary"
                                       className="bg-red-100 text-red-800 hover:bg-red-100"
                                    >
                                       {stats.rejected}
                                    </Badge>
                                 </div>
                                 <div className="text-muted-foreground text-xs">
                                    Total: {stats.total} enrollments
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="w-24 min-w-[96px]">
                              <Select
                                 value={
                                    pendingRoles[volunteer.id] ?? volunteer.role
                                 }
                                 onValueChange={(newRole) =>
                                    handleLocalRoleChange(volunteer.id, newRole)
                                 }
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue>
                                       <span className="text-sm">
                                          {pendingRoles[volunteer.id] ??
                                             volunteer.role}
                                       </span>
                                    </SelectValue>
                                 </SelectTrigger>
                                 <SelectContent>
                                    {allowedRoles.includes("USER") && (
                                       <SelectItem value="USER">
                                          User
                                       </SelectItem>
                                    )}
                                    {allowedRoles.includes("VOLUNTEER") && (
                                       <SelectItem value="VOLUNTEER">
                                          Volunteer
                                       </SelectItem>
                                    )}
                                    {allowedRoles.includes("ADMIN") && (
                                       <SelectItem value="ADMIN">
                                          Admin
                                       </SelectItem>
                                    )}
                                    {allowedRoles.includes("ORGANIZER") && (
                                       <SelectItem value="ORGANIZER">
                                          Organizer
                                       </SelectItem>
                                    )}
                                 </SelectContent>
                              </Select>
                           </TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </div>

         {/* Pagination */}
         <div className="flex flex-col items-start gap-3 py-2 md:flex-row md:items-center md:justify-between md:gap-0">
            <p className="text-muted-foreground text-sm">
               Showing {paginatedData.length} of {volunteers.length} volunteers
            </p>
            <div className="flex items-center gap-2">
               <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => setRowsPerPage(parseInt(value))}
               >
                  <SelectTrigger className="w-[100px]">
                     <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="20">20</SelectItem>
                     <SelectItem value="50">50</SelectItem>
                  </SelectContent>
               </Select>
               <span className="text-sm">
                  Page {page} of {totalPages}
               </span>
               <div className="flex gap-1">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage(1)}
                     disabled={page === 1}
                  >
                     «
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page === 1}
                  >
                     ‹
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                     disabled={page === totalPages}
                  >
                     ›
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setPage(totalPages)}
                     disabled={page === totalPages}
                  >
                     »
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
