
import React from "react";
import { UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAME_BY_EMAIL: { [email: string]: string } = {
  "brayanvalero0021@gmail.com": "Brayan Andres Valero",
  "cavalero_01@hotmail.com": "Carlos Andres Valero",
};

const Personal: React.FC = () => {
  const { user } = useAuth();
  const email = user?.email ?? "";
  // Determina el nombre según el email, o solo muestra el email si no está en el listado
  const fullName = NAME_BY_EMAIL[email] || email || "Usuario";

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white dark:bg-farm-darkgreen rounded-xl shadow-md">
      <UserCircle size={64} className="text-farm-green dark:text-farm-beige mb-4" />
      <h1 className="text-3xl font-bold mb-2 text-farm-green dark:text-farm-beige">Sección Personal</h1>
      <div className="flex flex-col items-center mb-4 mt-4">
        <span className="text-xl font-semibold text-farm-darkgreen dark:text-farm-beige">{fullName}</span>
        {email && <span className="text-base text-farm-darkgreen/70 dark:text-farm-lightgreen/60">{email}</span>}
      </div>
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

