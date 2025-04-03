
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-farm-beige dark:bg-farm-darkgreen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          {children || <Outlet />}
        </main>
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
};

export default AppLayout;
