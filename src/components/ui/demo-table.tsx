"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Section = {
  id: string
  header: string
  sectionType: string
  status: "done" | "inprocess"
  target: number
  limit: number
  reviewer?: string
}

const sections: Section[] = [
  { id: "1", header: "Cover page", sectionType: "Cover page", status: "inprocess", target: 18, limit: 5, reviewer: "Eddie Lake" },
  { id: "2", header: "Table of contents", sectionType: "Table of contents", status: "done", target: 29, limit: 24, reviewer: "Eddie Lake" },
  { id: "3", header: "Executive summary", sectionType: "Narrative", status: "done", target: 10, limit: 13, reviewer: "Eddie Lake" },
  { id: "4", header: "Technical approach", sectionType: "Narrative", status: "done", target: 27, limit: 23, reviewer: "Jamik Tashpulatov" },
  { id: "5", header: "Design", sectionType: "Narrative", status: "inprocess", target: 2, limit: 16, reviewer: "Jamik Tashpulatov" },
  { id: "6", header: "Capabilities", sectionType: "Narrative", status: "inprocess", target: 20, limit: 8, reviewer: "Jamik Tashpulatov" },
  { id: "7", header: "Integration with existing systems", sectionType: "Narrative", status: "inprocess", target: 19, limit: 21, reviewer: "Jamik Tashpulatov" },
  { id: "8", header: "Innovation and Advantages", sectionType: "Narrative", status: "done", target: 25, limit: 26 },
  { id: "9", header: "Overview of EMR's Innovative Solutions", sectionType: "Technical content", status: "done", target: 7, limit: 23 },
  { id: "10", header: "Advanced Algorithms and Machine Learning", sectionType: "Narrative", status: "done", target: 30, limit: 28 },
]

export default function DemoTable() {
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const paginatedData = sections.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs defaultValue="outline" className="w-full">
        <TabsList>
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="performance">Past Performance <Badge className="ml-2">3</Badge></TabsTrigger>
          <TabsTrigger value="personnel">Key Personnel <Badge className="ml-2">2</Badge></TabsTrigger>
          <TabsTrigger value="docs">Focus Documents</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Top buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Customize Columns</Button>
        <Button>+ Add Section</Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Header</TableHead>
            <TableHead>Section Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{row.header}</TableCell>
              <TableCell>{row.sectionType}</TableCell>
              <TableCell>
                {row.status === "done" ? (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700">Done</Badge>
                ) : (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">In Process</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{row.target}</TableCell>
              <TableCell>{row.limit}</TableCell>
              <TableCell>
                {row.reviewer ? (
                  row.reviewer
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">Assign reviewer</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Eddie Lake</DropdownMenuItem>
                      <DropdownMenuItem>Jamik Tashpulatov</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
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
          0 of 68 row(s) selected
        </p>
        <div className="flex items-center gap-2">
          <Select defaultValue="10">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">Page {page} of 7</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(7, p + 1))}>›</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
