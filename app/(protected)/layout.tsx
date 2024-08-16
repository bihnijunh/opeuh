import React from 'react';
import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial from-sky-400 to-blue-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;