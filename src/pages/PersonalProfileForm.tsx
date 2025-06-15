
import React, { useRef, useState } from "react";
import { UserCircle, Edit, Image as ImageIcon, Upload as RemoveIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

const PersonalProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, loading, updateProfile } = useProfile(user?.id);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Estado edicion/campos
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState<string>(profile?.first_name || "");
  const [lastName, setLastName] = useState<string>(profile?.last_name || "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.photo_url || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState<boolean>(false);

  // Sync con cambios de perfil
  React.useEffect(() => {
    setFirstName(profile?.first_name || "");
    setLastName(profile?.last_name || "");
    setPhotoPreview(profile?.photo_url || null);
    setRemovePhoto(false);
  }, [profile]);

  const startEditing = () => setIsEditing(true);
  const stopEditing = () => {
    setIsEditing(false);
    setRemovePhoto(false);
    setPhotoPreview(profile?.photo_url || null);
    setPhotoFile(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setRemovePhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Nombre y apellido no pueden estar vacíos.",
        variant: "destructive",
      });
      return;
    }

    let url: string | null | undefined = profile?.photo_url;

    // Sube la foto al bucket si hay nueva
    if (photoFile && user && !removePhoto) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, photoFile, { upsert: true });
      if (error) {
        toast({
          title: "Error al subir la foto",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      // Obtiene url pública
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      url = urlData.publicUrl;
    } else if (removePhoto) {
      url = null;
      // Opcional: podrías eliminar el archivo del bucket con la API de Supabase aquí
    }

    // Actualiza nombre, apellido y foto
    await updateProfile({ first_name: firstName, last_name: lastName, photo_url: url });

    toast({
      title: "Perfil actualizado",
      description: "Tu perfil ha sido guardado correctamente.",
      variant: "default",
    });
    setIsEditing(false);
    setPhotoFile(null);
    setRemovePhoto(false);
  };

  // Loader
  if (loading && !isEditing) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <span className="text-farm-darkgreen/80 dark:text-farm-beige">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/70 dark:bg-farm-darkgreen/80 rounded-2xl p-6 md:p-8 shadow-xl border border-farm-lightgreen/20 dark:border-farm-green/30 transition-all duration-500 animate-fade-in hover:scale-[1.02]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 animate-fade-in">
        <div className="relative group mb-1">
          <Avatar className="w-36 h-36 mb-0 border-4 border-farm-lightgreen shadow-lg transition-all duration-200 bg-farm-beige dark:bg-farm-darkgreen">
            {photoPreview ? (
              <AvatarImage src={photoPreview} alt={firstName || "Usuario"} className="object-cover" />
            ) : (
              <AvatarFallback>
                <UserCircle size={80} />
              </AvatarFallback>
            )}
          </Avatar>
          {isEditing && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="bg-farm-lightgreen/90 hover:bg-farm-lightgreen text-farm-darkgreen shadow hover:scale-105"
                onClick={() => fileRef.current?.click()}
                aria-label="Cambiar foto"
              >
                <ImageIcon size={22} />
              </Button>
              {photoPreview && (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="shadow hover:scale-105"
                  onClick={handleRemovePhoto}
                  aria-label="Quitar foto"
                >
                  <RemoveIcon size={20} />
                </Button>
              )}
            </div>
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
            <div className="flex gap-2 w-full">
              <Input
                autoFocus
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Nombre"
                className="mt-1"
                maxLength={40}
              />
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Apellido"
                className="mt-1"
                maxLength={40}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" variant="default">Guardar</Button>
              <Button type="button" size="sm" variant="outline" onClick={stopEditing}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="font-bold text-lg md:text-2xl text-farm-darkgreen dark:text-farm-beige transition-all">
              {(profile?.first_name || "") + (profile?.last_name ? ` ${profile.last_name}` : "")}
            </span>
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

