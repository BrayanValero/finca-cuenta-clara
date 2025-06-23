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
import { categorizeTransaction, CATEGORIES } from '@/utils/transactionUtils';
import CategorySuggestion from './CategorySuggestion';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date(),
    type: 'gasto',
    description: '',
    amount: 0
  });

  const [categorySuggestion, setCategorySuggestion] = useState<{
    category: string;
    confidence: number;
    source: 'rules' | 'ai';
  } | null>(null);
  
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [manualCategory, setManualCategory] = useState<string>('');

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

  // Función para obtener sugerencia de categoría
  const getSuggestion = async (description: string, type: 'ingreso' | 'gasto') => {
    if (!description.trim()) {
      setShowSuggestion(false);
      return;
    }

    try {
      const suggestion = await categorizeTransaction(description, type);
      setCategorySuggestion(suggestion);
      setShowSuggestion(true);
      setManualCategory(suggestion.category);
    } catch (error) {
      console.error('Error getting category suggestion:', error);
    }
  };

  // Detectar cambios en descripción para sugerir categoría
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.description && formData.description.length > 3) {
        getSuggestion(formData.description, formData.type);
      }
    }, 1000); // Esperar 1 segundo después de que el usuario deje de escribir

    return () => clearTimeout(debounceTimer);
  }, [formData.description, formData.type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Si cambia el tipo, obtener nueva sugerencia
    if (name === 'type' && formData.description) {
      getSuggestion(formData.description, value as 'ingreso' | 'gasto');
    }
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

  const handleAcceptSuggestion = () => {
    setShowSuggestion(false);
    toast({
      title: "Categoría aplicada",
      description: `Se aplicó la categoría: ${categorySuggestion?.category}`,
    });
  };

  const handleRejectSuggestion = () => {
    setShowSuggestion(false);
    setManualCategory('');
    toast({
      title: "Sugerencia rechazada",
      description: "Puedes asignar una categoría manualmente si lo deseas.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
        <div className="space-y-2">
          <Label htmlFor="fecha" className="text-sm font-medium">Fecha</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal min-h-[44px]",
                  !formData.fecha && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {formData.fecha ? format(formData.fecha, 'PPP') : 'Seleccione una fecha'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
              <Calendar
                mode="single"
                selected={formData.fecha}
                onSelect={handleDateChange}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">Tipo</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ingreso">💰 Ingreso</SelectItem>
              <SelectItem value="gasto">💸 Gasto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">Monto</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleInputChange}
            className={`text-right min-h-[44px] ${isMobile ? 'text-base' : ''}`}
            inputMode="decimal"
          />
        </div>

        <div className={`space-y-2 ${isMobile ? '' : 'md:col-span-2'}`}>
          <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descripción de la transacción"
            value={formData.description}
            onChange={handleInputChange}
            rows={isMobile ? 2 : 3}
            className={`resize-none ${isMobile ? 'text-base' : ''}`}
          />
          
          {/* Mostrar sugerencia de categoría */}
          <CategorySuggestion
            suggestion={categorySuggestion!}
            onAccept={handleAcceptSuggestion}
            onReject={handleRejectSuggestion}
            isVisible={showSuggestion && !!categorySuggestion}
          />
          
          {/* Mostrar categoría seleccionada */}
          {manualCategory && !showSuggestion && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
              <span className="text-sm text-green-800">
                Categoría: <strong>{manualCategory}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className={`bg-theme-primary hover:bg-theme-accent text-white font-medium transition-colors ${
          isMobile ? 'w-full min-h-[48px] text-base' : 'w-full md:w-auto'
        }`}
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
