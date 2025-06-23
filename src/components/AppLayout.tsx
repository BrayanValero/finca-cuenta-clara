
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import LanguageSelector from './LanguageSelector';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import MobileNav from './MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-farm-beige dark:bg-farm-darkgreen overflow-hidden">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {isMobile && <MobileNav />}
        
        <header className="flex justify-end p-2 md:p-4 flex-shrink-0 bg-white/50 dark:bg-farm-green/50 backdrop-blur-sm">
          <LanguageSelector />
        </header>
        
        <main className="flex-1 w-full min-h-0 min-w-0 overflow-y-auto p-2 md:p-4 lg:p-6">
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
