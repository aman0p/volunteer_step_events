import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
    return (
        <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">All Books</h2>
          <Button variant="default" asChild>
            <Link href="/admin/events/new" className="text-white add-new-book_btn">
              + Create a New Event
            </Link>
          </Button>
        </div>
  
        <div className="mt-7 w-full overflow-hidden">
          <p>Table</p>
        </div>
      </section>
    );
}