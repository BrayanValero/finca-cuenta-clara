import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const animalSaleSchema = z.object({
  cartons: z.number().min(0, 'Los cartones deben ser 0 o más').default(0),
  eggs: z.number().min(0, 'Los huevos deben ser 0 o más').default(0),
  price_per_carton: z.number().min(0, 'El precio debe ser mayor a 0').default(12000),
  price_per_egg: z.number().min(0, 'El precio debe ser mayor a 0').default(500),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
}).refine((data) => data.cartons > 0 || data.eggs > 0, {
  message: "Debe vender al menos 1 cartón o 1 huevo",
});

type AnimalSaleFormData = z.infer<typeof animalSaleSchema>;

interface AnimalSaleFormProps {
  animalId: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AnimalSaleForm: React.FC<AnimalSaleFormProps> = ({
  animalId,
  onSubmit,
  isLoading = false
}) => {
  const form = useForm<AnimalSaleFormData>({
    resolver: zodResolver(animalSaleSchema),
    defaultValues: {
      cartons: 0,
      eggs: 0,
      price_per_carton: 12000,
      price_per_egg: 500,
      description: '',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const handleSubmit = (data: AnimalSaleFormData) => {
    const totalAmount = (data.cartons * data.price_per_carton) + (data.eggs * data.price_per_egg);
    
    let description = '';
    if (data.cartons > 0 && data.eggs > 0) {
      description = `${data.cartons} cartones y ${data.eggs} huevos`;
    } else if (data.cartons > 0) {
      description = `${data.cartons} cartones`;
    } else {
      description = `${data.eggs} huevos`;
    }
    
    if (data.description) {
      description += ` - ${data.description}`;
    }

    onSubmit({
      animal_id: animalId,
      type: 'ingreso',
      category: 'venta de huevos',
      amount: totalAmount,
      description,
      date: data.date
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cartons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cartones Vendidos</FormLabel>
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
            name="eggs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huevos Vendidos</FormLabel>
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
              <FormLabel>Descripción Adicional (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Observaciones..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="bg-muted p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">Total de la venta:</div>
          <div className="text-lg font-bold">
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(
              (form.watch('cartons') * form.watch('price_per_carton')) + 
              (form.watch('eggs') * form.watch('price_per_egg'))
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Registrando...' : 'Registrar Venta'}
        </Button>
      </form>
    </Form>
  );
};