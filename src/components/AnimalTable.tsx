import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Animal } from '@/services/animalService';
import { AnimalForm } from './AnimalForm';
import { useCreateAnimal, useUpdateAnimal, useDeleteAnimal } from '@/hooks/useAnimalMutations';

interface AnimalTableProps {
  animals: Animal[];
  onSelectAnimal: (animal: Animal) => void;
}

export const AnimalTable: React.FC<AnimalTableProps> = ({ animals, onSelectAnimal }) => {
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  const createAnimal = useCreateAnimal();
  const updateAnimal = useUpdateAnimal();
  const deleteAnimal = useDeleteAnimal();

  const handleCreate = (data: any) => {
    createAnimal.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      }
    });
  };

  const handleUpdate = (data: any) => {
    if (editingAnimal) {
      updateAnimal.mutate(
        { id: editingAnimal.id, data },
        {
          onSuccess: () => {
            setIsEditFormOpen(false);
            setEditingAnimal(null);
          }
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteAnimal.mutate(id);
  };

  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setIsEditFormOpen(true);
  };

  const getAnimalIcon = (type: string) => {
    switch (type) {
      case 'vacas': return '🐄';
      case 'gallinas': return '🐔';
      case 'perros': return '🐕';
      case 'pollitos': return '🐣';
      default: return '🐾';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animals.map((animal) => (
          <Card key={animal.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader 
              className="pb-3"
              onClick={() => onSelectAnimal(animal)}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getAnimalIcon(animal.animal_type)}</span>
                  <span className="capitalize">{animal.animal_type}</span>
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {animal.quantity}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div onClick={() => onSelectAnimal(animal)}>
                {animal.name && (
                  <p className="text-sm font-medium mb-1">{animal.name}</p>
                )}
                {animal.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {animal.description}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(animal)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="px-3">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar animal?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará permanentemente este animal y todas sus transacciones asociadas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(animal.id)}>
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {animals.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No tienes animales registrados</p>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar tu primer animal
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Animal</DialogTitle>
          </DialogHeader>
          {editingAnimal && (
            <AnimalForm
              onSubmit={handleUpdate}
              initialData={editingAnimal}
              isLoading={updateAnimal.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};