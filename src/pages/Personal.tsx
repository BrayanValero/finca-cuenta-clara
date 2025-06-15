
import React from "react";
import { UserCircle } from "lucide-react";

const Personal: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white dark:bg-farm-darkgreen rounded-xl shadow-md">
      <UserCircle size={64} className="text-farm-green dark:text-farm-beige mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-farm-green dark:text-farm-beige">Sección Personal</h1>
      <p className="text-base text-center text-farm-darkgreen/80 dark:text-farm-lightgreen/80 max-w-lg">
        Aquí podrás gestionar tu información personal, configurar tus preferencias y descubrir futuras funciones relacionadas con tu perfil.
      </p>
      <div className="mt-8 text-sm text-muted-foreground">
        Próximamente: edición de perfil, preferencias y mucho más.
      </div>
    </div>
  );
};

export default Personal;
