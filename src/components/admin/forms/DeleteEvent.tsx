'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaTrash } from 'react-icons/fa';
import { useState } from 'react';
import { PiSpinner, PiX } from 'react-icons/pi';
import { createPortal } from 'react-dom';
import { deleteEvent } from '@/lib/actions/admin/events';
import { toast } from 'sonner';

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

function DeleteEventModal({
   eventId,
   eventTitle,
   open,
   setOpen,
}: DeleteEventModalProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   if (!open) return null;

   const handleDelete = async () => {
      setLoading(true);

      try {
         const result = await deleteEvent(eventId);

         if (result.success) {
            toast.success('Event deleted successfully');
            setOpen(false);
            router.push('/admin/events');
            router.refresh();
         } else {
            toast.error(result.message || 'Failed to delete event');
         }
      } catch (error) {
         console.error('Error deleting event:', error);
         toast.error('An error occurred while deleting the event');
      } finally {
         setLoading(false);
      }
   };

   const handleCancel = () => {
      setOpen(false);
   };

   return createPortal(
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
         <div className="relative mx-4 flex aspect-video w-full max-w-lg flex-col justify-center gap-8 rounded-md bg-white/5 px-15 py-10 shadow-lg shadow-black/40 backdrop-blur-md">
            <PiX
               className="absolute top-3 right-3 size-6 cursor-pointer rounded-full p-1 text-white/80 transition-all duration-200 hover:bg-black/25"
               onClick={() => setOpen(false)}
            />
            <h1 className="text-center text-2xl font-bold text-white/80">
               Delete Event
            </h1>

            <p className="text-center text-sm font-light tracking-wide text-white/80 capitalize md:text-base">
               Are you sure you want to delete this event?
               <br />
               <span className="font-bold">{eventTitle}</span>
            </p>

            <form
               onSubmit={handleDelete}
               className="grid w-full grid-cols-2 gap-2"
            >
               <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex w-full cursor-pointer items-center justify-center rounded-md bg-white/10 p-2 text-sm text-white/80 transition-all duration-300 hover:bg-white/20 hover:text-white md:text-base"
               >
                  Cancel
               </Button>
               <Button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center rounded-md bg-red-500 p-2 text-sm text-white/80 transition-all duration-300 hover:bg-red-500/80 md:text-base"
               >
                  {loading ? <PiSpinner className="animate-spin" /> : 'Delete'}
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
            className="z-5 cursor-pointer hover:bg-red-500"
         >
            <FaTrash className="h-4 w-4" />
         </Button>
         {open && (
            <DeleteEventModal
               eventId={eventId}
               eventTitle={eventTitle}
               open={open}
               setOpen={setOpen}
            />
         )}
      </div>
   );
}
