
import React from "react";
import { UserCircle, LogOut, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PersonalProfileForm from "./PersonalProfileForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Personal: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] md:min-h-[600px] p-4 md:p-10 bg-gradient-to-tr from-farm-lightgreen/10 via-farm-lightgreen/20 to-farm-beige/70 dark:bg-gradient-to-br dark:from-farm-darkgreen/70 dark:to-farm-green/40 rounded-3xl shadow-lg transition-all duration-500">
      <div className="flex flex-col gap-2 items-center mb-6">
        <span className="rounded-full bg-farm-green/90 text-farm-beige px-4 py-2 shadow-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-fade-in">
          <Star className="inline-block " size={16} />
          {t('userZone')}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-farm-green dark:text-farm-beige mb-1 text-center drop-shadow">
          {t('personalSection')}
        </h1>
      </div>
      <div className="w-full max-w-lg relative z-10">
        <PersonalProfileForm />
      </div>
      <div className="flex flex-col items-center w-full max-w-lg">
        <Button
          variant="destructive"
          size="lg"
          className="mt-2 mb-3 flex items-center gap-2 shadow-md animate-fade-in"
          onClick={signOut}
        >
          <LogOut className="inline-block" size={22} />
          {t('signOut')}
        </Button>
        <span className="text-sm md:text-base text-farm-darkgreen/80 dark:text-farm-lightgreen/80 mb-2 select-all transition-all">
          {user?.email}
        </span>
        <div className="flex flex-col gap-1 items-center mb-1">
          <p className="text-base md:text-lg text-center text-farm-darkgreen/90 dark:text-farm-lightgreen/80 max-w-lg mb-0 transition-all">
            Aquí podrás gestionar tu información personal, configurar tus preferencias y descubrir futuras funciones relacionadas con tu perfil.
          </p>
        </div>
        <div className="mt-5 text-[13px] italic text-muted-foreground text-center opacity-90">
          Próximamente: edición de preferencias, seguridad y más.
        </div>
      </div>
    </div>
  );
};

export default Personal;
