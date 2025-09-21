import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Status } from "@/generated/prisma";

export default async function VolunteerDetailsPage({
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

   if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
      redirect("/");
   }

   // Fetch volunteer with all enrollments and event details
   const volunteer = await prisma.user.findUnique({
      where: { id: (await params).id },
      include: {
         enrollments: {
            include: {
               event: {
                  select: {
                     id: true,
                     title: true,
                     description: true,
                     startDate: true,
                     endDate: true,
                     location: true,
                     category: true,
                     coverUrl: true,
                     maxVolunteers: true,
                     enrollments: {
                        where: { status: "APPROVED" },
                        select: { id: true },
                     },
                  },
               },
               eventRole: {
                  select: {
                     id: true,
                     name: true,
                     payout: true,
                  },
               },
            },
            orderBy: { enrolledAt: "desc" },
         },
      },
   });

   if (!volunteer) {
      redirect("/admin/volunteer");
   }

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
         weekday: "long",
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
               href="/admin/volunteer"
               className="text-muted-foreground hover:text-foreground flex items-center text-sm transition-colors"
            >
               <ArrowLeft className="mr-2 h-4 w-4" />
               Back to Volunteers
            </Link>
         </div>

         <div className="flex flex-col gap-1">
            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight">
               {volunteer.fullName}
            </h1>
            <p className="text-muted-foreground">
               View volunteer profile and event history
            </p>
         </div>

         <div className="grid gap-10 lg:grid-cols-[1.3fr_auto]">
            <div className="space-y-10">
               {/* Profile Information */}
               <div className="rounded-lg">
                  <h2 className="mb-2 text-xl font-semibold">
                     Profile Information
                  </h2>
                  <div className="overflow-hidden rounded-lg border">
                     <table className="w-full">
                        <tbody>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 w-1/3 px-4 py-3 text-sm font-medium">
                                 Name
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 {volunteer.fullName}
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Email
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 {volunteer.email}
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Phone Number
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 <span className="text-gray-700 select-none">
                                    +91
                                 </span>
                                 {volunteer.phoneNumber}
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Gender
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 {volunteer.gender}
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Address
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 {volunteer.address}
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Role
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 <Badge variant="outline">
                                    {volunteer.role}
                                 </Badge>
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Member Since
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 {formatDate(volunteer.createdAt)}
                              </td>
                           </tr>
                           <tr className="border-b">
                              <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                 Volunteer ID
                              </td>
                              <td className="px-4 py-3 text-sm">
                                 {volunteer.id}
                              </td>
                           </tr>
                           {volunteer.skills && volunteer.skills.length > 0 && (
                              <tr>
                                 <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                                    Skills
                                 </td>
                                 <td className="px-4 py-3 text-sm">
                                    <div className="flex flex-wrap gap-1">
                                       {volunteer.skills.map((skill, index) => (
                                          <Badge
                                             key={index}
                                             variant="default"
                                             className="px-2 py-1 text-xs"
                                          >
                                             {skill}
                                          </Badge>
                                       ))}
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* Event History */}
               <div className="rounded-lg">
                  <h2 className="mb-2 text-xl font-semibold">
                     Event History ({volunteer.enrollments.length})
                  </h2>

                  {volunteer.enrollments.length === 0 ? (
                     <div className="py-8 text-center text-gray-500">
                        <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                           No events yet
                        </h3>
                        <p className="text-gray-500">
                           This volunteer hasn&apos;t enrolled in any events
                           yet.
                        </p>
                     </div>
                  ) : (
                     <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-[600px]">
                           <TableHeader className="border-b border-black bg-black/10">
                              <TableRow>
                                 <TableHead className="min-w-[150px] text-center">
                                    Event Name
                                 </TableHead>
                                 <TableHead className="min-w-[120px] text-center">
                                    Status
                                 </TableHead>
                                 <TableHead className="min-w-[140px] text-center">
                                    Role
                                 </TableHead>
                                 <TableHead className="min-w-[120px] text-center">
                                    Payout
                                 </TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {volunteer.enrollments.map((enrollment) => (
                                 <TableRow
                                    key={enrollment.id}
                                    className="hover:bg-muted/50"
                                 >
                                    <TableCell className="min-w-[150px] text-center">
                                       <Link
                                          href={`/admin/events/${enrollment.event.id}/details`}
                                          className="group flex items-center justify-center space-x-2"
                                       >
                                          <div className="line-clamp-1 font-medium text-blue-600 hover:text-blue-700">
                                             {enrollment.event.title}
                                          </div>
                                          <ArrowRight className="relative -top-2 -left-1 h-3 w-3 rotate-[-45deg] text-blue-600 transition-all duration-150 group-hover:-top-2.5 group-hover:-left-0.5 hover:text-blue-700" />
                                       </Link>
                                    </TableCell>
                                    <TableCell className="min-w-[120px] text-center">
                                       <StatusBadge
                                          status={enrollment.status as Status}
                                       />
                                    </TableCell>
                                    <TableCell className="min-w-[140px] text-center text-sm">
                                       <div className="line-clamp-1">
                                          {enrollment.eventRole ? (
                                             <div>
                                                <div className="text-foreground line-clamp-1 font-medium">
                                                   {enrollment.eventRole.name}
                                                </div>
                                             </div>
                                          ) : (
                                             <span className="text-muted-foreground">
                                                No role selected
                                             </span>
                                          )}
                                       </div>
                                    </TableCell>
                                    <TableCell className="min-w-[120px] text-center text-sm">
                                       <div className="line-clamp-1">
                                          {enrollment.eventRole ? (
                                             <span className="font-medium text-green-600">
                                                ₹
                                                {enrollment.eventRole.payout.toLocaleString(
                                                   "en-IN"
                                                )}
                                             </span>
                                          ) : (
                                             <span className="text-muted-foreground">
                                                ₹0
                                             </span>
                                          )}
                                       </div>
                                    </TableCell>
                                 </TableRow>
                              ))}
                           </TableBody>
                        </Table>
                     </div>
                  )}
               </div>
            </div>

            {/* Right Side - Statistics & Profile Image */}
            <div className="w-md space-y-10">
               {/* Profile Image */}
               <div className="rounded-lg">
                  <h2 className="mb-2 text-xl font-semibold">Profile Image</h2>
                  {volunteer.profileImage ? (
                     <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={volunteer.profileImage}
                        alt={volunteer.fullName}
                        width={1000}
                        height={1000}
                        className="aspect-video rounded-lg border object-contain"
                     />
                  ) : (
                     <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200">
                        <span className="text-gray-400">
                           No Profile Image uploaded
                        </span>
                     </div>
                  )}
               </div>

               {/* Government ID Image */}
               <div className="rounded-lg">
                  <h2 className="mb-2 text-xl font-semibold">Government ID</h2>
                  {volunteer.govIdImage ? (
                     <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={volunteer.govIdImage}
                        alt={`${volunteer.fullName} - Government ID`}
                        width={1000}
                        height={1000}
                        className="aspect-video rounded-lg border object-contain"
                     />
                  ) : (
                     <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200">
                        <span className="text-gray-400">
                           No Government ID uploaded
                        </span>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
