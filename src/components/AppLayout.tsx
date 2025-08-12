
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
// NUEVO: importar MobileNav
import MobileNav from './MobileNav';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-farm-beige dark:bg-farm-darkgreen">
      <Sidebar />
      {/* NUEVO: barra de navegación móvil solo visible en dispositivos pequeños */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <div className="md:hidden">
          <MobileNav />
        </div>
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

