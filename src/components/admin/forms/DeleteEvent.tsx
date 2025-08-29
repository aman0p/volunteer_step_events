"use client";

import prisma from "@/lib/prisma";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { PiSpinner, PiX } from "react-icons/pi";
import { createPortal } from "react-dom";

interface DeleteEventModalProps {
    eventId: string;
    eventTitle: string;
    open: boolean;
    setOpen: (open: boolean) => void;
}

interface DeleteEventTriggerProps {
    eventId: string;
    eventTitle: string;
}

function DeleteEventModal({ eventId, eventTitle, open, setOpen }: DeleteEventModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleDelete = async () => {
        setLoading(true);

        await prisma.event.delete({
            where: {
                id: eventId,
            },
        });

        setLoading(false);
        setOpen(false);
        router.push("/admin/events");
    }

    const handleCancel = () => {
        setOpen(false);
    }

    return createPortal(
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[1000] backdrop-blur-sm">
            <div className="relative aspect-video flex flex-col max-w-lg w-full mx-4 justify-center gap-8 px-15 py-10 rounded-md bg-white/5 backdrop-blur-md shadow-lg shadow-black/40">
                <PiX
                    className="text-white/80 size-6 p-1 transition-all duration-200 hover:bg-black/25 rounded-full absolute top-3 right-3 cursor-pointer"
                    onClick={() => setOpen(false)}
                />
                <h1 className="text-2xl text-white/80 font-bold text-center">Delete Event</h1>

                <p className="text-center tracking-wide text-white/80 capitalize text-sm md:text-base font-light">
                    Are you sure you want to delete this event?
                    <br />
                    <span className="font-bold">{eventTitle}</span>
                </p>

                <form onSubmit={handleDelete} className="grid grid-cols-2 w-full gap-2">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm md:text-base transition-all duration-300 cursor-pointer rounded-md p-2 flex justify-center items-center"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-red-500 w-full hover:bg-red-500/80 text-white/80 text-sm md:text-base transition-all duration-300 cursor-pointer rounded-md p-2 flex justify-center items-center"
                    >
                        {loading ? <PiSpinner className="animate-spin" /> : "Delete"}
                    </Button>
                </form>
            </div>
        </div>,
        document.body
    );
}

export function DeleteEvent({ eventId, eventTitle }: DeleteEventTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button
                onClick={() => setOpen(true)}
                variant="destructive"
                size="icon"
                className="cursor-pointer hover:bg-red-500 z-5"
            >
                <FaTrash className="w-4 h-4" />
            </Button>
            {open &&
                <DeleteEventModal
                    eventId={eventId}
                    eventTitle={eventTitle}
                    open={open}
                    setOpen={setOpen}
                />}
        </div>
    );
}