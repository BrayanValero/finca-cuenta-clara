import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Animal } from '@/services/animalService';

const animalSchema = z.object({
  animal_type: z.string().min(1, 'El tipo de animal es requerido'),
  name: z.string().optional(),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  description: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AnimalFormProps {
  onSubmit: (data: AnimalFormData) => void;
  initialData?: Partial<Animal>;
  isLoading?: boolean;
}

const ANIMAL_TYPES = [
  { value: 'vacas', label: 'Vacas 🐄' },
  { value: 'gallinas', label: 'Gallinas 🐔' },
  { value: 'pollitos', label: 'Pollitos 🐤' },
  { value: 'perros', label: 'Perros 🐕' },
  { value: 'piscos', label: 'Piscos 🦃' },
];

const INDIVIDUAL_ANIMAL_TYPES = ['vacas', 'perros', 'piscos'];

export const AnimalForm: React.FC<AnimalFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      animal_type: initialData?.animal_type || '',
      name: initialData?.name || '',
      quantity: initialData?.quantity || 1,
      description: initialData?.description || '',
    },
  });

  const selectedAnimalType = form.watch('animal_type');
  const isIndividualType = INDIVIDUAL_ANIMAL_TYPES.includes(selectedAnimalType);

  const handleSubmit = (data: AnimalFormData) => {
    const submissionData = isIndividualType 
      ? { ...data, quantity: 1 }
      : data;
    onSubmit(submissionData);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="animal_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Animal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de animal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ANIMAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del animal o grupo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isIndividualType && (
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción adicional del animal..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Animal' : 'Agregar Animal'}
        </Button>
      </form>
    </Form>
  );
};