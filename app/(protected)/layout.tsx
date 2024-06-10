import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 justify-start bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Navbar />
      <div className="pt-4 mt-4"> {/* or use mt-4 for margin */}
        {children}
      </div>
    </div>
   );
}
 
export default ProtectedLayout;