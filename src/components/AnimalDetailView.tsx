import React, { useState } from 'react';
import { ArrowLeft, Edit, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Animal } from '@/services/animalService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
interface AnimalDetailViewProps {
  animal: Animal;
  onBack: () => void;
  onUpdate: () => void;
}
const AnimalDetailView: React.FC<AnimalDetailViewProps> = ({
  animal,
  onBack,
  onUpdate
}) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: animal.name || '',
    breed: animal.breed || '',
    birth_date: animal.birth_date || '',
    gender: animal.gender || '',
    weight: animal.weight || '',
    observations: animal.observations || ''
  });
  const getImageUrl = () => {
    if (!animal.image_url) return null;
    if (animal.image_url.startsWith('http')) {
      return animal.image_url;
    }
    const {
      data
    } = supabase.storage.from('animal-images').getPublicUrl(animal.image_url);
    return data.publicUrl;
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${animal.id}-${Date.now()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('animal-images').upload(fileName, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;
      const {
        error: updateError
      } = await supabase.from('animals').update({
        image_url: fileName
      }).eq('id', animal.id);
      if (updateError) throw updateError;
      toast({
        title: 'Éxito',
        description: 'Imagen actualizada correctamente'
      });
      onUpdate();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Error al subir la imagen',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        error
      } = await supabase.from('animals').update({
        name: formData.name,
        breed: formData.breed,
        birth_date: formData.birth_date || null,
        gender: formData.gender,
        weight: formData.weight ? parseFloat(formData.weight as string) : null,
        observations: formData.observations
      }).eq('id', animal.id);
      if (error) throw error;
      toast({
        title: 'Éxito',
        description: 'Datos actualizados correctamente'
      });
      setIsEditDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating animal:', error);
      toast({
        title: 'Error',
        description: 'Error al actualizar los datos',
        variant: 'destructive'
      });
    }
  };
  const calculateAge = () => {
    if (!animal.birth_date) return null;
    const birthDate = new Date(animal.birth_date);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    return `${years} ${years === 1 ? 'año' : 'años'}`;
  };
  const imageUrl = getImageUrl();
  return <div className="space-y-6">
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imagen y acciones */}
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
              {imageUrl ? <img src={imageUrl} alt={animal.name || 'Animal'} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-farm-lightgreen to-farm-green flex items-center justify-center">
                  <span className="text-9xl">
                    {animal.animal_type === 'vacas' ? '🐄' : '🐾'}
                  </span>
                </div>}
              <label className="absolute bottom-4 right-4 cursor-pointer">
                <div className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all">
                  <Camera className="h-5 w-5 text-farm-darkgreen" />
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
              </label>
            </div>
            <Button className="w-full" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Datos
            </Button>
          </CardContent>
        </Card>

        {/* Información del animal */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Animal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Nombre</Label>
              <p className="text-lg font-semibold">{animal.name || 'Sin nombre'}</p>
            </div>

            {animal.breed && <div>
                <Label className="text-muted-foreground">Raza</Label>
                <p className="text-lg">{animal.breed}</p>
              </div>}

            {animal.birth_date && <div>
                <Label className="text-muted-foreground">Fecha de Nacimiento</Label>
                <p className="text-lg">
                  {format(new Date(animal.birth_date), 'dd/MM/yyyy', {
                locale: es
              })}
                  {calculateAge() && <span className="text-sm text-muted-foreground ml-2">({calculateAge()})</span>}
                </p>
              </div>}

            {animal.gender && <div>
                <Label className="text-muted-foreground">Sexo</Label>
                <p className="text-lg capitalize">{animal.gender}</p>
              </div>}

            {animal.weight && <div>
                <Label className="text-muted-foreground">Peso</Label>
                <p className="text-lg">{animal.weight} kg</p>
              </div>}

            {animal.observations && <div>
                <Label className="text-muted-foreground">Observaciones</Label>
                <p className="text-sm">{animal.observations}</p>
              </div>}
          </CardContent>
        </Card>
      </div>

      {/* Dialog para editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Datos del Animal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} required />
            </div>

            <div>
              <Label htmlFor="breed">Raza</Label>
              <Input id="breed" value={formData.breed} onChange={e => setFormData({
              ...formData,
              breed: e.target.value
            })} />
            </div>

            <div>
              <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
              <Input id="birth_date" type="date" value={formData.birth_date} onChange={e => setFormData({
              ...formData,
              birth_date: e.target.value
            })} />
            </div>

            <div>
              <Label htmlFor="gender">Sexo</Label>
              <select id="gender" value={formData.gender} onChange={e => setFormData({
              ...formData,
              gender: e.target.value
            })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">Seleccionar...</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>

            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input id="weight" type="number" step="0.01" value={formData.weight} onChange={e => setFormData({
              ...formData,
              weight: e.target.value
            })} />
            </div>

            <div>
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea id="observations" value={formData.observations} onChange={e => setFormData({
              ...formData,
              observations: e.target.value
            })} rows={4} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default AnimalDetailView;