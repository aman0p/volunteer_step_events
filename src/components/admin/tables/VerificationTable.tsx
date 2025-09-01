"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, GripVertical, Loader2, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image } from "@imagekit/next"
import Link from "next/link"
import config from "@/lib/config"
import { toast } from "sonner"
import { approveVerificationRequest, rejectVerificationRequest } from "@/lib/actions/admin/verification"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createPortal } from "react-dom"
import { PiSpinner, PiX } from "react-icons/pi"

type VerificationRequest = {
  id: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  user: {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    profileImage: string
    createdAt: Date
  }
  submittedAt: Date
  rejectionReason?: string | null
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
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionType, setRejectionType] = useState<"bulk" | "individual" | null>(null)
  const [individualRejectId, setIndividualRejectId] = useState<string | null>(null)

  // Filter to only show pending and rejected requests (exclude approved)
  const filteredRequests = verificationRequests.filter(req => req.status !== "APPROVED")
  const pendingRequests = filteredRequests.filter(req => req.status === "PENDING")
  const paginatedData = filteredRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select pending requests
      setSelectedRows(pendingRequests.map(row => row.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    // Only allow selecting pending requests
    const request = filteredRequests.find(req => req.id === id)
    if (request && request.status !== "PENDING") {
      return
    }
    
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

    setRejectionType("bulk")
    setShowRejectionModal(true)
  }

  const executeBulkReject = async () => {
    setIsBulkRejectProcessing(true)
    try {
      const promises = selectedRows.map(async (id) => {
        const result = await rejectVerificationRequest(id, rejectionReason)
        if (result.success) {
          toast.success(result.message || `Request ${id} rejected`)
        } else {
          toast.error(result.message || `Failed to reject request ${id}`)
        }
      })
      await Promise.all(promises)
      toast.success(`Successfully processed ${selectedRows.length} verification request(s)`)
      setSelectedRows([])
      setRejectionReason("")
      setShowRejectionModal(false)
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

  const handleRejectWithReason = async (id: string) => {
    setRejectionType("individual")
    setIndividualRejectId(id)
    setShowRejectionModal(true)
  }

  const executeIndividualReject = async () => {
    if (!individualRejectId) return
    
    setRejectProcessingIds(prev => [...prev, individualRejectId])
    try {
      const result = await rejectVerificationRequest(individualRejectId, rejectionReason)
      if (result.success) {
        toast.success(result.message || "Verification request rejected successfully")
        setRejectionReason("")
        setShowRejectionModal(false)
        setIndividualRejectId(null)
        window.location.reload()
      } else {
        toast.error(result.message || "Failed to reject verification request")
      }
    } catch (error) {
      console.error("Error rejecting:", error)
      toast.error("An error occurred while rejecting the request")
    } finally {
      setRejectProcessingIds(prev => prev.filter(procId => procId !== individualRejectId))
    }
  }

  const handleCancelRejection = () => {
    setShowRejectionModal(false)
    setRejectionReason("")
    setRejectionType(null)
    setIndividualRejectId(null)
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

  const isAllSelected = selectedRows.length === pendingRequests.length && pendingRequests.length > 0

  return (
    <div className="space-y-4">
      {/* Top buttons */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col md:flex-row items-center gap-2">
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
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="order-last md:order-first text-sm text-muted-foreground">
            {selectedRows.length} of {pendingRequests.length} pending selected
          </span>
          {selectedRows.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])} className="text-xs order-first md:order-last">
              Clear Selection
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-black/10 border-b border-black">
            <TableRow>
              <TableHead className="w-10 min-w-[40px]"></TableHead>
              <TableHead className="w-10 min-w-[40px]">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="w-48 min-w-[192px]">Volunteer Name</TableHead>
              <TableHead className="w-30 min-w-[120px]">Email ID</TableHead>
              <TableHead className="w-30 min-w-[120px]">Phone No</TableHead>
              <TableHead className="w-24 min-w-[96px]">Status</TableHead>
              <TableHead className="w-40 min-w-[160px]">Submitted</TableHead>
              <TableHead className="w-48 min-w-[192px]">Actions</TableHead>
              <TableHead className="w-10 min-w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((request) => (
              <TableRow key={request.id} className="hover:bg-muted/50">
                <TableCell className="w-10 min-w-[40px]">
                  <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                </TableCell>
                <TableCell className="w-10 min-w-[40px]">
                  <Checkbox
                    checked={selectedRows.includes(request.id)}
                    onCheckedChange={(checked) => handleSelectRow(request.id, checked as boolean)}
                    disabled={request.status !== "PENDING"}
                  />
                </TableCell>
                <TableCell className="min-w-[192px]">
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
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{request.user.fullName}</div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm min-w-[120px]">
                  <div className="truncate" title={request.user.email}>
                    {request.user.email}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm min-w-[120px]">
                  <div className="truncate" title={request.user.phoneNumber}>
                    {request.user.phoneNumber}
                  </div>
                </TableCell>
                <TableCell className="min-w-[96px]">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === "PENDING" 
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground min-w-[160px]">{formatDate(request.submittedAt)}</TableCell>
                <TableCell className="min-w-[192px]">
                  {request.status === "PENDING" ? (
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
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                        loading={rejectProcessingIds.includes(request.id)}
                        className="h-8 px-2 text-xs w-20"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">Rejected</span>
                      {request.rejectionReason && (
                        <span className="text-xs text-muted-foreground max-w-32 truncate" title={request.rejectionReason}>
                          Reason: {request.rejectionReason}
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="min-w-[40px]">
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
                      {request.status === "PENDING" && (
                        <DropdownMenuItem onClick={() => handleRejectWithReason(request.id)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject with Reason
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-muted-foreground">
          {selectedRows.length} of {pendingRequests.length} pending selected
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

      {/* Rejection Reason Modal */}
      {showRejectionModal && createPortal(
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] backdrop-blur-sm">
          <div className="relative aspect-video flex flex-col max-w-lg w-full mx-4 justify-center gap-8 px-15 py-10 rounded-md bg-white/5 backdrop-blur-md shadow-lg shadow-black/40">
            <PiX
              className="text-white/80 size-6 p-1 transition-all duration-200 hover:bg-black/25 rounded-full absolute top-3 right-3 cursor-pointer"
              onClick={handleCancelRejection}
            />
            <h1 className="text-2xl text-white/80 font-bold text-center">
              {rejectionType === "bulk" 
                ? `Reject ${selectedRows.length} Verification Request(s)` 
                : "Reject Verification Request"
              }
            </h1>

            <p className="text-center tracking-wide text-white/80 text-sm md:text-base font-light">
              Provide a reason for rejection. The user will be able to see this reason.
            </p>

            <div className="space-y-4 w-full">
              <div>
                <Label htmlFor="rejection-reason" className="text-white/80">Rejection Reason (Optional)</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-2 bg-white/5 border-white/20 text-white/80 placeholder:text-white/60 focus:ring-0 focus:ring-offset-0 focus:outline-none "
                  rows={4}
                />
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              rejectionType === "bulk" ? executeBulkReject() : executeIndividualReject()
            }} className="grid grid-cols-2 w-full gap-2">
              <Button
                onClick={handleCancelRejection}
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm md:text-base transition-all duration-300 cursor-pointer rounded-md p-2 flex justify-center items-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isBulkRejectProcessing || rejectProcessingIds.length > 0}
                className="bg-red-500 w-full hover:bg-red-500/80 text-white/80 text-sm md:text-base transition-all duration-300 cursor-pointer rounded-md p-2 flex justify-center items-center"
              >
                {isBulkRejectProcessing || rejectProcessingIds.length > 0 ? (
                  <PiSpinner className="animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Reject
              </Button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
