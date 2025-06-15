
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import LanguageSelector from './LanguageSelector';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-farm-beige dark:bg-farm-darkgreen overflow-hidden">
      {/* Sidebar solo visible en escritorio */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Menú móvil solo visible en móviles */}
        <div className="block md:hidden">
          <MobileNav />
        </div>
        {/* Header fijo para selector de idioma, paddings adecuados */}
        <header className="flex justify-end p-2 md:p-4 flex-shrink-0">
          <LanguageSelector />
        </header>
        {/* Contenido responsive */}
        <main className="flex-1 overflow-y-auto p-2 md:p-6 min-h-0">
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

