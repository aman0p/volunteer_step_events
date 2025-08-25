import { authOptions } from "@/auth";
import { Header } from "@/components/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Providers } from "@/components/Providers";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Providers session={session}>
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto h-full px-3 py-5">
        <Header session={session} />
        <div className="mt-10">{children}</div>
      </div>
    </Providers>
  );
}

export default Layout;