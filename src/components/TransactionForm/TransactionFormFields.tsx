import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormData } from '@/types/TransactionFormTypes';
import CategorySuggestionSection from './CategorySuggestionSection';
import { CategorySuggestion } from '@/types/TransactionFormTypes';

type TransactionFormFieldsProps = {
  formData: FormData;
  categorySuggestion: CategorySuggestion;
  showSuggestion: boolean;
  manualCategory: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onAcceptSuggestion: () => void;
  onRejectSuggestion: () => void;
};

const TransactionFormFields = ({
  formData,
  categorySuggestion,
  showSuggestion,
  manualCategory,
  onInputChange,
  onSelectChange,
  onDateChange,
  onAcceptSuggestion,
  onRejectSuggestion
}: TransactionFormFieldsProps) => {
  return (
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
              onSelect={onDateChange}
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
          onValueChange={(value) => onSelectChange('type', value)}
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
          onChange={onInputChange}
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
          onChange={onInputChange}
          rows={3}
        />
        
        <CategorySuggestionSection
          categorySuggestion={categorySuggestion}
          showSuggestion={showSuggestion}
          manualCategory={manualCategory}
          onAccept={onAcceptSuggestion}
          onReject={onRejectSuggestion}
        />
      </div>
    </div>
  );
};

export default TransactionFormFields;