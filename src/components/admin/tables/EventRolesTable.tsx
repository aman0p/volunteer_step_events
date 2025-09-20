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
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EventRole {
   id: string;
   name: string;
   description: string;
   payout: number;
   maxCount: number;
   enrollments: { id: string }[];
}

interface EventRolesTableProps {
   eventRoles: EventRole[];
   className?: string;
}

export default function EventRolesTable({
   eventRoles,
   className,
}: EventRolesTableProps) {
   const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
      {}
   );

   const toggleRow = (roleId: string) => {
      setExpandedRows((prev) => ({
         ...prev,
         [roleId]: !prev[roleId],
      }));
   };

   if (!eventRoles || eventRoles.length === 0) {
      return (
         <Card>
            <CardContent className="text-muted-foreground py-10 text-center">
               <p>No volunteer roles defined for this event</p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className={`w-full backdrop-blur-2xl bg-transparent overflow-hidden ${className || ""}`}>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <Table className="min-w-[700px]">
                  <TableHeader>
                     <TableRow className="border-y  bg-black/15 pointer-events-none">
                        <TableHead className="min-w-[80px] text-center font-semibold">
                           Actions
                        </TableHead>
                        <TableHead className="min-w-[150px] text-center font-semibold">
                           Role Name
                        </TableHead>
                        <TableHead className="min-w-[100px] text-center font-semibold">
                           Volunteers
                        </TableHead>
                        <TableHead className="min-w-[200px] text-center font-semibold">
                           Description
                        </TableHead>
                        <TableHead className="min-w-[120px] text-center font-semibold">
                           Payout (₹)
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {eventRoles.map((role) => (
                        <TableRow key={role.id}>
                           <TableCell
                              className="hover:bg-muted/50 min-w-[80px] cursor-pointer p-4 text-center transition-colors"
                              onClick={() => toggleRow(role.id)}
                              title={
                                 expandedRows[role.id]
                                    ? "Collapse description"
                                    : "Expand description"
                              }
                           >
                              {expandedRows[role.id] ? (
                                 <ChevronDown className="text-muted-foreground mx-auto h-4 w-4" />
                              ) : (
                                 <ChevronRight className="text-muted-foreground mx-auto h-4 w-4" />
                              )}
                           </TableCell>
                           <TableCell
                              className="h-24 max-w-[12rem] min-w-[150px] p-4 font-medium"
                              title={role.name}
                           >
                              <div className="leading-relaxed break-words whitespace-normal">
                                 {expandedRows[role.id] ? (
                                    <div className="leading-relaxed break-words whitespace-normal">
                                       {role.name}
                                    </div>
                                 ) : (
                                    <div className="line-clamp-2 leading-relaxed break-words whitespace-normal">
                                       {role.name}
                                    </div>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell className="h-24 min-w-[100px] p-4 text-center">
                              <span className="font-medium">
                                 {role.enrollments.length || 0}
                              </span>
                              <span className="text-muted-foreground"> / </span>
                              <span>{role.maxCount}</span>
                           </TableCell>
                           <TableCell className="h-24 max-w-[15rem] min-w-[200px] p-4">
                              <div className="leading-relaxed break-words whitespace-normal">
                                 {expandedRows[role.id] ? (
                                    <div className="leading-relaxed break-words whitespace-normal">
                                       {role.description}
                                    </div>
                                 ) : (
                                    <div className="line-clamp-2 leading-relaxed break-words whitespace-normal">
                                       {role.description}
                                    </div>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell className="h-24 min-w-[120px] p-4 text-center">
                              {role.payout.toLocaleString("en-IN")}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </CardContent>
      </Card>
   );
}
