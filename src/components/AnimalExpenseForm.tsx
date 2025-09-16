import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const animalExpenseSchema = z.object({
  category: z.string().min(1, 'La categoría es requerida'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
});

type AnimalExpenseFormData = z.infer<typeof animalExpenseSchema>;

interface AnimalExpenseFormProps {
  animalId: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AnimalExpenseForm: React.FC<AnimalExpenseFormProps> = ({
  animalId,
  onSubmit,
  isLoading = false
}) => {
  const form = useForm<AnimalExpenseFormData>({
    resolver: zodResolver(animalExpenseSchema),
    defaultValues: {
      category: 'purina',
      amount: 90000,
      description: '',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const handleSubmit = (data: AnimalExpenseFormData) => {
    onSubmit({
      animal_id: animalId,
      type: 'gasto',
      category: data.category,
      amount: data.amount,
      description: data.description,
      date: data.date
    });
  };

  const expenseCategories = [
    'purina',
    'medicamentos',
    'vitaminas',
    'vacunas',
    'veterinario',
    'mantenimiento',
    'otros'
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría del Gasto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="90000" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles del gasto..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Registrando...' : 'Registrar Gasto'}
        </Button>
      </form>
    </Form>
  );
};