
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, Menu, PlusCircle, DollarSign, UserCircle, X } from 'lucide-react';
import AppLogo from './AppLogo';
import LanguageSelector from './LanguageSelector';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    setOpen(false);
    signOut();
  };

  const navigationItems = [
    { path: '/', label: 'Panel', icon: Home },
    { path: '/transacciones', label: 'Transacciones', icon: PlusCircle },
    { path: '/prestamos', label: 'Préstamos', icon: DollarSign },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { path: '/informes', label: 'Informes', icon: FileText },
    { path: '/personal', label: 'Personal', icon: UserCircle },
  ];

  return (
    <div className="md:hidden">
      {/* Top Mobile Header */}
      <div className="flex items-center justify-between p-3 bg-theme-primary text-white border-b border-theme-accent/20">
        <AppLogo />
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-white hover:bg-theme-accent/30 rounded-md transition-colors">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-theme-primary text-white border-r border-theme-accent/20 p-0 w-72">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-theme-accent/20">
                  <AppLogo />
                  <button 
                    onClick={() => setOpen(false)}
                    className="p-1 text-white hover:bg-theme-accent/30 rounded-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Navigation Menu */}
                <nav className="flex-1 p-4">
                  <ul className="space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.path}>
                          <Link 
                            to={item.path}
                            className={`flex items-center p-3 rounded-lg transition-colors text-base font-medium ${
                              isActive(item.path) 
                                ? "bg-theme-accent text-white shadow-sm" 
                                : "hover:bg-theme-accent/30 text-white/90"
                            }`} 
                            onClick={() => setOpen(false)}
                          >
                            <Icon size={22} className="mr-3 flex-shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                
                {/* Footer */}
                <div className="p-4 border-t border-theme-accent/20">
                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center p-3 w-full rounded-lg transition-colors hover:bg-theme-accent/30 text-base font-medium"
                  >
                    <LogOut size={22} className="mr-3 flex-shrink-0" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
