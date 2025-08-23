import { Header } from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto h-full px-3 py-5">
      {/* <Header session={session} /> */}
      <Header />

      <div className="mt-10">{children}</div>
    </div>
  );
}

export default Layout;