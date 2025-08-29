"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Check, X, Eye, Loader2, GripVertical } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Image } from "@imagekit/next"
import Link from "next/link"

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
  status: string
  submittedAt: Date
}

interface VerificationTableProps {
  verificationRequests: VerificationRequest[]
}

export default function VerificationTable({ verificationRequests }: VerificationTableProps) {
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [processingIds, setProcessingIds] = useState<string[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const paginatedData = verificationRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const totalPages = Math.ceil(verificationRequests.length / rowsPerPage)

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

  const handleApprove = async (id: string) => {
    setProcessingIds(prev => [...prev, id])
    try {
      // TODO: Implement approve logic
      console.log('Approving:', id)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error approving:', error)
    } finally {
      setProcessingIds(prev => prev.filter(procId => procId !== id))
    }
  }

  const handleReject = async (id: string) => {
    setProcessingIds(prev => [...prev, id])
    try {
      // TODO: Implement reject logic
      console.log('Rejecting:', id)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error rejecting:', error)
    } finally {
      setProcessingIds(prev => prev.filter(procId => procId !== id))
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="secondary" className="bg-green-500/20 text-green-700">Approved</Badge>
      case "REJECTED":
        return <Badge variant="secondary" className="bg-red-500/20 text-red-700">Rejected</Badge>
      case "PENDING":
      default:
        return (
          <div className="flex items-center gap-1">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-500">Pending</span>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Top buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Bulk Approve ({selectedRows.length})
          </Button>
          <Button variant="outline" size="sm">
            Bulk Reject ({selectedRows.length})
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} of {verificationRequests.length} selected
          </span>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-10"></TableHead>
            <TableHead>Volunteer Name</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Phone No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
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
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {request.user.profileImage ? (
                      <Image
                        src={request.user.profileImage}
                        alt={request.user.fullName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {request.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{request.user.fullName}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{request.user.email}</TableCell>
              <TableCell className="font-mono text-sm">{request.user.phoneNumber}</TableCell>
              <TableCell>
                {getStatusBadge(request.status)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(request.submittedAt)}
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
                    <DropdownMenuItem 
                      onClick={() => handleApprove(request.id)}
                      disabled={processingIds.includes(request.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleReject(request.id)}
                      disabled={processingIds.includes(request.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
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
