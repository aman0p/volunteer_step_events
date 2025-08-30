"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface EventRole {
    id: string;
    name: string;
    description: string;
    payout: number;
    maxCount: number;
    enrollments: { id: string }[];
}

interface EventRolesTableProps {
    eventRoles: EventRole[];
    className?: string;
}

export default function EventRolesTable({ eventRoles, className }: EventRolesTableProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (roleId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [roleId]: !prev[roleId]
        }));
    };

    if (!eventRoles || eventRoles.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <p>No volunteer roles defined for this event</p>
            </div>
        );
    }

    return (
        <div className={`w-full overflow-hidden rounded-2xl border border-black/30 ${className || ""}`}>
            <Table>
                <TableHeader>
                    <TableRow className="bg-black/10 border-b border-black/30 hover:bg-black/10">
                        <TableHead className="font-semibold text-black text-center border-b border-black/30 rounded-tl-2xl">Actions</TableHead>
                        <TableHead className="font-semibold text-black text-center border-b border-l border-black/30">Role Name</TableHead>
                        <TableHead className="font-semibold text-black text-center border-b border-l border-black/30">Volunteers</TableHead>
                        <TableHead className="font-semibold text-black text-center border-b border-l border-black/30">Description</TableHead>
                        <TableHead className="font-semibold text-black text-center border-b border-l border-black/30 rounded-tr-2xl">Payout (₹)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {eventRoles.map((role) => (
                        <TableRow key={role.id} className="">
                            <TableCell className="p-4 text-center border border-black/30 rounded-tl-2xl h-24">
                                <button
                                    onClick={() => toggleRow(role.id)}
                                    className="p-2 rounded transition-colors"
                                    title={expandedRows[role.id] ? "Collapse description" : "Expand description"}
                                >
                                    {expandedRows[role.id] ? (
                                        <ChevronDown className="h-4 w-4 text-gray-600" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-gray-600" />
                                    )}
                                </button>
                            </TableCell>
                            <TableCell className="p-4 font-medium border border-black/30 border-l max-w-[12rem] truncate h-24" title={role.name}>
                            <div className="whitespace-normal break-words leading-relaxed">
                                    {expandedRows[role.id] ? (
                                        <div className="whitespace-normal break-words leading-relaxed">
                                            {role.name}
                                        </div>
                                    ) : (
                                        <div className="whitespace-normal break-words leading-relaxed line-clamp-2">
                                            {role.name}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="p-4 text-center border border-black/30 border-l h-24">
                                <span className="font-medium">
                                    {role.enrollments.length || 0}
                                </span>
                                <span className="text-gray-500"> / </span>
                                <span className="text-gray-700">{role.maxCount}</span>
                            </TableCell>
                            <TableCell className="p-4 max-w-[15rem] border border-black/30 border-l h-24">
                                <div className="whitespace-normal break-words leading-relaxed">
                                    {expandedRows[role.id] ? (
                                        <div className="whitespace-normal break-words leading-relaxed">
                                            {role.description}
                                        </div>
                                    ) : (
                                        <div className="whitespace-normal break-words leading-relaxed line-clamp-2">
                                            {role.description}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="p-4 font-mono text-center border border-black/30 border-l rounded-tr-2xl h-24">{role.payout.toLocaleString('en-IN')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
