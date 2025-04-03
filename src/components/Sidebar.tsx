
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, PlusCircle } from 'lucide-react';
import AppLogo from './AppLogo';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 hidden md:flex flex-col h-screen bg-farm-green text-farm-beige dark:bg-farm-darkgreen dark:text-farm-beige border-r border-farm-darkgreen/20 dark:border-farm-lightgreen/20">
      <div className="p-4 border-b border-farm-darkgreen/20 dark:border-farm-lightgreen/20">
        <AppLogo />
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/"
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive("/") 
                  ? "bg-farm-lightgreen text-white" 
                  : "hover:bg-farm-lightgreen/30"
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
                  ? "bg-farm-lightgreen text-white" 
                  : "hover:bg-farm-lightgreen/30"
              }`}
            >
              <PlusCircle size={20} className="mr-3" />
              <span>Transacciones</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/estadisticas"
              className={`flex items-center p-2 rounded-md transition-colors ${
                isActive("/estadisticas") 
                  ? "bg-farm-lightgreen text-white" 
                  : "hover:bg-farm-lightgreen/30"
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
                  ? "bg-farm-lightgreen text-white" 
                  : "hover:bg-farm-lightgreen/30"
              }`}
            >
              <FileText size={20} className="mr-3" />
              <span>Informes</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-farm-darkgreen/20 dark:border-farm-lightgreen/20">
        <button 
          onClick={signOut}
          className="flex items-center p-2 w-full rounded-md transition-colors hover:bg-farm-lightgreen/30"
        >
          <LogOut size={20} className="mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
