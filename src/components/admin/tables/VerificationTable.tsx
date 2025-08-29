"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, GripVertical } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image } from "@imagekit/next"
import Link from "next/link"
import config from "@/lib/config"
import { toast } from "sonner"
import { approveVerificationRequest, rejectVerificationRequest } from "@/lib/actions/admin/verification"

type VerificationRequest = {
  id: string
  user: {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    profileImage: string
    createdAt: Date
  }
  submittedAt: Date
}

interface VerificationTableProps {
  verificationRequests: VerificationRequest[]
}

export default function VerificationTable({ verificationRequests }: VerificationTableProps) {
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [approveProcessingIds, setApproveProcessingIds] = useState<string[]>([])
  const [rejectProcessingIds, setRejectProcessingIds] = useState<string[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [isBulkApproveProcessing, setIsBulkApproveProcessing] = useState(false)
  const [isBulkRejectProcessing, setIsBulkRejectProcessing] = useState(false)

  const paginatedData = verificationRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(verificationRequests.length / rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(verificationRequests.map(row => row.id))
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
      toast.error("Please select at least one verification request")
      return
    }

    setIsBulkApproveProcessing(true)
    try {
      const promises = selectedRows.map(async (id) => {
        const result = await approveVerificationRequest(id)
        if (result.success) {
          toast.success(result.message || `Request ${id} approved`)
        } else {
          toast.error(result.message || `Failed to approve request ${id}`)
        }
      })
      await Promise.all(promises)
      toast.success(`Successfully processed ${selectedRows.length} verification request(s)`)
      setSelectedRows([])
      window.location.reload() // reload once after all are done
    } catch (error) {
      console.error("Error approving all:", error)
      toast.error("An error occurred while approving all selected requests")
    } finally {
      setIsBulkApproveProcessing(false)
    }
  }

  const handleRejectAll = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one verification request")
      return
    }

    setIsBulkRejectProcessing(true)
    try {
      const promises = selectedRows.map(async (id) => {
        const result = await rejectVerificationRequest(id)
        if (result.success) {
          toast.success(result.message || `Request ${id} rejected`)
        } else {
          toast.error(result.message || `Failed to reject request ${id}`)
        }
      })
      await Promise.all(promises)
      toast.success(`Successfully processed ${selectedRows.length} verification request(s)`)
      setSelectedRows([])
      window.location.reload() // reload once after all are done
    } catch (error) {
      console.error("Error rejecting all:", error)
      toast.error("An error occurred while rejecting all selected requests")
    } finally {
      setIsBulkRejectProcessing(false)
    }
  }

  const handleApprove = async (id: string) => {
    setApproveProcessingIds(prev => [...prev, id])
    try {
      const result = await approveVerificationRequest(id)
      if (result.success) {
        toast.success(result.message || "Verification request approved successfully")
        window.location.reload()
      } else {
        toast.error(result.message || "Failed to approve verification request")
      }
    } catch (error) {
      console.error("Error approving:", error)
      toast.error("An error occurred while approving the request")
    } finally {
      setApproveProcessingIds(prev => prev.filter(procId => procId !== id))
    }
  }

  const handleReject = async (id: string) => {
    setRejectProcessingIds(prev => [...prev, id])
    try {
      const result = await rejectVerificationRequest(id)
      if (result.success) {
        toast.success(result.message || "Verification request rejected successfully")
        window.location.reload()
      } else {
        toast.error(result.message || "Failed to reject verification request")
      }
    } catch (error) {
      console.error("Error rejecting:", error)
      toast.error("An error occurred while rejecting the request")
    } finally {
      setRejectProcessingIds(prev => prev.filter(procId => procId !== id))
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const isAllSelected = selectedRows.length === verificationRequests.length && verificationRequests.length > 0

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
            {selectedRows.length} of {verificationRequests.length} selected
          </span>
          {selectedRows.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])} className="text-xs">
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
              <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
            </TableHead>
            <TableHead>Volunteer Name</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Phone No</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((request) => (
            <TableRow key={request.id} className="hover:bg-muted/50">
              <TableCell className="w-10">
                <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
              </TableCell>
              <TableCell className="w-10">
                <Checkbox
                  checked={selectedRows.includes(request.id)}
                  onCheckedChange={(checked) => handleSelectRow(request.id, checked as boolean)}
                />
              </TableCell>
              <TableCell>
                <Link href={`/admin/account-verification/${request.id}`} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {request.user.profileImage ? (
                      <Image
                        urlEndpoint={config.env.imagekit.urlEndpoint}
                        src={request.user.profileImage}
                        alt={request.user.fullName}
                        width={70}
                        height={70}
                        className="rounded-full w-8 h-8 aspect-square object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Link href={`/admin/account-verification/${request.id}`} className="text-xs font-medium">
                          {request.user.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{request.user.fullName}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="font-mono text-sm">{request.user.email}</TableCell>
              <TableCell className="font-mono text-sm">{request.user.phoneNumber}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(request.submittedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApprove(request.id)}
                    loading={approveProcessingIds.includes(request.id)}
                    className="h-8 px-2 text-xs w-20"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    loading={rejectProcessingIds.includes(request.id)}
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
                      <Link href={`/admin/account-verification/${request.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
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
          {selectedRows.length} of {verificationRequests.length} row(s) selected
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
