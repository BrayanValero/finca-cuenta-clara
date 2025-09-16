import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const eggDebtorSchema = z.object({
  debtor_name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().optional(),
  cartons_owed: z.number().min(0, 'Los cartones deben ser 0 o más'),
  eggs_owed: z.number().min(0, 'Los huevos deben ser 0 o más'),
  price_per_carton: z.number().min(0, 'El precio debe ser mayor a 0'),
  price_per_egg: z.number().min(0, 'El precio debe ser mayor a 0'),
  notes: z.string().optional(),
});

type EggDebtorFormData = z.infer<typeof eggDebtorSchema>;

interface EggDebtorFormProps {
  animalId: string;
  onSubmit: (data: EggDebtorFormData & { animal_id: string }) => void;
  isLoading?: boolean;
  initialData?: Partial<EggDebtorFormData>;
}

export const EggDebtorForm: React.FC<EggDebtorFormProps> = ({
  animalId,
  onSubmit,
  isLoading = false,
  initialData
}) => {
  const form = useForm<EggDebtorFormData>({
    resolver: zodResolver(eggDebtorSchema),
    defaultValues: {
      debtor_name: initialData?.debtor_name || '',
      phone: initialData?.phone || '',
      cartons_owed: initialData?.cartons_owed || 0,
      eggs_owed: initialData?.eggs_owed || 0,
      price_per_carton: initialData?.price_per_carton || 12000,
      price_per_egg: initialData?.price_per_egg || 500,
      notes: initialData?.notes || '',
    }
  });

  const handleSubmit = (data: EggDebtorFormData) => {
    onSubmit({ ...data, animal_id: animalId });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="debtor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Deudor</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Número de teléfono" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cartons_owed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cartones Adeudados</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eggs_owed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huevos Adeudados</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price_per_carton"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por Cartón</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="12000" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price_per_egg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por Huevo</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="500" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Observaciones adicionales..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Guardando...' : 'Guardar Deudor'}
        </Button>
      </form>
    </Form>
  );
};