import { notFound } from 'next/navigation';

export default function AdminCatchAll() {
    // This will trigger the not-found.tsx page in the admin directory
    notFound();
}
