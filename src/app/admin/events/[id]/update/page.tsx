import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import EventForm from "@/components/admin/forms/EventForm";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/sign-in");

    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: {
            id,
        },
        include: {
            eventRoles: true,
        },
    });
    if (!event) {
        return notFound();
    }



    // Owner guard
    const owner = await prisma.event.findUnique({
        where: { id },
        select: { createdById: true },
    });
    if (!owner || owner.createdById !== session!.user.id) {
        redirect("/admin/events");
    }
    return (
        <div className="w-full p-4 md:p-7 md:pr-13">
            <EventForm type="update" {...event} />
        </div>
    );
}