"use client";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "@imagekit/next";
import config from "@/lib/config";

interface EnrolledVolunteer {
   id: string;
   user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      profileImage: string;
   };
   eventRole?: {
      id: string;
      name: string;
   } | null;
}

interface EnrolledVolunteersTableProps {
   enrolledVolunteers: EnrolledVolunteer[];
   className?: string;
}

export default function EnrolledVolunteersTable({
   enrolledVolunteers,
   className,
}: EnrolledVolunteersTableProps) {
   if (!enrolledVolunteers || enrolledVolunteers.length === 0) {
      return (
         <Card>
            <CardContent className="text-muted-foreground py-10 text-center">
               <p>No approved volunteers enrolled for this event</p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card
         className={`h-[50vh] w-full bg-transparent pb-0 backdrop-blur-2xl ${className || ""}`}
      >
         <CardContent className="h-full p-0">
            <div className="flex h-full flex-col">
               {/* Fixed Header */}
               <div className="overflow-x-auto [scrollbar-color:black_gray-100] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:hover:bg-black [&::-webkit-scrollbar-track]:bg-gray-100">
                  <Table className="min-w-[700px]">
                     <TableHeader>
                        <TableRow className="pointer-events-none border-y bg-black/15">
                           <TableHead className="min-w-[200px] pl-5 font-semibold">
                              Volunteer
                           </TableHead>
                           <TableHead className="min-w-[150px] text-center font-semibold">
                              Role
                           </TableHead>
                           <TableHead className="min-w-[150px] text-center font-semibold">
                              Phone Number
                           </TableHead>
                           <TableHead className="min-w-[200px] text-center font-semibold">
                              Email
                           </TableHead>
                        </TableRow>
                     </TableHeader>
                  </Table>
               </div>
               {/* Scrollable Body */}
               <div className="flex-1 overflow-x-auto overflow-y-auto [scrollbar-color:black_gray-100] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black [&::-webkit-scrollbar-thumb]:hover:bg-black [&::-webkit-scrollbar-track]:bg-gray-100">
                  <Table className="min-w-[700px]">
                     <TableBody>
                        {enrolledVolunteers.map((volunteer) => (
                           <TableRow key={volunteer.id}>
                              <TableCell
                                 className="h-16 max-w-[12rem] min-w-[200px] p-4 pl-5 font-medium"
                                 title={volunteer.user.fullName}
                              >
                                 <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                                       {volunteer.user.profileImage ? (
                                          <Image
                                             urlEndpoint={
                                                config.env.imagekit.urlEndpoint
                                             }
                                             src={volunteer.user.profileImage}
                                             alt={volunteer.user.fullName}
                                             width={70}
                                             height={70}
                                             className="aspect-square h-8 w-8 rounded-full object-cover"
                                          />
                                       ) : (
                                          <span className="text-xs font-medium text-gray-600">
                                             {volunteer.user.fullName
                                                .charAt(0)
                                                .toUpperCase()}
                                          </span>
                                       )}
                                    </div>
                                    <div className="leading-relaxed break-words whitespace-normal">
                                       <div className="line-clamp-2 leading-relaxed break-words whitespace-normal">
                                          {volunteer.user.fullName}
                                       </div>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell className="h-16 min-w-[150px] p-4 text-center">
                                 <span className="text-sm">
                                    {volunteer.eventRole &&
                                    volunteer.eventRole.name
                                       ? volunteer.eventRole.name
                                       : "No Role Assigned"}
                                 </span>
                              </TableCell>
                              <TableCell className="h-16 min-w-[150px] p-4 text-center">
                                 <span className="text-sm">
                                    +91 {volunteer.user.phoneNumber}
                                 </span>
                              </TableCell>
                              <TableCell className="h-16 max-w-[15rem] min-w-[200px] p-4 text-center">
                                 <div className="leading-relaxed break-words whitespace-normal">
                                    <div className="line-clamp-2 leading-relaxed break-words whitespace-normal">
                                       {volunteer.user.email}
                                    </div>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
