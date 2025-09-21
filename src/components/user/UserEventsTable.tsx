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
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type EventData = {
   id: string;
   title: string;
   description: string;
   startDate: Date;
   endDate: Date;
   location: string;
   enrollmentStatus: string;
   eventRole?: {
      id: string;
      name: string;
      payout: number;
   } | null;
};

interface UserEventsProps {
   events: EventData[];
}

export function UserEventsTable({ events }: UserEventsProps) {
   const [page, setPage] = useState(1);
   const [selectedRows, setSelectedRows] = useState<string[]>([]);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [isLoading, setIsLoading] = useState(false);

   const paginatedData = events.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
   );
   const totalPages = Math.ceil(events.length / rowsPerPage);

   const handleSelectAll = (checked: boolean) => {
      if (checked) {
         setSelectedRows(paginatedData.map((row) => row.id));
      } else {
         setSelectedRows([]);
      }
   };

   const handleSelectRow = (id: string, checked: boolean) => {
      if (checked) {
         setSelectedRows((prev) => [...prev, id]);
      } else {
         setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      }
   };

   const handleClearSelection = async () => {
      setIsLoading(true);
      try {
         // Simulate any potential async operation
         await new Promise((resolve) => setTimeout(resolve, 300));
         setSelectedRows([]);
      } finally {
         setIsLoading(false);
      }
   };

   const formatDateRange = (startDate: Date, endDate: Date) => {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const startMonth = start.toLocaleDateString("en-US", { month: "short" });
      const startDay = start.getDate();
      const endDay = end.getDate();

      // If same month, show "Sept 12-14" format
      if (
         start.getMonth() === end.getMonth() &&
         start.getFullYear() === end.getFullYear()
      ) {
         return `${startMonth} ${startDay}-${endDay}`;
      }

      // If different months, show "Sept 12 - Oct 3" format
      const endMonth = end.toLocaleDateString("en-US", { month: "short" });
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
   };

   return (
      <div className="space-y-4">
         {/* Top section */}
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-muted-background text-sm font-medium md:text-base">
                  {selectedRows.length} of {events.length} selected
               </span>
            </div>
            {selectedRows.length > 0 && (
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  loading={isLoading}
                  className="text-xs"
               >
                  Clear Selection
               </Button>
            )}
         </div>

         {/* Table */}
         <div className="overflow-hidden rounded-md border backdrop-blur-2xl">
            <Table className="min-w-[900px]">
               <TableHeader className="pointer-events-none border-b border-black bg-black/20">
                  <TableRow>
                     <TableHead className="w-10 min-w-[40px] text-center">
                        <Checkbox
                           checked={
                              selectedRows.length === paginatedData.length &&
                              paginatedData.length > 0
                           }
                           onCheckedChange={handleSelectAll}
                        />
                     </TableHead>
                     <TableHead className="w-48 min-w-[192px] text-center">
                        Event Name
                     </TableHead>
                     <TableHead className="w-32 min-w-[128px] text-center">
                        Enrollment Status
                     </TableHead>
                     <TableHead className="w-40 min-w-[160px] text-center">
                        Date
                     </TableHead>
                     <TableHead className="w-40 min-w-[160px] text-center">
                        Location
                     </TableHead>
                     <TableHead className="w-32 min-w-[128px] text-center">
                        Applied Role
                     </TableHead>
                     <TableHead className="w-32 min-w-[128px] text-center">
                        Payout
                     </TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {paginatedData.map((event) => (
                     <TableRow key={event.id} className="hover:bg-muted/50">
                        <TableCell className="w-10 min-w-[40px] text-center">
                           <Checkbox
                              checked={selectedRows.includes(event.id)}
                              onCheckedChange={(checked) =>
                                 handleSelectRow(event.id, checked as boolean)
                              }
                           />
                        </TableCell>
                        <TableCell className="min-w-[192px] text-center">
                           <Link
                              href={`/events/${event.id}`}
                              className="group flex items-center justify-center space-x-2"
                           >
                              <div className="line-clamp-1 font-medium text-blue-600 hover:text-blue-700">
                                 {event.title}
                              </div>
                              <ArrowRight className="relative -top-2 -left-1 h-3 w-3 rotate-[-45deg] text-blue-600 transition-all duration-150 group-hover:-top-2.5 group-hover:-left-0.5 hover:text-blue-700" />
                           </Link>
                        </TableCell>
                        <TableCell className="min-w-[128px] text-center">
                           <StatusBadge status={event.enrollmentStatus} />
                        </TableCell>
                        <TableCell className="min-w-[160px] text-center">
                           <div className="flex items-center justify-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="line-clamp-1 text-sm">
                                 {formatDateRange(
                                    event.startDate,
                                    event.endDate
                                 )}
                              </span>
                           </div>
                        </TableCell>
                        <TableCell className="min-w-[160px] text-center">
                           <div className="flex items-center justify-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span
                                 className="line-clamp-1 text-sm"
                                 title={event.location}
                              >
                                 {event.location}
                              </span>
                           </div>
                        </TableCell>
                        <TableCell className="min-w-[128px] text-center">
                           <div className="line-clamp-1">
                              {event.eventRole ? (
                                 <span className="text-sm font-medium">
                                    {event.eventRole.name}
                                 </span>
                              ) : (
                                 <span className="text-muted-foreground text-sm">
                                    {event.enrollmentStatus === "NOT_ENROLLED"
                                       ? "Not enrolled"
                                       : "No role selected"}
                                 </span>
                              )}
                           </div>
                        </TableCell>
                        <TableCell className="min-w-[128px] text-center">
                           <div className="line-clamp-1">
                              {event.eventRole ? (
                                 <span className="text-sm font-medium text-green-600">
                                    ₹
                                    {event.eventRole.payout.toLocaleString(
                                       "en-IN"
                                    )}
                                 </span>
                              ) : (
                                 <span className="text-muted-foreground text-sm">
                                    {event.enrollmentStatus === "NOT_ENROLLED"
                                       ? "-"
                                       : "₹0"}
                                 </span>
                              )}
                           </div>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         {/* Pagination */}
         <div className="flex items-center justify-between py-2">
            <p className="text-muted-background text-sm font-medium md:text-base">
               {selectedRows.length} of {events.length} row(s) selected
            </p>
            <div className="text-muted-background flex items-center gap-2 text-sm font-medium md:text-base">
               <Select
                  value={rowsPerPage.toString()}
                  onValueChange={(value) => setRowsPerPage(parseInt(value))}
               >
                  <SelectTrigger className="w-[100px] border-2 text-sm font-bold text-black backdrop-blur-2xl">
                     <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="20">20</SelectItem>
                     <SelectItem value="50">50</SelectItem>
                  </SelectContent>
               </Select>
               <span className="text-sm md:text-base">
                  Page {page} of {totalPages}
               </span>
               <div className="flex gap-1 backdrop-blur-2xl">
                  <Button
                     className="text-muted-background aspect-square text-sm font-bold md:text-lg"
                     variant="outline"
                     size="sm"
                     onClick={() => setPage(1)}
                     disabled={page === 1}
                  >
                     «
                  </Button>
                  <Button
                     className="text-muted-background aspect-square text-sm font-bold md:text-lg"
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => Math.max(1, p - 1))}
                     disabled={page === 1}
                  >
                     ‹
                  </Button>
                  <Button
                     className="text-muted-background aspect-square text-sm font-bold md:text-lg"
                     variant="outline"
                     size="sm"
                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                     disabled={page === totalPages}
                  >
                     ›
                  </Button>
                  <Button
                     className="text-muted-background aspect-square text-sm font-bold md:text-lg"
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
