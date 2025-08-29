"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, GripVertical, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image } from "@imagekit/next"
import Link from "next/link"
import config from "@/lib/config"
import { toast } from "sonner"
import { approveEnrollment, rejectEnrollment } from "@/lib/actions/admin/enrollment"

type EventEnrollment = {
  id: string
  event: {
    id: string
    title: string
  }
  user: {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    profileImage: string
  }
  status: string
}

interface EventEnrollmentTableProps {
  enrollments: EventEnrollment[]
}

export default function EventEnrollmentTable({ enrollments }: EventEnrollmentTableProps) {
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [approveProcessingIds, setApproveProcessingIds] = useState<string[]>([])
  const [rejectProcessingIds, setRejectProcessingIds] = useState<string[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isBulkApproveProcessing, setIsBulkApproveProcessing] = useState(false)
  const [isBulkRejectProcessing, setIsBulkRejectProcessing] = useState(false)

  const paginatedData = enrollments.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(enrollments.length / rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all rows across all pages, not just current page
      setSelectedRows(enrollments.map(row => row.id))
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

  const handleApproveAll = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one enrollment")
      return
    }
    
    setIsBulkApproveProcessing(true)
    try {
      const promises = selectedRows.map(async (id) => {
        const result = await approveEnrollment(id)
        if (result.success) {
          toast.success(result.message || `Enrollment ${id} approved`)
        } else {
          toast.error(result.message || `Failed to approve enrollment ${id}`)
        }
      })
      await Promise.all(promises)
      toast.success(`Successfully processed ${selectedRows.length} enrollment(s)`) 
      setSelectedRows([])
      window.location.reload()
    } catch (error) {
      console.error('Error approving all:', error)
      toast.error("An error occurred while approving all selected enrollments")
    } finally {
      setIsBulkApproveProcessing(false)
    }
  }

  const handleRejectAll = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one enrollment")
      return
    }
    
    setIsBulkRejectProcessing(true)
    try {
      const promises = selectedRows.map(async (id) => {
        const result = await rejectEnrollment(id)
        if (result.success) {
          toast.success(result.message || `Enrollment ${id} rejected`)
        } else {
          toast.error(result.message || `Failed to reject enrollment ${id}`)
        }
      })
      await Promise.all(promises)
      toast.success(`Successfully processed ${selectedRows.length} enrollment(s)`) 
      setSelectedRows([])
      window.location.reload()
    } catch (error) {
      console.error('Error rejecting all:', error)
      toast.error("An error occurred while rejecting all selected enrollments")
    } finally {
      setIsBulkRejectProcessing(false)
    }
  }

  const handleApprove = async (id: string) => {
    setApproveProcessingIds(prev => [...prev, id])
    try {
      const result = await approveEnrollment(id)
      if (result.success) {
        toast.success(result.message || "Enrollment approved successfully")
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        toast.error(result.message || "Failed to approve enrollment")
      }
    } catch (error) {
      console.error('Error approving:', error)
      toast.error("An error occurred while approving the enrollment")
    } finally {
      setApproveProcessingIds(prev => prev.filter(procId => procId !== id))
    }
  }

  const handleReject = async (id: string) => {
    setRejectProcessingIds(prev => [...prev, id])
    try {
      const result = await rejectEnrollment(id)
      if (result.success) {
        toast.success(result.message || "Enrollment rejected successfully")
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        toast.error(result.message || "Failed to reject enrollment")
      }
    } catch (error) {
      console.error('Error rejecting:', error)
      toast.error("An error occurred while rejecting the enrollment")
    } finally {
      setRejectProcessingIds(prev => prev.filter(procId => procId !== id))
    }
  }

  const isAllSelected = selectedRows.length === enrollments.length && enrollments.length > 0

  return (
    <div className="space-y-4">
      {/* Top buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleApproveAll}
            disabled={selectedRows.length === 0}
            loading={isBulkApproveProcessing}
            className="h-8 px-2 text-xs w-28"
          >
            Approve All ({selectedRows.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectAll}
            disabled={selectedRows.length === 0}
            loading={isBulkRejectProcessing}
            className="h-8 px-2 text-xs w-28"
          >
            Reject All ({selectedRows.length})
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} of {enrollments.length} selected
          </span>
          {selectedRows.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedRows([])}
              className="text-xs"
            >
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
                         <TableHead className="w-10"></TableHead>
             <TableHead className="w-10">
               <Checkbox 
                 checked={isAllSelected}
                 onCheckedChange={handleSelectAll}
               />
             </TableHead>
            <TableHead>Event Name</TableHead>
            <TableHead>Volunteer Name</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Phone No</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((enrollment) => (
            <TableRow
              key={enrollment.id}
              className="hover:bg-muted/50"
            >
              <TableCell className="w-10">
                <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              </TableCell>
              <TableCell className="w-10">
                <Checkbox
                  checked={selectedRows.includes(enrollment.id)}
                  onCheckedChange={(checked) => handleSelectRow(enrollment.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="group">
                <Link href={`/admin/events/${enrollment.event.id}/details`} className="flex items-center space-x-2 group">
                  <div className="font-medium text-blue-600 hover:text-blue-700">
                    {enrollment.event.title}
                  </div>
                  <ArrowRight className="relative -top-2 -left-1 transition-all duration-150 h-3 w-3 text-blue-600 hover:text-blue-700 rotate-[-45deg] group-hover:-top-2.5 group-hover:-left-0.5" />
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/account-verification/${enrollment.user.id}`} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {enrollment.user.profileImage ? (
                      <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={enrollment.user.profileImage}
                        alt={enrollment.user.fullName}
                        width={60}
                        height={60}
                        className="rounded-full w-8 h-8 aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Link href={`/admin/account-verification/${enrollment.user.id}`} className="text-xs font-medium">
                          {enrollment.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{enrollment.user.fullName}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="font-mono text-sm">{enrollment.user.email}</TableCell>
              <TableCell className="font-mono text-sm">{enrollment.user.phoneNumber}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApprove(enrollment.id)}
                    loading={approveProcessingIds.includes(enrollment.id)}
                    className="h-8 px-2 text-xs w-20"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(enrollment.id)}
                    loading={rejectProcessingIds.includes(enrollment.id)}
                    className="h-8 px-2 text-xs w-20"
                  >
                    Reject
                  </Button>
                </div>
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
                      <Link href={`/${enrollment.event.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Event
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/account-verification/${enrollment.user.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Volunteer Profile
                      </Link>
                    </DropdownMenuItem>
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
          {selectedRows.length} of {enrollments.length} row(s) selected
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
