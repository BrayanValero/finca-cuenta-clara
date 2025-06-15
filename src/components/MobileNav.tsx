import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, Menu, PlusCircle, DollarSign, UserCircle } from 'lucide-react';
import AppLogo from './AppLogo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
const MobileNav: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const {
    signOut
  } = useAuth();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const handleSignOut = () => {
    setOpen(false);
    signOut();
  };
  return <div className="md:hidden border-b border-farm-darkgreen/20 dark:border-farm-lightgreen/20 text-farm-green dark:text-farm-beige p-4 bg-lime-800">
      <div className="flex justify-between items-center">
        <AppLogo />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-farm-green text-farm-beige dark:bg-farm-darkgreen border-r border-farm-darkgreen/20 dark:border-farm-lightgreen/20 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-farm-darkgreen/20 dark:border-farm-lightgreen/20">
                <AppLogo />
              </div>
              
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className={`flex items-center p-2 rounded-md transition-colors ${isActive("/") ? "bg-farm-lightgreen text-white" : "hover:bg-farm-lightgreen/30"}`} onClick={() => setOpen(false)}>
                      <Home size={20} className="mr-3" />
                      <span>Panel</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/transacciones" className={`flex items-center p-2 rounded-md transition-colors ${isActive("/transacciones") ? "bg-farm-lightgreen text-white" : "hover:bg-farm-lightgreen/30"}`} onClick={() => setOpen(false)}>
                      <PlusCircle size={20} className="mr-3" />
                      <span>Transacciones</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/prestamos" className={`flex items-center p-2 rounded-md transition-colors ${isActive("/prestamos") ? "bg-farm-lightgreen text-white" : "hover:bg-farm-lightgreen/30"}`} onClick={() => setOpen(false)}>
                      <DollarSign size={20} className="mr-3" />
                      <span>Préstamos</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/estadisticas" className={`flex items-center p-2 rounded-md transition-colors ${isActive("/estadisticas") ? "bg-farm-lightgreen text-white" : "hover:bg-farm-lightgreen/30"}`} onClick={() => setOpen(false)}>
                      <BarChart3 size={20} className="mr-3" />
                      <span>Estadísticas</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/informes" className={`flex items-center p-2 rounded-md transition-colors ${isActive("/informes") ? "bg-farm-lightgreen text-white" : "hover:bg-farm-lightgreen/30"}`} onClick={() => setOpen(false)}>
                      <FileText size={20} className="mr-3" />
                      <span>Informes</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/personal" className={`flex items-center p-2 rounded-md transition-colors ${isActive("/personal") ? "bg-farm-lightgreen text-white" : "hover:bg-farm-lightgreen/30"}`} onClick={() => setOpen(false)}>
                      <UserCircle size={20} className="mr-3" />
                      <span>Personal</span>
                    </Link>
                  </li>
                </ul>
              </nav>
              
              <div className="p-4 border-t border-farm-darkgreen/20 dark:border-farm-lightgreen/20">
                <button onClick={handleSignOut} className="flex items-center p-2 w-full rounded-md transition-colors hover:bg-farm-lightgreen/30">
                  <LogOut size={20} className="mr-3" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>;
};
export default MobileNav;