
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/services/transactionService';

interface ReportFormData {
  tipo: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  incluirGraficos: boolean;
  formatoSalida: string;
}

interface ReportFormProps {
  transactions?: Transaction[];
}

const ReportForm: React.FC<ReportFormProps> = ({ transactions = [] }) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    tipo: 'completo',
    fechaInicio: undefined,
    fechaFin: undefined,
    incluirGraficos: true,
    formatoSalida: 'pdf',
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (field: 'fechaInicio' | 'fechaFin', date: Date | undefined) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.tipo === 'periodo' && (!formData.fechaInicio || !formData.fechaFin)) {
      toast({
        title: "Error",
        description: "Por favor seleccione un periodo válido",
        variant: "destructive",
      });
      return;
    }
    
    if (transactions.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay transacciones disponibles para generar el informe.",
        variant: "destructive"
      });
      return;
    }
    
    // Generar informe
    setIsGenerating(true);
    
    // Simulación de generación de informe con datos reales
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Informe generado",
        description: `El informe se ha generado correctamente con ${transactions.length} transacciones`,
      });
      
      console.log("Generating report with data:", {
        formData,
        transactionsCount: transactions.length
      });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de informe</Label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => handleSelectChange('tipo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo de informe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completo">Informe completo</SelectItem>
              <SelectItem value="periodo">Por periodo</SelectItem>
              <SelectItem value="ingresos">Solo ingresos</SelectItem>
              <SelectItem value="gastos">Solo gastos</SelectItem>
              <SelectItem value="categorias">Por categorías</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.tipo === 'periodo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.fechaInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaInicio ? format(formData.fechaInicio, 'PPP') : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fechaInicio}
                    onSelect={(date) => handleDateChange('fechaInicio', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.fechaFin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaFin ? format(formData.fechaFin, 'PPP') : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fechaFin}
                    onSelect={(date) => handleDateChange('fechaFin', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="formatoSalida">Formato de salida</Label>
          <Select
            value={formData.formatoSalida}
            onValueChange={(value) => handleSelectChange('formatoSalida', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="incluirGraficos"
            checked={formData.incluirGraficos}
            onCheckedChange={(checked) => 
              handleCheckboxChange('incluirGraficos', checked as boolean)
            }
          />
          <label
            htmlFor="incluirGraficos"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Incluir gráficos en el informe
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="bg-farm-green hover:bg-farm-lightgreen text-white"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generando...
          </span>
        ) : (
          <span className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Generar Informe
          </span>
        )}
      </Button>
    </form>
  );
};

export default ReportForm;
