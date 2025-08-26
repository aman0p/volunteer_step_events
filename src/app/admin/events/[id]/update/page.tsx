import prisma from "@/lib/prisma";
import EventForm from "@/components/admin/forms/EventForm";
import { notFound } from "next/navigation";
import ThemeBackground from "@/components/ui/theme-background";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });
    if (!event) {
        return notFound();
    }
    return (
        <ThemeBackground className="w-full p-4 md:p-7 md:pr-13" alpha={0.05}>
            <EventForm type="update" {...event} />
        </ThemeBackground>
    );
}