import { Session } from 'next-auth';

const Header = ({ session }: { session: Session }) => {
   return (
      <header className="flex items-center justify-between px-4 py-2 md:px-7 md:py-4 md:pr-13">
         <div className="flex flex-col">
            <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
               {/* Welcome back,  */}
               {session?.user?.name || 'Admin'}
            </h2>
            <p className="text-xs text-slate-500 md:text-sm">
               Monitor your events and volunteers here
            </p>
         </div>

         {/*<p>Search</p>*/}
      </header>
   );
};
export default Header;
