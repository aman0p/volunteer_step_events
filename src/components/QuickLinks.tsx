import React from "react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";

interface QuickLink {
   id: string;
   title: string;
   url: string;
}

interface QuickLinksProps {
   quickLinks: QuickLink[];
   isEnrolled: boolean;
   isEventCreator: boolean;
}

const QuickLinks: React.FC<QuickLinksProps> = ({
   quickLinks,
   isEnrolled,
   isEventCreator,
}) => {
   // Check if user can access quick links (either enrolled or is event creator)
   const canAccessQuickLinks = isEnrolled || isEventCreator;

   return (
      <div className="shadow-foreground/20 relative h-full w-full space-y-5 rounded-xl bg-white/10 px-3 py-5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:shadow-xl md:rounded-2xl md:p-5 lg:rounded-3xl">
         <h2 className="text-xl font-bold md:text-2xl">Quick Links</h2>

         {/* Lock overlay for non-enrolled users and non-creators */}
         {!canAccessQuickLinks && (
            <div className="group bg-background/10 text-background group relative flex items-start gap-4 rounded-xl p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:shadow-lg hover:shadow-white/5">
               <Lock className="text-foreground absolute top-10 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
            </div>
         )}

         {/* Quick Links Content - Only render actual data for approved users or event creators */}
         {canAccessQuickLinks ? (
            // Show actual quick links for approved users
            quickLinks && quickLinks.length > 0 ? (
               <div className="flex flex-col gap-2">
                  {quickLinks.map((link, index) => (
                     <div
                        key={link.id}
                        className="group text-background group hover:bg-foreground/5 relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-lg hover:shadow-white/5"
                     >
                        {/* Link number indicator */}
                        <div className="bg-background/30 text-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                           {index + 1}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col space-y-2">
                           <div className="flex items-center justify-between">
                              <p className="text-foreground group-hover:text-foreground/80 text-base font-semibold transition-colors">
                                 {link.title}
                              </p>
                              <CopyButton
                                 text={link.url}
                                 size="sm"
                                 variant="ghost"
                                 className="bg-background/30 text-foreground transition-opacity duration-200"
                              />
                           </div>

                           <Link
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground group/link flex items-center gap-2 text-sm transition-colors duration-200 group-hover:text-green-600"
                           >
                              <span className="truncate">{link.url}</span>
                              <svg
                                 className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                 />
                              </svg>
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="py-8 text-center text-white/50">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                     <svg
                        className="h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={1.5}
                           d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                     </svg>
                  </div>
                  <p className="mb-1 text-sm font-medium">
                     No quick links available
                  </p>
                  <p className="text-xs">
                     Check back later for helpful resources
                  </p>
               </div>
            )
         ) : (
            // Show placeholder content for non-enrolled users (no actual data)
            <div className="flex flex-col gap-2">
               {[1, 2, 3].map((i) => (
                  <div
                     key={i}
                     className="flex items-start gap-4 rounded-xl border border-white/10 p-4"
                  >
                     <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Skeleton className="h-4 w-4 bg-white/20" />
                     </div>
                     <div className="flex min-w-0 flex-1 flex-col space-y-2">
                        <Skeleton className="h-5 w-3/4 bg-white/20" />
                        <Skeleton className="h-4 w-1/2 bg-white/10" />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default QuickLinks;
