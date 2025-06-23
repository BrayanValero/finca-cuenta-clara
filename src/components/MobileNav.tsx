
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, Menu, PlusCircle, DollarSign, UserCircle, X } from 'lucide-react';
import AppLogo from './AppLogo';
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
    { path: '/', icon: Home, label: 'Panel' },
    { path: '/transacciones', icon: PlusCircle, label: 'Transacciones' },
    { path: '/prestamos', icon: DollarSign, label: 'Préstamos' },
    { path: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
    { path: '/informes', icon: FileText, label: 'Informes' },
    { path: '/personal', icon: UserCircle, label: 'Personal' },
  ];

  return (
    <div className="md:hidden sticky top-0 z-50 border-b border-theme-accent/20 text-white p-3 bg-theme-primary shadow-lg">
      <div className="flex justify-between items-center">
        <div className="scale-90">
          <AppLogo />
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-white hover:bg-theme-accent/30 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          
          <SheetContent 
            side="left" 
            className="bg-theme-primary text-white border-r border-theme-accent/20 p-0 w-[280px]"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-theme-accent/20 flex justify-between items-center">
                <AppLogo />
                <button 
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-theme-accent/30 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-3">
                  {navigationItems.map((item) => (
                    <li key={item.path}>
                      <Link 
                        to={item.path} 
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                          isActive(item.path) 
                            ? "bg-theme-accent text-white shadow-md" 
                            : "hover:bg-theme-accent/30 hover:translate-x-1"
                        }`} 
                        onClick={() => setOpen(false)}
                      >
                        <item.icon size={22} className="mr-4 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="p-4 border-t border-theme-accent/20">
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center p-3 w-full rounded-lg transition-all duration-200 hover:bg-theme-accent/30 hover:translate-x-1"
                >
                  <LogOut size={22} className="mr-4 flex-shrink-0" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;
