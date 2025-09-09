import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AnimalTransaction } from '@/services/animalService';

const transactionSchema = z.object({
  type: z.enum(['ingreso', 'gasto'], {
    required_error: 'El tipo de transacción es requerido',
  }),
  category: z.string().min(1, 'La categoría es requerida'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AnimalTransactionFormProps {
  animalId: string;
  onSubmit: (data: TransactionFormData & { animal_id: string }) => void;
  initialData?: Partial<AnimalTransaction>;
  isLoading?: boolean;
}

const INCOME_CATEGORIES = [
  { value: 'venta', label: 'Venta de productos' },
  { value: 'reproduccion', label: 'Reproducción' },
  { value: 'subsidio', label: 'Subsidios' },
  { value: 'servicio', label: 'Servicios' },
  { value: 'otro_ingreso', label: 'Otros ingresos' },
];

const EXPENSE_CATEGORIES = [
  { value: 'alimentacion', label: 'Alimentación' },
  { value: 'medicinas', label: 'Medicinas y vacunas' },
  { value: 'veterinario', label: 'Veterinario' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'compra', label: 'Compra de animales' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'otro_gasto', label: 'Otros gastos' },
];

export const AnimalTransactionForm: React.FC<AnimalTransactionFormProps> = ({
  animalId,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: (initialData?.type as 'ingreso' | 'gasto') || 'gasto',
      category: initialData?.category || '',
      amount: initialData?.amount || 0,
      description: initialData?.description || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
    },
  });

  const transactionType = form.watch('type');
  const categories = transactionType === 'ingreso' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit({ ...data, animal_id: animalId });
    if (!initialData) {
      form.reset({
        type: 'gasto',
        category: '',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Transacción</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ingreso">Ingreso</SelectItem>
                  <SelectItem value="gasto">Gasto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
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
                <Textarea
                  placeholder="Descripción de la transacción..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Transacción' : 'Registrar Transacción'}
        </Button>
      </form>
    </Form>
  );
};