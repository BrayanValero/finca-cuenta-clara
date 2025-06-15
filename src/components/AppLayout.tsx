
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageSelector from './LanguageSelector';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-farm-beige dark:bg-farm-darkgreen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <header className="flex justify-end p-4 flex-shrink-0">
          <LanguageSelector />
        </header>
        <main className="flex-1 w-full min-h-0 min-w-0 overflow-y-auto p-4 md:p-6">
          <div className="max-w-full h-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default AppLayout;

