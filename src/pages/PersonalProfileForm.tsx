import React, { useRef, useState } from "react";
import { UserCircle, Edit, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="w-full max-w-sm mx-auto bg-muted/30 rounded-xl p-4 mt-6 mb-4 shadow-inner">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="w-32 h-32 mb-0 border-4 border-farm-lightgreen shadow">
            {photoPreview ? (
              <AvatarImage src={photoPreview} alt={name} className="object-cover" />
            ) : (
              <AvatarFallback>
                <UserCircle size={64} />
              </AvatarFallback>
            )}
          </Avatar>
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 bg-farm-lightgreen/80 hover:bg-farm-lightgreen text-farm-darkgreen"
              onClick={() => fileRef.current?.click()}
              aria-label="Cambiar foto"
            >
              <ImageIcon size={20} />
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
            <span className="font-semibold text-lg text-farm-darkgreen dark:text-farm-beige">{name}</span>
            <Button type="button" onClick={startEditing} size="sm" variant="ghost" className="gap-1 text-farm-green dark:text-farm-beige">
              <Edit size={16} />
              Editar Perfil
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default PersonalProfileForm;
