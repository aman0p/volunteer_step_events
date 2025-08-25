import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  return (
    <header className="flex justify-between items-center">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">
        {/* Welcome back,  */}
        {session?.user?.name || "Admin"}
        </h2>
        <p className="text-sm text-slate-500">
          Monitor your events and volunteers here
        </p>
      </div>

      {/*<p>Search</p>*/}
    </header>
  );
};
export default Header;
