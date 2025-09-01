import React from "react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/ui";

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

const QuickLinks: React.FC<QuickLinksProps> = ({ quickLinks, isEnrolled, isEventCreator }) => {
  // Check if user can access quick links (either enrolled or is event creator)
  const canAccessQuickLinks = isEnrolled || isEventCreator;
  
  return (
    <div className="h-fit mb-5 w-full flex flex-col gap-3 md:gap-5 p-3 md:p-7 rounded-xl md:rounded-2xl lg:rounded-3xl bg-black/5 relative">
      <h1 className="text-base md:text-xl font-bold">Quick Links</h1>
      
      {/* Lock overlay for non-enrolled users and non-creators */}
      {!canAccessQuickLinks && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl md:rounded-2xl lg:rounded-3xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2 text-white">
            <Lock className="w-8 h-8 text-white/80" />
            <p className="text-sm font-medium">
              {isEventCreator ? "Enroll to access quick links" : "Enroll to access quick links"}
            </p>
          </div>
        </div>
      )}
      
      {/* Quick Links Content - Only render actual data for approved users or event creators */}
      {canAccessQuickLinks ? (
        // Show actual quick links for approved users
        quickLinks && quickLinks.length > 0 ? (
          <div className="flex flex-col gap-3 overflow-hidden text-xs md:text-sm">
            {quickLinks.map((link) => (
              <div key={link.id} className="flex items-center md:gap-4 hover:bg-black/5 p-2 rounded-lg transition-colors">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="font-medium text-black/80 truncate flex items-center">
                    {link.title}
                    <CopyButton 
                      text={link.url}
                      size="sm"
                      variant="ghost"
                      className="scale-90 ml-1"
                    />
                  </p>
                  <Link 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-black/60 truncate max-w-xs text-xs">
                    {link.url}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-black/50">
            <p className="text-sm">No quick links available</p>
            <p className="text-xs">Check back later for helpful resources</p>
          </div>
        )
      ) : (
        // Show placeholder content for non-enrolled users (no actual data)
        <div className="flex flex-col gap-3 overflow-hidden text-xs md:text-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center md:gap-4 p-2 rounded-lg">
              <div className="flex flex-col min-w-0 flex-1">
                <div className="h-4 bg-black/20 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-black/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickLinks;
