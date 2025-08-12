
import React from "react";
import { UserCircle, LogOut, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PersonalProfileForm from "./PersonalProfileForm";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import NotificationSettings from "@/components/NotificationSettings";
import { Button } from "@/components/ui/button";


const Personal: React.FC = () => {
  const { user, signOut } = useAuth();
  
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] md:min-h-[600px] p-4 md:p-10 bg-gradient-to-tr from-theme-accent/10 via-theme-accent/20 to-theme-background/70 dark:bg-gradient-to-br dark:from-theme-primary/70 dark:to-theme-accent/40 rounded-3xl shadow-lg transition-all duration-500 animate-fade-in" style={{ backgroundColor: 'var(--theme-background)' }}>
      <div className="flex flex-col gap-2 items-center mb-6 animate-scale-in">
        <span className="rounded-full bg-theme-primary text-white px-4 py-2 shadow-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <Star className="inline-block animate-pulse" size={16} />
          Zona de usuario
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-theme-primary dark:text-white mb-1 text-center drop-shadow transition-all duration-300 hover:scale-105">
          Sección Personal
        </h1>
      </div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <div className="transform transition-all duration-500 hover:scale-[1.02]">
          <PersonalProfileForm />
        </div>
        
        <div className="transform transition-all duration-500 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ThemeCustomizer />
        </div>
        
        <div className="transform transition-all duration-500 hover:scale-[1.02] animate-fade-in xl:col-span-1 lg:col-span-2" style={{ animationDelay: '0.4s' }}>
          <NotificationSettings />
        </div>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-lg animate-fade-in mt-6" style={{ animationDelay: '0.3s' }}>
        <Button
          variant="destructive"
          size="lg"
          className="mt-2 mb-3 flex items-center gap-2 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl transform active:scale-95"
          onClick={signOut}
        >
          <LogOut className="inline-block transition-transform duration-200 hover:rotate-6" size={22} />
          Cerrar sesión
        </Button>
        
        <span className="text-sm md:text-base text-theme-primary/80 dark:text-white/80 mb-2 select-all transition-all duration-300 hover:text-theme-primary dark:hover:text-white cursor-pointer">
          {user?.email}
        </span>
        
        <div className="flex flex-col gap-1 items-center mb-1 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-base md:text-lg text-center text-theme-primary/90 dark:text-white/80 max-w-lg mb-0 transition-all duration-300 hover:text-theme-primary dark:hover:text-white">
            Aquí podrás gestionar tu información personal, configurar tus preferencias y descubrir futuras funciones relacionadas con tu perfil.
          </p>
        </div>
        
        <div className="mt-5 text-[13px] italic text-muted-foreground text-center opacity-90 transition-all duration-300 hover:opacity-100 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          Próximamente: edición de preferencias, seguridad y más.
        </div>
      </div>
    </div>
  );
};

export default Personal;
