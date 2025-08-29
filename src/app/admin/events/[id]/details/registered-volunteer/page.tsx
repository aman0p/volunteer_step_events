import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Mail, Phone, MapPin, Calendar, Download, Filter } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Image } from "@imagekit/next";
import config from "@/lib/config";
import EnrollmentActions from "@/components/admin/EnrollmentActions";
import VolunteerSearch from "@/components/admin/VolunteerSearch";

export default async function RegisteredVolunteerPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
    }

    // Check if user has admin role
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
        redirect("/");
    }

    // Fetch event with all enrollments and user details
    const event = await prisma.event.findUnique({
        where: { id: (await params).id },
        include: {
            enrollments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            phoneNumber: true,
                            address: true,
                            skills: true,
                            profileImage: true,
                            gender: true,
                            createdAt: true
                        }
                    }
                },
                orderBy: { enrolledAt: "desc" }
            }
        }
    });

    if (!event) {
        redirect("/admin/events");
    }

    // Owner guard
    const owner = await prisma.event.findUnique({
        where: { id: event.id },
        select: { createdById: true }
    });
    if (!owner || owner.createdById !== session.user.id) {
        redirect("/admin/events");
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
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

    // Group enrollments by status
    const approvedEnrollments = event.enrollments.filter(e => e.status === 'APPROVED');
    const pendingEnrollments = event.enrollments.filter(e => e.status === 'PENDING');
    const rejectedEnrollments = event.enrollments.filter(e => e.status === 'REJECTED');

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/events/${(await params).id}/details`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Event Details
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Registered Volunteers</h1>
                        <p className="text-gray-600">{event.title} - Volunteer Management</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Volunteers</p>
                            <p className="text-2xl font-bold text-green-600">{event.enrollments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Approved</p>
                            <p className="text-2xl font-bold text-blue-600">{approvedEnrollments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingEnrollments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Rejected</p>
                            <p className="text-2xl font-bold text-red-600">{rejectedEnrollments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <VolunteerSearch
                            placeholder="Search volunteers by name, email, or skills..."
                            className="w-full"
                            eventId={(await params).id}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">All Statuses</option>
                            <option value="APPROVED">Approved</option>
                            <option value="PENDING">Pending</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">All Genders</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Volunteers List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">All Volunteers ({event.enrollments.length})</h2>
                </div>

                {event.enrollments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteers yet</h3>
                        <p className="text-gray-500">Volunteers will appear here once they enroll in this event.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {event.enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <Link href={`/admin/volunteer/${enrollment.user.id}`} className="flex items-start gap-4">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        {enrollment.user.profileImage ? (
                                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                                <Image
                                                    urlEndpoint={config.env.imagekit.urlEndpoint}
                                                    src={enrollment.user.profileImage}
                                                    alt={enrollment.user.fullName}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-2xl">{getGenderIcon(enrollment.user.gender)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Volunteer Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {enrollment.user.fullName}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="w-4 h-4" />
                                                        {enrollment.user.email}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        <span className="text-gray-700 select-none">+91</span>
                                                        <span className="text-gray-700">{enrollment.user.phoneNumber}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {enrollment.user.address}
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                {enrollment.user.skills && enrollment.user.skills.length > 0 && (
                                                    <div className="mb-3">
                                                        <p className="text-sm text-gray-500 mb-1">Skills:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {enrollment.user.skills.map((skill, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Additional Info */}
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        Enrolled: {formatDate(enrollment.enrolledAt)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        Member since: {formatDate(enrollment.user.createdAt)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status and Actions */}
                                            <div className="flex flex-col items-end gap-3">
                                                <StatusBadge status={enrollment.status} />

                                                <div className="flex gap-2">
                                                    {enrollment.status === 'PENDING' && (
                                                        <EnrollmentActions
                                                            enrollmentId={enrollment.id}
                                                            userName={enrollment.user.fullName}
                                                            eventId={enrollment.eventId}
                                                        />
                                                    )}
                                                    {/* {enrollment.status === 'APPROVED' && (
                                                            <Button size="sm" variant="outline">
                                                                View Details
                                                            </Button>
                                                        )} */}
                                                    {enrollment.status === 'REJECTED' && (
                                                        <Button size="sm" variant="outline">
                                                            Reconsider
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {event.enrollments.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Showing {event.enrollments.length} of {event.enrollments.length} volunteers
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}