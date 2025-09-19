"use client";

import { useState, useEffect } from "react";
import { Search, X, Mail, Phone, Shield, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import Link from "next/link";

interface Volunteer {
   id: string;
   fullName: string;
   email: string;
   phoneNumber: string;
   address: string;
   skills: string[];
   profileImage: string | null;
   gender: string;
   role: string;
   createdAt: Date;
   enrollments: {
      id: string;
      status: string;
      event: {
         id: string;
         title: string;
      };
   }[];
}

interface VolunteerSearchProps {
   onVolunteerSelect?: (volunteer: Volunteer) => void;
   placeholder?: string;
   className?: string;
   eventId?: string; // Add eventId to filter volunteers by specific event
   includeAdmins?: boolean; // New prop to control whether to include admins
   showToggle?: boolean; // Show toggle for admin inclusion
}

export default function VolunteerSearch({
   onVolunteerSelect,
   placeholder = "Search users by name...",
   className = "",
   eventId,
   includeAdmins = true, // Default to true to include admins
   showToggle = true, // Show toggle by default
}: VolunteerSearchProps) {
   const [query, setQuery] = useState("");
   const [results, setResults] = useState<Volunteer[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [showResults, setShowResults] = useState(false);
   const [includeAdminsState, setIncludeAdminsState] = useState(includeAdmins);

   useEffect(() => {
      const searchVolunteers = async () => {
         if (query.trim().length < 2) {
            setResults([]);
            setShowResults(false);
            return;
         }

         setIsLoading(true);
         try {
            const searchUrl = `/api/admin/volunteer/search?q=${encodeURIComponent(query)}${eventId ? `&eventId=${eventId}` : ""}${includeAdminsState ? "&includeAdmins=true" : ""}`;

            const response = await fetch(searchUrl);

            if (response.ok) {
               const data = await response.json();
               const volunteers = data.volunteer || [];
               setResults(volunteers);
               setShowResults(true);
            } else {
               console.error(
                  "Search response not ok:",
                  response.status,
                  response.statusText
               );
            }
         } catch (error) {
            console.error("Search error:", error);
            setResults([]);
         } finally {
            setIsLoading(false);
         }
      };

      const debounceTimer = setTimeout(searchVolunteers, 300);
      return () => clearTimeout(debounceTimer);
   }, [query, eventId, includeAdminsState]);

   const handleVolunteerClick = (volunteer: Volunteer) => {
      if (onVolunteerSelect) {
         onVolunteerSelect(volunteer);
      }
      setShowResults(false);
      setQuery(volunteer.fullName);
   };

   const clearSearch = () => {
      setQuery("");
      setResults([]);
      setShowResults(false);
   };

   const getStatusBadge = (status: string) => {
      switch (status) {
         case "PENDING":
            return (
               <Badge variant="secondary" className="text-xs">
                  Pending
               </Badge>
            );
         case "APPROVED":
            return (
               <Badge
                  variant="default"
                  className="bg-green-600 text-xs text-white"
               >
                  Approved
               </Badge>
            );
         case "REJECTED":
            return (
               <Badge variant="destructive" className="text-xs">
                  Rejected
               </Badge>
            );
         default:
            return (
               <Badge variant="outline" className="text-xs">
                  {status}
               </Badge>
            );
      }
   };

   const getRoleBadge = (role: string) => {
      switch (role) {
         case "ADMIN":
            return (
               <Badge
                  variant="destructive"
                  className="bg-red-600 text-xs text-white"
               >
                  Admin
               </Badge>
            );
         case "ORGANIZER":
            return (
               <Badge
                  variant="default"
                  className="bg-blue-600 text-xs text-white"
               >
                  Organizer
               </Badge>
            );
         case "VOLUNTEER":
            return (
               <Badge
                  variant="secondary"
                  className="bg-green-600 text-xs text-white"
               >
                  Volunteer
               </Badge>
            );
         case "USER":
            return (
               <Badge variant="outline" className="text-xs">
                  User
               </Badge>
            );
         default:
            return (
               <Badge variant="outline" className="text-xs">
                  {role}
               </Badge>
            );
      }
   };

   const toggleAdminInclusion = () => {
      setIncludeAdminsState(!includeAdminsState);
      // Clear results when toggling to trigger new search
      if (query.trim().length >= 2) {
         setResults([]);
         setShowResults(false);
      }
   };

   return (
      <div className={`relative ${className}`}>
         {/* Search Input and Toggle */}
         <div className="mb-2 flex gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
               <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
               <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  onFocus={() =>
                     query.trim().length >= 2 && setShowResults(true)
                  }
               />
               {query && (
                  <button
                     onClick={clearSearch}
                     className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                     <X className="h-4 w-4" />
                  </button>
               )}
            </div>

            {/* Admin Toggle */}
            {/* {showToggle && (
          <Button
            type="button"
            variant={includeAdminsState ? "default" : "outline"}
            size="sm"
            onClick={toggleAdminInclusion}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {includeAdminsState ? (
              <>
                <Shield className="w-4 h-4" />
                Include Admins
              </>
            ) : (
              <>
                <Users className="w-4 h-4" />
                Users Only
              </>
            )}
          </Button>
        )} */}
         </div>

         {/* Search Results */}
         {showResults && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
               {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                     <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                     <p className="mt-2">Searching...</p>
                  </div>
               ) : results.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                     {query.trim().length >= 2
                        ? "No users found"
                        : "Type at least 2 characters to search"}
                  </div>
               ) : (
                  <div className="py-2">
                     {results.map((volunteer) => (
                        <div
                           key={volunteer.id}
                           className="cursor-pointer border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                           onClick={() => handleVolunteerClick(volunteer)}
                        >
                           <Link
                              href={`/admin/volunteer/${volunteer.id}`}
                              className="flex items-center gap-3"
                           >
                              {/* Profile Image */}
                              <div className="flex-shrink-0">
                                 {volunteer.profileImage ? (
                                    <div className="h-10 w-10 overflow-hidden rounded-full">
                                       <Image
                                          urlEndpoint={
                                             config.env.imagekit.urlEndpoint
                                          }
                                          src={volunteer.profileImage}
                                          alt={volunteer.fullName}
                                          width={100}
                                          height={100}
                                          className="h-full w-full object-cover"
                                       />
                                    </div>
                                 ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                       <span className="text-lg">
                                          {volunteer.fullName
                                             .split(" ")
                                             .map((n: string) => n[0])
                                             .join("")
                                             .toUpperCase()}
                                       </span>
                                    </div>
                                 )}
                              </div>

                              {/* Volunteer Info */}
                              <div className="min-w-0 flex-1">
                                 <div className="mb-1 flex items-center gap-3">
                                    <h4 className="truncate font-medium text-gray-900">
                                       {volunteer.fullName}
                                    </h4>
                                    {getRoleBadge(volunteer.role)}
                                    {volunteer.role === "ADMIN" && (
                                       <Shield className="h-4 w-4 text-red-600" />
                                    )}
                                    {volunteer.role === "ORGANIZER" && (
                                       <UserCheck className="h-4 w-4 text-blue-600" />
                                    )}
                                 </div>

                                 <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                       <Mail className="h-3 w-3" />
                                       <span className="truncate">
                                          {volunteer.email}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                       <Phone className="h-3 w-3" />
                                       <span className="text-gray-700 select-none">
                                          +91
                                       </span>
                                       <span className="text-gray-700">
                                          {volunteer.phoneNumber}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Skills */}
                                 {volunteer.skills &&
                                    volunteer.skills.length > 0 && (
                                       <div className="mt-2 flex flex-wrap gap-1">
                                          {volunteer.skills
                                             .slice(0, 3)
                                             .map((skill, index) => (
                                                <Badge
                                                   key={index}
                                                   variant="outline"
                                                   className="text-xs"
                                                >
                                                   {skill}
                                                </Badge>
                                             ))}
                                          {volunteer.skills.length > 3 && (
                                             <Badge
                                                variant="outline"
                                                className="text-xs"
                                             >
                                                +{volunteer.skills.length - 3}{" "}
                                                more
                                             </Badge>
                                          )}
                                       </div>
                                    )}

                                 {/* Recent Events */}
                                 {/* {volunteer.enrollments && volunteer.enrollments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Recent Events:</p>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.enrollments.slice(0, 2).map((enrollment) => (
                              <div key={enrollment.id} className="flex items-center gap-1">
                                {getStatusBadge(enrollment.status)}
                                <span className="text-xs text-gray-600 truncate max-w-24">
                                  {enrollment.event.title}
                                </span>
                              </div>
                            ))}
                            {volunteer.enrollments.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{volunteer.enrollments.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )} */}
                              </div>
                           </Link>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Click outside to close */}
         {showResults && (
            <div
               className="fixed inset-0 z-40"
               onClick={() => setShowResults(false)}
            />
         )}
      </div>
   );
}
