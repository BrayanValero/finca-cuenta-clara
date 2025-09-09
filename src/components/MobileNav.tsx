
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, Menu, PlusCircle, DollarSign, UserCircle, FolderOpen, Beef } from 'lucide-react';
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

  return (
    <div className="md:hidden border-b border-theme-accent/20 dark:border-theme-accent/20 text-white dark:text-white p-4 bg-theme-primary">
      <div className="flex justify-between items-center">
        <AppLogo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-white">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-theme-primary text-white dark:bg-theme-primary border-r border-theme-accent/20 dark:border-theme-accent/20 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-theme-accent/20 dark:border-theme-accent/20">
                <AppLogo />
              </div>
              
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <Home size={20} className="mr-3" />
                      <span>Panel</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/transacciones" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/transacciones") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <PlusCircle size={20} className="mr-3" />
                      <span>Transacciones</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/prestamos" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/prestamos") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <DollarSign size={20} className="mr-3" />
                      <span>Préstamos</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/animales" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/animales") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <Beef size={20} className="mr-3" />
                      <span>Mis Animales</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/estadisticas" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/estadisticas") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <BarChart3 size={20} className="mr-3" />
                      <span>Estadísticas</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/informes" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/informes") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <FileText size={20} className="mr-3" />
                      <span>Informes</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/documentacion" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/documentacion") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <FolderOpen size={20} className="mr-3" />
                      <span>Documentación</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/personal" 
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive("/personal") 
                          ? "bg-theme-accent text-white" 
                          : "hover:bg-theme-accent/30"
                      }`} 
                      onClick={() => setOpen(false)}
                    >
                      <UserCircle size={20} className="mr-3" />
                      <span>Personal</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              
              <div className="p-4 border-t border-theme-accent/20 dark:border-theme-accent/20">
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center p-2 w-full rounded-md transition-colors hover:bg-theme-accent/30"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Cerrar Sesión</span>
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
