
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, formatDateToLocalString } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLoan, LoanInput } from '@/services/loanService';

type FormData = {
  fecha: Date;
  loan_type: 'recibido' | 'otorgado';
  description: string;
  amount: number;
  due_date: Date | null;
  status: 'pendiente' | 'pagado';
};

const LoanForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date(),
    loan_type: 'recibido',
    description: '',
    amount: 0,
    due_date: null,
    status: 'pendiente'
  });

  const createLoanMutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({
        title: "Préstamo registrado",
        description: "El préstamo ha sido guardado con éxito."
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar el préstamo. Por favor, inténtelo de nuevo."
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

  const handleDateChange = (date: Date | undefined, field: 'fecha' | 'due_date') => {
    if (date) {
      setFormData({ ...formData, [field]: date });
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
    const loanData: LoanInput = {
      date: formatDateToLocalString(formData.fecha),
      description: formData.description || null,
      amount: Number(formData.amount),
      loan_type: formData.loan_type,
      status: formData.status,
      due_date: formData.due_date ? formatDateToLocalString(formData.due_date) : null
    };

    // Enviar datos
    createLoanMutation.mutate(loanData);
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date(),
      loan_type: 'recibido',
      description: '',
      amount: 0,
      due_date: null,
      status: 'pendiente'
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
                onSelect={(date) => handleDateChange(date, 'fecha')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan_type">Tipo de Préstamo</Label>
          <Select 
            value={formData.loan_type} 
            onValueChange={(value) => handleSelectChange('loan_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recibido">Préstamo recibido</SelectItem>
              <SelectItem value="otorgado">Préstamo otorgado</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value as 'pendiente' | 'pagado')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Descripción del préstamo"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Fecha de vencimiento (opcional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.due_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.due_date ? format(formData.due_date, 'PPP') : <span>Sin fecha de vencimiento</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.due_date || undefined}
                onSelect={(date) => handleDateChange(date, 'due_date')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full md:w-auto bg-farm-green hover:bg-farm-lightgreen text-white"
        disabled={createLoanMutation.isPending}
      >
        {createLoanMutation.isPending ? "Procesando..." : "Registrar Préstamo"}
      </Button>
    </form>
  );
};

export default LoanForm;
