"use client";

import { useState, useEffect } from "react";
import { Search, X, Mail, Phone } from "lucide-react";
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
}

export default function VolunteerSearch({ onVolunteerSelect, placeholder = "Search volunteers by name...", className = "", eventId }: VolunteerSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Volunteer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchVolunteers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchUrl = `/api/admin/volunteer/search?q=${encodeURIComponent(query)}${eventId ? `&eventId=${eventId}` : ''}`;
        
        const response = await fetch(searchUrl);
        
        if (response.ok) {
          const data = await response.json();
          const volunteers = data.volunteer || [];
          setResults(volunteers);
          setShowResults(true);
        } else {
          console.error('Search response not ok:', response.status, response.statusText);
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
  }, [query, eventId]);



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

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "👨";
      case "FEMALE":
        return "👩";
      case "OTHER":
        return "👤";
      default:
        return "👤";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="default" className="bg-green-600 text-white text-xs">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {query.trim().length >= 2 ? "No volunteers found" : "Type at least 2 characters to search"}
            </div>
          ) : (
            <div className="py-2">
              {results.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleVolunteerClick(volunteer)}
                >
                  <Link href={`/admin/volunteer/${volunteer.id}`} className="flex items-center gap-3">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      {volunteer.profileImage ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            urlEndpoint={config.env.imagekit.urlEndpoint}
                            src={volunteer.profileImage}
                            alt={volunteer.fullName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg">{getGenderIcon(volunteer.gender)}</span>
                        </div>
                      )}
                    </div>

                    {/* Volunteer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{volunteer.fullName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {volunteer.role}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{volunteer.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span className="text-gray-700 select-none">+91</span>
                          <span className="text-gray-700">{volunteer.phoneNumber}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      {volunteer.skills && volunteer.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {volunteer.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{volunteer.skills.length - 3} more
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
