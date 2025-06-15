
import React from "react";
import { UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PersonalProfileForm from "./PersonalProfileForm";
import { Button } from "@/components/ui/button";

const NAME_BY_EMAIL: { [email: string]: string } = {
  "brayanvalero0021@gmail.com": "Brayan Andres Valero",
  "cavalero_01@hotmail.com": "Carlos Andres Valero",
};

const IMAGE_BY_EMAIL: { [email: string]: string } = {
  "brayanvalero0021@gmail.com": "/lovable-uploads/6fc9d8df-4085-4171-9152-431a31a56503.png",
  "cavalero_01@hotmail.com": "/lovable-uploads/c053719c-1105-4150-835f-9af432e8bc3f.png",
};

const Personal: React.FC = () => {
  const { user, signOut } = useAuth();
  const email = user?.email ?? "";
  const fullName = NAME_BY_EMAIL[email] || email || "Usuario";
  const photoUrl = IMAGE_BY_EMAIL[email];

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-white dark:bg-farm-darkgreen rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-farm-green dark:text-farm-beige mb-2">Sección Personal</h1>
      <PersonalProfileForm currentName={fullName} currentPhotoUrl={photoUrl} />

      <Button
        variant="destructive"
        size="lg"
        className="mt-4 mb-2 flex items-center gap-2"
        onClick={signOut}
      >
        <LogOut className="inline-block" size={20} />
        Cerrar sesión
      </Button>

      <div className="flex flex-col items-center mb-4 mt-0">
        {email && (
          <span className="text-base text-farm-darkgreen/80 dark:text-farm-lightgreen/80">
            {email}
          </span>
        )}
      </div>
      <p className="text-base text-center text-farm-darkgreen/80 dark:text-farm-lightgreen/80 max-w-lg mb-2">
        Aquí podrás gestionar tu información personal, configurar tus preferencias y descubrir futuras funciones relacionadas con tu perfil.
      </p>
      <div className="mt-4 text-sm text-muted-foreground">
        Próximamente: edición de perfil, preferencias y mucho más.
      </div>
    </div>
  );
};

export default Personal;
