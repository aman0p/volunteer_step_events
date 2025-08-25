import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    // Check if user is already authenticated
    const session = await getServerSession(authOptions);
    
    // If user is already signed in, redirect to home page
    if (session) {
        redirect("/");
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            {children}
        </div>
    )
}