import React, { useRef, useState } from "react";
import { UserCircle, Edit, Image as ImageIcon, Upload as RemoveIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

// Helpers para localStorage
const STORAGE_KEY = "personal_profile_fallback";
function saveProfileFallback(data: { firstName: string; lastName: string; photoDataUrl: string | null }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}
function getProfileFallback() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function clearProfileFallback() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

// Función para obtener la foto predeterminada según el email
function getDefaultPhotoByEmail(email: string | undefined): string | null {
  if (!email) return null;
  
  if (email === "brayanvalero0021@gmail.com") {
    return "/lovable-uploads/5cf9d67b-8219-47b2-a86e-c103b6451edb.png";
  } else if (email.startsWith("cavalero")) {
    return "/lovable-uploads/08d2ed9f-2aeb-48b7-b870-c0b1d566c28d.png";
  }
  
  return null;
}

const PersonalProfileForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { profile, loading, updateProfile } = useProfile(user?.id);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Estado edicion/campos
  const [isEditing, setIsEditing] = useState(false);
  // fallbackData = { firstName, lastName, photoDataUrl }
  const fallbackData = getProfileFallback();

  const [firstName, setFirstName] = useState<string>(profile?.first_name || fallbackData?.firstName || "");
  const [lastName, setLastName] = useState<string>(profile?.last_name || fallbackData?.lastName || "");
  
  // Obtener foto predeterminada si no hay foto de perfil
  const defaultPhoto = getDefaultPhotoByEmail(user?.email);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    profile?.photo_url || fallbackData?.photoDataUrl || defaultPhoto
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState<boolean>(false);

  // Sync con cambios de perfil de Supabase
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile?.first_name || "");
      setLastName(profile?.last_name || "");
      setPhotoPreview(profile?.photo_url || defaultPhoto);
      setRemovePhoto(false);
      clearProfileFallback();
    }
  }, [profile, defaultPhoto]);

  const startEditing = () => setIsEditing(true);
  const stopEditing = () => {
    setIsEditing(false);
    setRemovePhoto(false);
    setPhotoPreview(profile?.photo_url || fallbackData?.photoDataUrl || defaultPhoto);
    setPhotoFile(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Leer el archivo como DataURL para fallback local
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setRemovePhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setRemovePhoto(true);
    setPhotoPreview(defaultPhoto);
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

    try {
      // Sube la foto al bucket si hay nueva
      if (photoFile && user && !removePhoto) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(fileName, photoFile, { upsert: true });
        if (error) throw error;

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
      clearProfileFallback();
    } catch (error: any) {
      // Si falla el guardado remoto, guardar datos localmente como fallback visual (incluye imagen como DataURL)
      saveProfileFallback({
        firstName: firstName,
        lastName: lastName,
        photoDataUrl: photoPreview,
      });
      toast({
        title: "Sin conexión con el servidor",
        description:
          "Tus datos han sido guardados localmente. Cuando vuelva la conexión, intenta guardar de nuevo.",
        variant: "default",
      });
      setIsEditing(false);
      setPhotoFile(null);
      setRemovePhoto(false);
    }
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
              {(photoPreview && photoPreview !== defaultPhoto) && (
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
                placeholder={t('name')}
                className="mt-1"
                maxLength={40}
              />
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder={t('lastName')}
                className="mt-1"
                maxLength={40}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" variant="default">{t('save')}</Button>
              <Button type="button" size="sm" variant="outline" onClick={stopEditing}>
                {t('cancel')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="font-bold text-lg md:text-2xl text-farm-darkgreen dark:text-farm-beige transition-all">
              {firstName + (lastName ? ` ${lastName}` : "")}
            </span>
            <Button type="button" onClick={startEditing} size="sm" variant="ghost" className="gap-1 text-farm-green dark:text-farm-beige">
              <Edit size={18} />
              {t('editProfile')}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default PersonalProfileForm;
