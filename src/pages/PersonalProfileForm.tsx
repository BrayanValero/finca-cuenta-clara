
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { UserCircle, Camera, Save, Edit3 } from 'lucide-react';


const PersonalProfileForm: React.FC = () => {
  const { user } = useAuth();
  
  const { toast } = useToast();
  const { profile, isLoading, updateProfile } = useProfile(user?.id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: ''
  });

  // Función para obtener la imagen de perfil por defecto basada en el email
  const getDefaultProfileImage = () => {
    if (user?.email === 'brayanvalero0021@gmail.com') {
      return '/lovable-uploads/5cf9d67b-8219-47b2-a86e-c103b6451edb.png';
    } else if (user?.email?.startsWith('cavalero')) {
      return '/lovable-uploads/08d2ed9f-2aeb-48b7-b870-c0b1d566c28d.png';
    }
    return null;
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await updateProfile.mutateAsync({
        id: user.id,
        ...formData
      });
      
      setIsEditing(false);
      toast({
        title: 'Éxito',
        description: 'Perfil actualizado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar el perfil',
        variant: 'destructive',
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && profile) {
      // Reset form data if canceling edit
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl bg-white/95 dark:bg-farm-green/95 border-0 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl animate-scale-in">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-farm-green/20 shadow-lg transition-all duration-300 hover:scale-110 hover:border-farm-green/40">
              <AvatarImage 
                src={getDefaultProfileImage() || undefined} 
                alt="Foto de perfil"
                className="transition-all duration-300 group-hover:brightness-110"
              />
              <AvatarFallback className="bg-farm-lightgreen text-farm-beige text-2xl transition-all duration-300 group-hover:bg-farm-green">
                <UserCircle size={40} />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-farm-green text-farm-beige rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110 hover:bg-farm-darkgreen cursor-pointer">
              <Camera size={16} />
            </div>
          </div>
        </div>
        
        <CardTitle className="text-xl font-bold text-farm-green dark:text-farm-beige transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Información del Perfil
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Label htmlFor="full_name" className="text-farm-darkgreen dark:text-farm-beige font-medium transition-colors duration-200">
              Nombre completo
            </Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="transition-all duration-300 focus:scale-[1.02] disabled:opacity-60 hover:shadow-md"
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Label htmlFor="phone" className="text-farm-darkgreen dark:text-farm-beige font-medium transition-colors duration-200">
              Teléfono
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="transition-all duration-300 focus:scale-[1.02] disabled:opacity-60 hover:shadow-md"
              placeholder="Ingresa tu teléfono"
            />
          </div>

          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Label htmlFor="address" className="text-farm-darkgreen dark:text-farm-beige font-medium transition-colors duration-200">
              Dirección
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="transition-all duration-300 focus:scale-[1.02] disabled:opacity-60 hover:shadow-md"
              placeholder="Ingresa tu dirección"
            />
          </div>

          <div className="flex gap-2 pt-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  className="flex-1 bg-farm-green hover:bg-farm-darkgreen transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
                  disabled={updateProfile.isPending}
                >
                  <Save className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-12" />
                  {updateProfile.isPending ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEditToggle}
                  className="flex-1 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md"
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleEditToggle}
                className="w-full bg-farm-brown hover:bg-farm-lightbrown transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <Edit3 className="mr-2 h-4 w-4 transition-transform duration-200 hover:rotate-12" />
                Editar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalProfileForm;
