import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';

// Schema para gallinas (venta de huevos)
const eggSaleSchema = z.object({
  cartons: z.number().min(0, 'Debe ser 0 o mayor'),
  eggs: z.number().min(0, 'Debe ser 0 o mayor').max(29, 'Máximo 29 huevos sueltos'),
  pricePerCarton: z.number().min(0, 'Debe ser mayor a 0'),
  pricePerEgg: z.number().min(0, 'Debe ser mayor a 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
}).refine((data) => data.cartons > 0 || data.eggs > 0, {
  message: 'Debes ingresar al menos un cartón o huevo',
  path: ['cartons'],
});

// Schema para pollitos (venta de pollo por kilo)
const chickenSaleSchema = z.object({
  weight: z.number().min(0.01, 'El peso debe ser mayor a 0'),
  pricePerKilo: z.number().min(0, 'Debe ser mayor a 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
});

type EggSaleFormData = z.infer<typeof eggSaleSchema>;
type ChickenSaleFormData = z.infer<typeof chickenSaleSchema>;

interface AnimalIncomeFormProps {
  animalId: string;
  animalType: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AnimalIncomeForm: React.FC<AnimalIncomeFormProps> = ({
  animalId,
  animalType,
  onSubmit,
  isLoading = false,
}) => {
  const isEggSale = animalType === 'gallinas';

  // Formulario para venta de huevos
  const eggForm = useForm<EggSaleFormData>({
    resolver: zodResolver(eggSaleSchema),
    defaultValues: {
      cartons: 0,
      eggs: 0,
      pricePerCarton: 12000,
      pricePerEgg: 500,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Formulario para venta de pollo
  const chickenForm = useForm<ChickenSaleFormData>({
    resolver: zodResolver(chickenSaleSchema),
    defaultValues: {
      weight: 0,
      pricePerKilo: 13000,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const cartons = eggForm.watch('cartons');
  const eggs = eggForm.watch('eggs');
  const pricePerCarton = eggForm.watch('pricePerCarton');
  const pricePerEgg = eggForm.watch('pricePerEgg');
  const totalEggs = (cartons * 30) + eggs;
  const totalEggSale = (cartons * pricePerCarton) + (eggs * pricePerEgg);

  const weight = chickenForm.watch('weight');
  const pricePerKilo = chickenForm.watch('pricePerKilo');
  const totalChickenSale = weight * pricePerKilo;

  const handleEggSubmit = (data: EggSaleFormData) => {
    const totalAmount = (data.cartons * data.pricePerCarton) + (data.eggs * data.pricePerEgg);
    const totalEggs = (data.cartons * 30) + data.eggs;
    
    let description = `Venta de huevos: `;
    if (data.cartons > 0) {
      description += `${data.cartons} cartón(es)`;
    }
    if (data.eggs > 0) {
      description += `${data.cartons > 0 ? ' y ' : ''}${data.eggs} huevo(s) suelto(s)`;
    }
    description += ` (Total: ${totalEggs} huevos)`;
    if (data.description) {
      description += ` - ${data.description}`;
    }

    onSubmit({
      animal_id: animalId,
      type: 'ingreso',
      category: 'venta_huevos',
      amount: totalAmount,
      description,
      date: data.date,
    });

    eggForm.reset();
  };

  const handleChickenSubmit = (data: ChickenSaleFormData) => {
    const totalAmount = data.weight * data.pricePerKilo;
    
    let description = `Venta de pollo: ${data.weight} kg a $${data.pricePerKilo}/kg`;
    if (data.description) {
      description += ` - ${data.description}`;
    }

    onSubmit({
      animal_id: animalId,
      type: 'ingreso',
      category: 'venta_pollo',
      amount: totalAmount,
      description,
      date: data.date,
    });

    chickenForm.reset();
  };

  if (isEggSale) {
    return (
      <Form {...eggForm}>
        <form onSubmit={eggForm.handleSubmit(handleEggSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={eggForm.control}
              name="cartons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cartones (30 huevos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eggForm.control}
              name="eggs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Huevos Sueltos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="29"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={eggForm.control}
              name="pricePerCarton"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio por Cartón</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="12000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eggForm.control}
              name="pricePerEgg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio por Huevo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="50"
                      placeholder="500"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {(cartons > 0 || eggs > 0) && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total huevos:</span>
                <span className="font-semibold">{totalEggs} huevos</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total venta:</span>
                <span className="text-primary">
                  ${totalEggSale.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          )}

          <FormField
            control={eggForm.control}
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
            control={eggForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas Adicionales (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Cliente, detalles de la venta..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Registrando...' : 'Registrar Venta de Huevos'}
          </Button>
        </form>
      </Form>
    );
  }

  // Formulario para pollitos
  return (
    <Form {...chickenForm}>
      <form onSubmit={chickenForm.handleSubmit(handleChickenSubmit)} className="space-y-4">
        <FormField
          control={chickenForm.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso del Pollo (kg)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={chickenForm.control}
          name="pricePerKilo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio por Kilo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="13000"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {weight > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-lg font-bold">
              <span>Total venta:</span>
              <span className="text-primary">
                ${totalChickenSale.toLocaleString('es-CO')}
              </span>
            </div>
          </div>
        )}

        <FormField
          control={chickenForm.control}
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
          control={chickenForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Adicionales (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cliente, detalles de la venta..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Registrando...' : 'Registrar Venta de Pollo'}
        </Button>
      </form>
    </Form>
  );
};
