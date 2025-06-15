
import React, { useRef, useState } from "react";
import { UserCircle, Edit, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Este componente ahora se ve mejor gracias al card visual mejorado
interface Props {
  currentName: string;
  currentPhotoUrl?: string;
}

const PersonalProfileForm: React.FC<Props> = ({ currentName, currentPhotoUrl }) => {
  const [name, setName] = useState(currentName);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(currentPhotoUrl);
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Handle local file selection and preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = () => setIsEditing(true);
  const stopEditing = () => setIsEditing(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sólo actualiza en estado local (sin persistencia)
    stopEditing();
  };

  return (
    <div className="w-full bg-white/70 dark:bg-farm-darkgreen/80 rounded-2xl p-6 md:p-8 shadow-xl border border-farm-lightgreen/20 dark:border-farm-green/30 transition-all duration-500 animate-fade-in hover:scale-[1.02]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 animate-fade-in">
        <div className="relative group mb-1">
          <Avatar className="w-36 h-36 mb-0 border-4 border-farm-lightgreen shadow-lg transition-all duration-200 bg-farm-beige dark:bg-farm-darkgreen">
            {photoPreview ? (
              <AvatarImage src={photoPreview} alt={name} className="object-cover" />
            ) : (
              <AvatarFallback>
                <UserCircle size={80} />
              </AvatarFallback>
            )}
          </Avatar>
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 bg-farm-lightgreen/90 hover:bg-farm-lightgreen text-farm-darkgreen shadow hover:scale-105"
              onClick={() => fileRef.current?.click()}
              aria-label="Cambiar foto"
            >
              <ImageIcon size={22} />
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        {isEditing ? (
          <>
            <Input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1"
              maxLength={40}
            />
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" variant="default">Guardar</Button>
              <Button type="button" size="sm" variant="outline" onClick={stopEditing}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="font-bold text-lg md:text-2xl text-farm-darkgreen dark:text-farm-beige transition-all">{name}</span>
            <Button type="button" onClick={startEditing} size="sm" variant="ghost" className="gap-1 text-farm-green dark:text-farm-beige">
              <Edit size={18} />
              Editar Perfil
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default PersonalProfileForm;
