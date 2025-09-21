import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui";
import Link from "next/link";

interface QuickLink {
   id: string;
   title: string;
   url: string;
   isActive: boolean;
}

interface QuickLinksTableProps {
   quickLinks: QuickLink[];
}

export default function QuickLinksTable({ quickLinks }: QuickLinksTableProps) {
   if (!quickLinks || quickLinks.length === 0) {
      return (
         <div className="overflow-hidden rounded-lg border">
            <div className="rounded-lg border-2 border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
               <p>No quick links defined yet</p>
               <p className="text-xs">Add quick links when editing the event</p>
            </div>
         </div>
      );
   }

   return (
      <div className="overflow-hidden rounded-lg border">
         <table className="w-full">
            <tbody>
               {quickLinks.map((link, index) => (
                  <tr
                     key={link.id}
                     className={index < quickLinks.length - 1 ? "border-b" : ""}
                  >
                     <td className="text-muted-foreground bg-muted/50 w-1/3 px-4 py-3 text-sm font-medium">
                        <div className="flex items-center gap-2">
                           <CopyButton
                              text={link.url}
                              size="sm"
                              variant="ghost"
                              className="mr-1"
                           />
                           <span className="line-clamp-1">{link.title}</span>
                           {!link.isActive && (
                              <Badge variant="secondary" className="text-xs">
                                 Inactive
                              </Badge>
                           )}
                        </div>
                     </td>
                     <td className="px-4 py-3 text-sm">
                        <Link
                           href={link.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="block truncate text-blue-500 hover:text-blue-700 hover:underline"
                        >
                           {link.url}
                        </Link>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}
