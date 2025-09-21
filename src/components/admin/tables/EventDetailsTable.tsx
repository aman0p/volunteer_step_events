import { Badge } from "@/components/ui/badge";

interface EventDetailsTableProps {
   event: {
      category: string[];
      location: string;
      dressCode: string;
      maxVolunteers: number | null;
      enrollments: { id: string }[];
      startDate: Date;
      endDate: Date;
      id: string;
   };
}

export default function EventDetailsTable({ event }: EventDetailsTableProps) {
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

   const getTimeRange = (startDate: Date, endDate: Date) => {
      const start = new Intl.DateTimeFormat("en-US", {
         hour: "2-digit",
         minute: "2-digit",
      }).format(startDate);

      const end = new Intl.DateTimeFormat("en-US", {
         hour: "2-digit",
         minute: "2-digit",
      }).format(endDate);

      return `${start} - ${end}`;
   };

   return (
      <div className="overflow-hidden rounded-lg border">
         <table className="w-full">
            <tbody>
               <tr className="border-b">
                  <td className="text-muted-foreground bg-muted/50 w-1/3 px-4 py-3 text-sm font-medium">
                     Category
                  </td>
                  <td className="px-4 py-3 text-sm">
                     <div className="flex flex-wrap gap-1">
                        {event.category.map((cat, index) => (
                           <Badge key={index} variant="outline">
                              {cat}
                           </Badge>
                        ))}
                     </div>
                  </td>
               </tr>
               <tr className="border-b">
                  <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                     Location
                  </td>
                  <td className="px-4 py-3 text-sm">{event.location}</td>
               </tr>
               <tr className="border-b">
                  <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                     Dress Code
                  </td>
                  <td className="px-4 py-3 text-sm">{event.dressCode}</td>
               </tr>
               <tr className="border-b">
                  <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                     Volunteers Count
                  </td>
                  <td className="px-4 py-3 text-sm">
                     <span className="font-medium">
                        {event.enrollments.length} /{" "}
                        {event.maxVolunteers || "No limit"}
                     </span>
                  </td>
               </tr>
               <tr className="border-b">
                  <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                     Duration
                  </td>
                  <td className="px-4 py-3 text-sm">
                     {getTimeRange(event.startDate, event.endDate)}
                  </td>
               </tr>
               <tr className="border-b">
                  <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                     Start Date
                  </td>
                  <td className="px-4 py-3 text-sm">
                     {formatDate(event.startDate)}
                  </td>
               </tr>
               <tr>
                  <td className="text-muted-foreground bg-muted/50 px-4 py-3 text-sm font-medium">
                     End Date
                  </td>
                  <td className="px-4 py-3 text-sm">
                     {formatDate(event.endDate)}
                  </td>
               </tr>
            </tbody>
         </table>
      </div>
   );
}
