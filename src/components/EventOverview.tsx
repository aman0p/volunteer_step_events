"use client";

import { Image } from '@imagekit/next';
import { Button } from "./ui/button";
import { Event } from "@/types";
import config from "@/lib/config";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { requestEnrollment } from '@/lib/actions/user/enrollment';
import { toast } from "sonner";
import { useState } from 'react';
import { useSession } from "next-auth/react";

interface EventOverviewProps {
    latestEvents?: (Event & { enrollments?: any[] })[];
    userId?: string;
}

export default function EventOverview({ latestEvents, userId }: EventOverviewProps) {
    const events = latestEvents || [];
    const [isEnrolling, setIsEnrolling] = useState(false);
    const { data: session, status } = useSession();

    const handleEnroll = async (eventId: string) => {
        if (!userId) return;
        
        setIsEnrolling(true);
        try {
            const result = await requestEnrollment(eventId);
            if (result.success) {
                toast.success(result.message);
                // Refresh the page to show updated state
                window.location.reload();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to send enrollment request");
        } finally {
            setIsEnrolling(false);
        }
    };

    // Helper function to render enrollment button based on user role and status
    const renderEnrollmentButton = () => {
        // Show loading state while session is loading
        if (status === "loading") {
            return (
                <Button 
                    disabled
                    className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-gray-400 text-white">
                    Loading...
                </Button>
            );
        }

        // Check if user is not authenticated
        if (!session?.user) {
            return (
                <Button className="w-40 gap-2 flex items-center px-10 py-5 cursor-pointer bg-black text-white">
                    Sign In to Enroll
                </Button>
            );
        }

        // Check if user is not a volunteer
        if (session.user.role !== "VOLUNTEER") {
            if (session.user.role === "USER") {
                return (
                    <Button 
                        disabled
                        className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-gray-500 text-white"
                        title="Complete your profile and request verification to enroll in events">
                        Apply for Verification
                    </Button>
                );
            }
            
            if (session.user.role === "ADMIN" || session.user.role === "ORGANIZER") {
                return (
                    <Button 
                        disabled
                        className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-gray-500 text-white"
                        title="Admins and Organizers cannot enroll as volunteers">
                        Admin/Organizer
                    </Button>
                );
            }

            return (
                <Button 
                    disabled
                    className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-gray-500 text-white"
                    title="Invalid user role">
                    Cannot Enroll
                </Button>
            );
        }

        // User is a volunteer, check enrollment status
        if (events[0]?.enrollments) {
            const userEnrollment = events[0].enrollments.find((e: any) => e.userId === userId);
            const isEnrolled = userEnrollment?.status === 'APPROVED';
            const isPending = userEnrollment?.status === 'PENDING';
            const isRejected = userEnrollment?.status === 'REJECTED';
            const isWaitlisted = userEnrollment?.status === 'WAITLISTED';
            
            if (isEnrolled) {
                return (
                    <Button 
                        disabled
                        className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-green-600 text-white">
                        ✓ Enrolled
                    </Button>
                );
            }
            
            if (isPending) {
                return (
                    <Button 
                        disabled
                        className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-yellow-600 text-white">
                        ⏳ Pending
                    </Button>
                );
            }
            
            if (isRejected) {
                return (
                    <Button 
                        disabled
                        className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-red-600 text-white">
                        ❌ Rejected
                    </Button>
                );
            }

            if (isWaitlisted) {
                return (
                    <Button 
                        disabled
                        className="w-40 gap-2 flex items-center px-10 py-5 cursor-default bg-blue-600 text-white">
                        ⏸️ Waitlisted
                    </Button>
                );
            }
        }

        // Show enroll button for volunteers
        return (
            <Button 
                onClick={() => handleEnroll(events[0].id)}
                disabled={isEnrolling}
                className="w-40 gap-2 flex items-center px-10 py-5 cursor-pointer bg-black text-white hover:bg-gray-800">
                {isEnrolling ? "Enrolling..." : "Enroll Now"}
            </Button>
        );
    };

    return (
        <div className="space-y-20 h-full w-6xl mx-auto">
            <div className="flex flex-col gap-1">
                {events.length > 0 && (
                    <div className="flex flex-col gap-5 md:gap-8 ">
                        {/* Event Title */}
                        <div className="flex gap-2">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{events[0].title}</h1>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-2 text-xs md:text-sm ">
                            <p>
                                Location:&nbsp;
                                <span className="font-bold">{events[0].location}</span>
                            </p>
                            <p>
                                Start Date:&nbsp;
                                <span className="font-bold">{events[0].startDate.toLocaleDateString()}</span>
                            </p>
                            <p>
                                End Date:&nbsp;
                                <span className="font-bold">{events[0].endDate.toLocaleDateString()}</span>
                            </p>
                            <p>
                                Category:&nbsp;
                                <span className="font-bold">{events[0].category.join(", ")}</span>
                            </p>
                            <p>
                                Dress Code:&nbsp;
                                <span className="font-bold">{events[0].dressCode}</span>
                            </p>
                            <p>Max Volunteers:&nbsp;
                                <span className="font-bold">{events[0].maxVolunteers || 'Unlimited'}</span>
                            </p>
                        </div>

                        <div className="flex gap-2 w-fit">  
                            {renderEnrollmentButton()}
                            <Link href={`/${events[0].id}`} className="w-full group">
                                <Button className="w-40 gap-2 flex items-center px-10 py-5 cursor-pointer bg-black text-white">
                                    View Details
                                    <ArrowRightIcon className="size-4 group-hover:pl-0.3 group-hover:rotate-[-45deg] group-hover:translate-x-1 transition-all duration-300" />
                                </Button>
                            </Link>
                        </div>

                        {/* Event Image */}
                        <Image
                            urlEndpoint={`${config.env.imagekit.urlEndpoint}`}
                            src={events[0].coverUrl || "/events.jpg"}
                            width={1500}
                            height={1500}
                            alt={events[0].title}
                            className="rounded-lg w-full  md:h-[60vh] object-cover"
                            responsive={true}
                            loading="eager"
                        />

                        {/* Event Description */}
                        <p className="text-sm md:text-base line-clamp-3 md:line-clamp-none">{events[0].description}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold">Upcoming Events</h1>
                    <Button className="w-fit px-10 py-5 cursor-pointer bg-black text-white">View All</Button>
                </div>
                <div className="flex gap-5 flex-wrap">
                    {events.slice(1).map((event) => (
                        <div key={event.id} className="flex flex-col gap-1 w-60 border p-2 rounded-lg cursor-pointer backdrop-blur-sm">
                            <Image
                                src={event.coverUrl || "/events.jpg"}
                                alt={event.title}
                                width={1500}
                                height={1500}
                                className="rounded-lg w-full h-70 object-cover"
                            />
                            <div className="mt-1 px-1">
                                <h2 className="text-sm md:text-base font-bold">{event.title}</h2>
                                <p className="text-xs">{event.category.join(", ")}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}