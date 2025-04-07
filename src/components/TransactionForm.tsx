
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTransaction, TransactionInput, updateTransaction } from '@/services/transactionService';
import { useAuth } from '@/contexts/AuthContext';

type FormData = {
  fecha: Date;
  type: 'ingreso' | 'gasto';
  description: string;
  amount: number;
};

type TransactionFormProps = {
  editTransaction?: {
    id: string;
    date: string;
    type: 'ingreso' | 'gasto';
    description: string | null;
    amount: number;
  } | null;
  onSuccess?: () => void;
};

const TransactionForm = ({ editTransaction, onSuccess }: TransactionFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date(),
    type: 'gasto',
    description: '',
    amount: 0
  });

  // Efecto para cargar datos cuando estamos editando
  useEffect(() => {
    if (editTransaction) {
      setFormData({
        fecha: new Date(editTransaction.date),
        type: editTransaction.type,
        description: editTransaction.description || '',
        amount: editTransaction.amount
      });
    }
  }, [editTransaction]);

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transacción registrada",
        description: "La transacción ha sido guardada con éxito."
      });
      resetForm();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la transacción. Por favor, inténtelo de nuevo."
      });
    }
  });

  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransactionInput }) => 
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transacción actualizada",
        description: "La transacción ha sido actualizada con éxito."
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la transacción. Por favor, inténtelo de nuevo."
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, fecha: date });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.fecha || !formData.amount) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    // Preparar datos para enviar
    const transactionData: TransactionInput = {
      date: formData.fecha.toISOString().split('T')[0],
      type: formData.type,
      category: 'otros', // Mantenemos un valor predeterminado para la categoría en backend
      description: formData.description || null,
      amount: Number(formData.amount)
    };

    // Enviar datos (crear nuevo o actualizar)
    if (editTransaction) {
      updateTransactionMutation.mutate({ 
        id: editTransaction.id, 
        data: transactionData 
      });
    } else {
      createTransactionMutation.mutate(transactionData);
    }
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date(),
      type: 'gasto',
      description: '',
      amount: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.fecha && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.fecha ? format(formData.fecha, 'PPP') : <span>Seleccione una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.fecha}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Transacción</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ingreso">Ingreso</SelectItem>
              <SelectItem value="gasto">Gasto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            className="text-right"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descripción de la transacción"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full md:w-auto bg-farm-green hover:bg-farm-lightgreen text-white"
        disabled={createTransactionMutation.isPending || updateTransactionMutation.isPending}
      >
        {editTransaction 
          ? (updateTransactionMutation.isPending ? "Actualizando..." : "Actualizar Transacción") 
          : (createTransactionMutation.isPending ? "Procesando..." : "Registrar Transacción")}
      </Button>
    </form>
  );
};

export default TransactionForm;
