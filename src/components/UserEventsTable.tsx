"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Calendar, MapPin, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

type EventData = {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  maxVolunteers: number | null
  enrollmentStatus: string
}

interface UserEventsProps {
  events: EventData[]
}

export function UserEventsTable({ events }: UserEventsProps) {
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const paginatedData = events.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(events.length / rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(row => row.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id])
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'NOT_ENROLLED': { label: 'Not Enrolled', className: 'bg-gray-100 text-gray-800' },
      'PENDING': { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      'APPROVED': { label: 'Approved', className: 'bg-green-100 text-green-800' },
      'REJECTED': { label: 'Rejected', className: 'bg-red-100 text-red-800' },
      'WAITLISTED': { label: 'Waitlisted', className: 'bg-orange-100 text-orange-800' },
      'CANCELLED': { label: 'Cancelled', className: 'bg-gray-100 text-gray-600' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['NOT_ENROLLED']
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-4 w-full">
      {/* Top section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} of {events.length} selected
          </span>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox 
                checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Enrollment Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Max Volunteers</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((event) => (
            <TableRow
              key={event.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={(e) => {
                // Don't select row if clicking on the checkbox or links
                if ((e.target as HTMLElement).closest('input, a')) {
                  return
                }
                const isSelected = selectedRows.includes(event.id)
                handleSelectRow(event.id, !isSelected)
              }}
            >
              <TableCell className="w-10">
                <Checkbox
                  checked={selectedRows.includes(event.id)}
                  onCheckedChange={(checked) => handleSelectRow(event.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="group">
                <Link href={`/events/${event.id}`} className="flex items-center space-x-2 group">
                  <div className="font-medium text-blue-600 hover:text-blue-700">
                    {event.title}
                  </div>
                  <ArrowRight className="relative -top-2 -left-1 transition-all duration-150 h-3 w-3 text-blue-600 hover:text-blue-700 rotate-[-45deg] group-hover:-top-2.5 group-hover:-left-0.5" />
                </Link>
              </TableCell>
              <TableCell>
                {getStatusBadge(event.enrollmentStatus)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-mono text-sm">
                    {formatDate(event.startDate)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-mono text-sm">
                    {formatDate(event.endDate)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {event.maxVolunteers ? `${event.maxVolunteers} volunteers` : 'Unlimited'}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/events/${event.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Event Details
                      </Link>
                    </DropdownMenuItem>
                    {event.enrollmentStatus === 'NOT_ENROLLED' && (
                      <DropdownMenuItem asChild>
                        <Link href={`/events/${event.id}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          Enroll Now
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} of {events.length} row(s) selected
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
          <span className="text-sm">Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
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
