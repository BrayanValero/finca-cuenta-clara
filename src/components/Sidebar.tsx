
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, PlusCircle, DollarSign, UserCircle, FolderOpen } from 'lucide-react';
import AppLogo from './AppLogo';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 hidden md:flex flex-col h-screen bg-theme-primary text-white dark:bg-theme-primary dark:text-white border-r border-theme-accent/20 dark:border-theme-accent/20">
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
            >
              <DollarSign size={20} className="mr-3" />
              <span>Préstamos</span>
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
            >
              <UserCircle size={20} className="mr-3" />
              <span>Personal</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-theme-accent/20 dark:border-theme-accent/20">
        <button 
          onClick={signOut}
          className="flex items-center p-2 w-full rounded-md transition-colors hover:bg-theme-accent/30"
        >
          <LogOut size={20} className="mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
