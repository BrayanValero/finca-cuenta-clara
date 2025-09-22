import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useClients } from '@/hooks/useClients';

const animalSaleSchema = z.object({
  cartons: z.number().min(0, 'Los cartones deben ser 0 o más').default(0),
  eggs: z.number().min(0, 'Los huevos deben ser 0 o más').default(0),
  price_per_carton: z.number().min(0, 'El precio debe ser mayor a 0').default(12000),
  price_per_egg: z.number().min(0, 'El precio debe ser mayor a 0').default(500),
  kilos: z.number().min(0, 'Los kilos deben ser 0 o más').default(3),
  price_per_kilo: z.number().min(0, 'El precio debe ser mayor a 0').default(13000),
  payment_type: z.enum(['contado', 'credito'], { required_error: 'Seleccione tipo de pago' }),
  client_id: z.string().optional(),
  customer_name: z.string().optional(),
  customer_phone: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
  animal_type: z.string(),
}).refine((data) => {
  if (data.animal_type === 'pollitos') {
    return data.kilos > 0;
  } else {
    return data.cartons > 0 || data.eggs > 0;
  }
}, {
  message: "Debe especificar cantidad a vender",
}).refine((data) => {
  if (data.payment_type === 'credito') {
    return (data.client_id && data.client_id !== 'new-client') || data.customer_name;
  }
  return true;
}, {
  message: "Para ventas a crédito debe seleccionar un cliente existente o ingresar el nombre",
  path: ['customer_name']
});

type AnimalSaleFormData = z.infer<typeof animalSaleSchema>;

interface AnimalSaleFormProps {
  animalId: string;
  animalType: string;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const AnimalSaleForm: React.FC<AnimalSaleFormProps> = ({
  animalId,
  animalType,
  onSubmit,
  isLoading = false
}) => {
  const { data: clients = [] } = useClients();
  const form = useForm<AnimalSaleFormData>({
    resolver: zodResolver(animalSaleSchema),
    defaultValues: {
      cartons: 0,
      eggs: 0,
      price_per_carton: 12000,
      price_per_egg: 500,
      kilos: 3,
      price_per_kilo: 13000,
      payment_type: 'contado' as const,
      client_id: '',
      customer_name: '',
      customer_phone: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      animal_type: animalType,
    }
  });

  const handleSubmit = (data: AnimalSaleFormData) => {
    let totalAmount = 0;
    let description = '';
    let category = '';

    if (data.animal_type === 'pollitos') {
      totalAmount = data.kilos * data.price_per_kilo;
      description = `${data.kilos} kilos de pollo`;
      category = 'venta de pollo';
    } else {
      totalAmount = (data.cartons * data.price_per_carton) + (data.eggs * data.price_per_egg);
      if (data.cartons > 0 && data.eggs > 0) {
        description = `${data.cartons} cartones y ${data.eggs} huevos`;
      } else if (data.cartons > 0) {
        description = `${data.cartons} cartones`;
      } else {
        description = `${data.eggs} huevos`;
      }
      category = 'venta de huevos';
    }
    
    if (data.description) {
      description += ` - ${data.description}`;
    }

    // Add payment type to description
    description += ` (${data.payment_type})`;

    const submitData: any = {
      animal_id: animalId,
      type: 'ingreso',
      category,
      amount: totalAmount,
      description,
      date: data.date
    };

    // Handle client creation for both cash and credit sales
    if ((data.client_id === 'new-client' || !data.client_id) && data.customer_name) {
      submitData.createClient = {
        name: data.customer_name,
        phone: data.customer_phone || '',
      };
    }

    // If it's a credit sale, add debtor information
    if (data.payment_type === 'credito') {
      let debtorName = data.customer_name;
      let debtorPhone = data.customer_phone || '';
      
      // If a client was selected, use their information
      if (data.client_id && data.client_id !== 'new-client') {
        const selectedClient = clients.find(c => c.id === data.client_id);
        if (selectedClient) {
          debtorName = selectedClient.name;
          debtorPhone = selectedClient.phone || '';
        }
      }
      
      if (data.animal_type === 'pollitos') {
        submitData.createDebtor = {
          debtor_name: debtorName!,
          phone: debtorPhone,
          cartons_owed: 0,
          eggs_owed: 0,
          price_per_carton: 0,
          price_per_egg: 0,
          animal_id: animalId
        };
      } else {
        submitData.createDebtor = {
          debtor_name: debtorName!,
          phone: debtorPhone,
          cartons_owed: data.cartons,
          eggs_owed: data.eggs,
          price_per_carton: data.price_per_carton,
          price_per_egg: data.price_per_egg,
          animal_id: animalId
        };
      }
    }

    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {animalType === 'pollitos' ? (
            <>
              <FormField
                control={form.control}
                name="kilos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilos de Pollo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="3" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_kilo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por Kilo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="13000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {animalType !== 'pollitos' && (
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
        )}

        <FormField
          control={form.control}
          name="payment_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Pago</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contado" id="contado" />
                    <label htmlFor="contado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Al Contado
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credito" id="credito" />
                    <label htmlFor="credito" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      A Crédito
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium">
            {form.watch('payment_type') === 'credito' ? 'Información del Cliente' : 'Cliente (Opcional)'}
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente Existente</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    if (value === "new-client" || !value) {
                      form.setValue('customer_name', '');
                      form.setValue('customer_phone', '');
                    }
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente existente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="new-client">Crear nuevo cliente</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.phone ? `(${client.phone})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {(!form.watch('client_id') || form.watch('client_id') === 'new-client') && (
              <>
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nombre del Cliente {form.watch('payment_type') === 'credito' ? '*' : ''}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo del cliente" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de teléfono" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
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
              animalType === 'pollitos' 
                ? (form.watch('kilos') * form.watch('price_per_kilo'))
                : (form.watch('cartons') * form.watch('price_per_carton')) + 
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