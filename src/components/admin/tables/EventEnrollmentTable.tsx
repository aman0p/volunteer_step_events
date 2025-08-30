"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image } from "@imagekit/next"
import Link from "next/link"
import config from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Mail, Phone, Calendar, MapPin, User } from "lucide-react"

type Enrollment = {
  id: string
  status: string
  enrolledAt: Date
  cancelledAt: Date | null
  cancellationCount: number
  payoutAmount: number | null
  user: {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    profileImage: string | null
    gender: string
    skills: string[]
  }
  eventRole?: {
    id: string
    name: string
    description: string
    payout: number
  } | null
}

interface EventEnrollmentTableProps {
  enrollments: Enrollment[]
  eventTitle: string
  eventLocation: string
  eventStartDate: Date
  eventEndDate: Date
  currentUserRole: "ADMIN" | "ORGANIZER"
}

export default function EventEnrollmentTable({ 
  enrollments, 
  eventTitle, 
  eventLocation, 
  eventStartDate, 
  eventEndDate,
  currentUserRole 
}: EventEnrollmentTableProps) {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const formatEnrollmentDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'REJECTED':
        return 'destructive'
      case 'WAITLISTED':
        return 'outline'
      case 'CANCELLED':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Approved'
      case 'PENDING':
        return 'Pending'
      case 'REJECTED':
        return 'Rejected'
      case 'WAITLISTED':
        return 'Waitlisted'
      case 'CANCELLED':
        return 'Cancelled'
      default:
        return status
    }
  }

  // Filter enrollments based on status
  const filteredEnrollments = enrollments.filter(enrollment => {
    if (statusFilter === "ALL") return true
    return enrollment.status === statusFilter
  })

  const paginatedData = filteredEnrollments.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(filteredEnrollments.length / rowsPerPage)

  const statusCounts = {
    ALL: enrollments.length,
    APPROVED: enrollments.filter(e => e.status === 'APPROVED').length,
    PENDING: enrollments.filter(e => e.status === 'PENDING').length,
    REJECTED: enrollments.filter(e => e.status === 'REJECTED').length,
    WAITLISTED: enrollments.filter(e => e.status === 'WAITLISTED').length,
    CANCELLED: enrollments.filter(e => e.status === 'CANCELLED').length,
  }

  return (
    <div className="relative space-y-4">
      {/* Event Info Header */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">{eventTitle}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(eventStartDate)} - {formatDate(eventEndDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{eventLocation}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{enrollments.length}</div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
        </div>
      </div>

      {/* Status Filter and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All ({statusCounts.ALL})</SelectItem>
              <SelectItem value="APPROVED">Approved ({statusCounts.APPROVED})</SelectItem>
              <SelectItem value="PENDING">Pending ({statusCounts.PENDING})</SelectItem>
              <SelectItem value="REJECTED">Rejected ({statusCounts.REJECTED})</SelectItem>
              <SelectItem value="WAITLISTED">Waitlisted ({statusCounts.WAITLISTED})</SelectItem>
              <SelectItem value="CANCELLED">Cancelled ({statusCounts.CANCELLED})</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Showing {paginatedData.length} of {filteredEnrollments.length} enrollments
          </span>
        </div>
      </div>

      {/* Table */}
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead className="w-40">Volunteer</TableHead>
            <TableHead className="w-48">Contact Info</TableHead>
            <TableHead className="w-32">Role & Skills</TableHead>
            <TableHead className="w-32">Enrollment Details</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((enrollment) => (
            <TableRow key={enrollment.id} className="hover:bg-muted/50">
              <TableCell className="w-8">
                <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              </TableCell>
              <TableCell className="w-48">
                <Link href={`/admin/volunteer/${enrollment.user.id}`} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {enrollment.user.profileImage ? (
                      <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={enrollment.user.profileImage}
                        alt={enrollment.user.fullName}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {enrollment.user.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{enrollment.user.fullName}</div>
                    <div className="text-sm text-muted-foreground capitalize">{enrollment.user.gender?.toLowerCase() || 'Not specified'}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="w-40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-sm">{enrollment.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-sm">{enrollment.user.phoneNumber}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-32">
                <div className="space-y-2">
                  {enrollment.eventRole && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm font-medium">{enrollment.eventRole.name}</span>
                    </div>
                  )}
                  {enrollment.user.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {enrollment.user.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {enrollment.user.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{enrollment.user.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-32">
                <div className="space-y-1 text-sm">
                  <div className="text-muted-foreground">
                    Enrolled: {formatEnrollmentDate(enrollment.enrolledAt)}
                  </div>
                  {enrollment.cancelledAt && (
                    <div className="text-red-600">
                      Cancelled: {formatEnrollmentDate(enrollment.cancelledAt)}
                    </div>
                  )}
                  {enrollment.cancellationCount > 0 && (
                    <div className="text-orange-600">
                      Cancellations: {enrollment.cancellationCount}
                    </div>
                  )}
                  {enrollment.payoutAmount && (
                    <div className="font-medium text-green-600">
                      ₹{enrollment.payoutAmount.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-24">
                <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                  {getStatusDisplayName(enrollment.status)}
                </Badge>
              </TableCell>
              <TableCell className="w-24">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                  {enrollment.status === 'PENDING' && (
                    <Button variant="default" size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedData.length} of {filteredEnrollments.length} enrollments
        </p>
        <div className="flex items-center gap-2">
          <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(parseInt(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1}>
              «
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              ›
            </Button>
            <Button
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
  )
}
