import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import {
   ArrowLeft,
   Mail,
   Phone,
   MapPin,
   Calendar,
   Users,
   Edit,
   Trash2,
   ExternalLink,
   Tag,
} from 'lucide-react';
import Link from 'next/link';
import { Image } from '@imagekit/next';
import config from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';

export default async function VolunteerDetailsPage({
   params,
}: {
   params: { id: string };
}) {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect('/sign-in');
   }

   // Check if user has admin role
   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
   });

   if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZER')) {
      redirect('/');
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
                        where: { status: 'APPROVED' },
                        select: { id: true },
                     },
                  },
               },
            },
            orderBy: { enrolledAt: 'desc' },
         },
      },
   });

   if (!volunteer) {
      redirect('/admin/volunteer');
   }

   const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      }).format(date);
   };

   const getTimeRange = (startDate: Date, endDate: Date) => {
      const start = new Intl.DateTimeFormat('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      }).format(startDate);

      const end = new Intl.DateTimeFormat('en-US', {
         hour: '2-digit',
         minute: '2-digit',
      }).format(endDate);

      return `${start} - ${end}`;
   };

   const getEnrollmentStats = (enrollments: any[]) => {
      const approved = enrollments.filter(
         (e) => e.status === 'APPROVED'
      ).length;
      const pending = enrollments.filter((e) => e.status === 'PENDING').length;
      const rejected = enrollments.filter(
         (e) => e.status === 'REJECTED'
      ).length;
      return { approved, pending, rejected, total: enrollments.length };
   };

   const stats = getEnrollmentStats(volunteer.enrollments);

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

         <div className="flex w-full justify-between">
            {/* Header */}
            <div className="space-y-1">
               <h1 className="text-3xl font-bold tracking-tight">
                  {volunteer.fullName}
               </h1>
               <p className="text-muted-foreground">
                  View volunteer profile and event history
               </p>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
               </Button>
               <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Volunteer
               </Button>
            </div>
         </div>

         <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
               {/* Profile Information */}
               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                     Profile Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Name
                        </label>
                        <p className="text-sm">{volunteer.fullName}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Email
                        </label>
                        <p className="text-sm">{volunteer.email}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Phone Number
                        </label>
                        <p className="text-sm">
                           <span className="text-gray-700 select-none">
                              +91
                           </span>
                           {volunteer.phoneNumber}
                        </p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Gender
                        </label>
                        <p className="text-sm">{volunteer.gender}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Address
                        </label>
                        <p className="text-sm">{volunteer.address}</p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Role
                        </label>
                        <p className="text-sm">
                           <Badge variant="outline">{volunteer.role}</Badge>
                        </p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Member Since
                        </label>
                        <p className="text-sm">
                           {formatDate(volunteer.createdAt)}
                        </p>
                     </div>

                     <div>
                        <label className="text-muted-foreground text-sm font-medium">
                           Volunteer ID
                        </label>
                        <p className="font-mono text-sm text-xs">
                           {volunteer.id}
                        </p>
                     </div>
                  </div>

                  {/* Skills */}
                  {volunteer.skills && volunteer.skills.length > 0 && (
                     <div className="mt-4">
                        <label className="text-muted-foreground text-sm font-medium">
                           Skills
                        </label>
                        <div className="mt-1 flex flex-wrap gap-1">
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
                     </div>
                  )}
               </div>

               {/* Event History */}
               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                     Event History ({volunteer.enrollments.length})
                  </h2>

                  {volunteer.enrollments.length === 0 ? (
                     <div className="py-8 text-center text-gray-500">
                        <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                           No events yet
                        </h3>
                        <p className="text-gray-500">
                           This volunteer hasn't enrolled in any events yet.
                        </p>
                     </div>
                  ) : (
                     <Table>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Event Name</TableHead>
                              <TableHead>Location</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {volunteer.enrollments.map((enrollment) => (
                              <TableRow
                                 key={enrollment.id}
                                 className="hover:bg-muted/50"
                              >
                                 <TableCell className="group">
                                    <div className="flex items-center gap-3">
                                       <div className="flex-1">
                                          <h3 className="font-medium text-gray-900">
                                             {enrollment.event.title}
                                          </h3>
                                          <div className="mt-1 flex items-center gap-2">
                                             <StatusBadge
                                                status={enrollment.status}
                                             />
                                             <span className="text-xs text-gray-500">
                                                Enrolled:{' '}
                                                {formatDate(
                                                   enrollment.enrolledAt
                                                )}
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-gray-600">
                                    {enrollment.event.location}
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  )}
               </div>
            </div>

            {/* Right Side - Statistics & Profile Image */}
            <div className="space-y-6">
               {/* Profile Image */}
               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Profile Image</h2>
                  <div className="relative">
                     {volunteer.profileImage ? (
                        <Image
                           urlEndpoint={config.env.imagekit.urlEndpoint}
                           src={volunteer.profileImage}
                           alt={volunteer.fullName}
                           width={1000}
                           height={1000}
                           className="aspect-video rounded-lg object-cover object-top"
                        />
                     ) : (
                        <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200">
                           <span className="text-6xl text-gray-400">
                              {volunteer.gender.charAt(0).toUpperCase()}
                           </span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Enrollment Statistics */}
               <div className="rounded-lg border bg-black/10 p-6">
                  <h2 className="mb-4 text-xl font-semibold">
                     Enrollment Statistics
                  </h2>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                        <div className="flex items-center gap-3">
                           <div className="h-3 w-3 rounded-full bg-green-500"></div>
                           <span className="text-sm font-medium text-gray-700">
                              Approved
                           </span>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                           {stats.approved}
                        </span>
                     </div>

                     <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-3">
                        <div className="flex items-center gap-3">
                           <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                           <span className="text-sm font-medium text-gray-700">
                              Pending
                           </span>
                        </div>
                        <span className="text-lg font-bold text-yellow-600">
                           {stats.pending}
                        </span>
                     </div>

                     <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                        <div className="flex items-center gap-3">
                           <div className="h-3 w-3 rounded-full bg-red-500"></div>
                           <span className="text-sm font-medium text-gray-700">
                              Rejected
                           </span>
                        </div>
                        <span className="text-lg font-bold text-red-600">
                           {stats.rejected}
                        </span>
                     </div>

                     <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium text-gray-700">
                              Total Events
                           </span>
                           <span className="text-lg font-bold text-gray-900">
                              {stats.total}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
