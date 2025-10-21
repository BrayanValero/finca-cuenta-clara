
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, LogOut, PlusCircle, DollarSign, UserCircle, FolderOpen, Beef } from 'lucide-react';
import AppLogo from './AppLogo';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 hidden md:flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg">
      <div className="p-4 border-b border-sidebar-border">
        <AppLogo />
      </div>
      
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Home size={20} className={`transition-transform ${isActive("/") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Panel</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/transacciones"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/transacciones") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <PlusCircle size={20} className={`transition-transform ${isActive("/transacciones") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Transacciones</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/prestamos"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/prestamos") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <DollarSign size={20} className={`transition-transform ${isActive("/prestamos") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Préstamos</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/animales"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/animales") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Beef size={20} className={`transition-transform ${isActive("/animales") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Mis Animales</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/estadisticas"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/estadisticas") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <BarChart3 size={20} className={`transition-transform ${isActive("/estadisticas") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Estadísticas</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/informes"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/informes") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <FileText size={20} className={`transition-transform ${isActive("/informes") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Informes</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/documentacion"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/documentacion") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <FolderOpen size={20} className={`transition-transform ${isActive("/documentacion") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Documentación</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/personal"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive("/personal") 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md" 
                  : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <UserCircle size={20} className={`transition-transform ${isActive("/personal") ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">Personal</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/20">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-all duration-200 hover:bg-destructive/90 hover:text-destructive-foreground group"
        >
          <LogOut size={20} className="transition-transform group-hover:scale-110" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
