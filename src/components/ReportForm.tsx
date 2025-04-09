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
import { CalendarIcon, FileText, Eye } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/services/transactionService';
import { generateReport } from '@/utils/reportUtils';

interface ReportFormData {
  tipo: 'all' | 'incomes' | 'expenses' | 'categories';
  fechaInicio?: Date;
  fechaFin?: Date;
  incluirGraficos: boolean;
  formatoSalida: 'pdf' | 'preview';
  titulo: string;
}

interface ReportFormProps {
  transactions?: Transaction[];
  setActiveReport?: (report: { 
    title: string; 
    type: 'all' | 'incomes' | 'expenses' | 'categories'; 
    dateRange?: { start?: Date; end?: Date }; 
  } | null) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  transactions = [], 
  setActiveReport 
}) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    tipo: 'all',
    fechaInicio: undefined,
    fechaFin: undefined,
    incluirGraficos: true,
    formatoSalida: 'pdf',
    titulo: 'Informe personalizado',
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ 
      ...formData, 
      [name]: name === 'tipo' 
        ? mapTypeValue(value) 
        : value 
    });
  };

  const mapTypeValue = (value: string): 'all' | 'incomes' | 'expenses' | 'categories' => {
    switch (value) {
      case 'ingresos': return 'incomes';
      case 'gastos': return 'expenses';
      case 'categorias': return 'categories';
      default: return 'all';
    }
  };

  const getTypeDisplayValue = (): string => {
    switch (formData.tipo) {
      case 'incomes': return 'ingresos';
      case 'expenses': return 'gastos';
      case 'categories': return 'categorias';
      default: return 'completo';
    }
  };

  const handleDateChange = (field: 'fechaInicio' | 'fechaFin', date: Date | undefined) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
  };

  const handlePreview = () => {
    if ((formData.fechaInicio && !formData.fechaFin) || (!formData.fechaInicio && formData.fechaFin)) {
      toast({
        title: "Error",
        description: "Debe seleccionar ambas fechas o ninguna para el periodo",
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
    
    if (setActiveReport) {
      setActiveReport({
        title: formData.titulo,
        type: formData.tipo,
        dateRange: formData.fechaInicio && formData.fechaFin 
          ? { start: formData.fechaInicio, end: formData.fechaFin } 
          : undefined
      });
      
      generateReport({
        transactions,
        title: formData.titulo,
        dateRange: formData.fechaInicio && formData.fechaFin 
          ? { start: formData.fechaInicio, end: formData.fechaFin } 
          : undefined,
        type: formData.tipo,
        format: 'preview',
        includeCharts: formData.incluirGraficos
      });
      
      const previewTab = document.querySelector('[value="preview"]') as HTMLButtonElement;
      if (previewTab) {
        previewTab.click();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent, preview?: boolean) => {
    e.preventDefault();
    
    if ((formData.fechaInicio && !formData.fechaFin) || (!formData.fechaInicio && formData.fechaFin)) {
      toast({
        title: "Error",
        description: "Debe seleccionar ambas fechas o ninguna para el periodo",
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
    
    if (preview) {
      handlePreview();
      return;
    }
    
    setIsGenerating(true);
    
    const success = generateReport({
      transactions,
      title: formData.titulo,
      dateRange: formData.fechaInicio && formData.fechaFin 
        ? { start: formData.fechaInicio, end: formData.fechaFin } 
        : undefined,
      type: formData.tipo,
      format: 'pdf',
      includeCharts: formData.incluirGraficos
    });
    
    setTimeout(() => {
      setIsGenerating(false);
      
      if (success) {
        toast({
          title: "Informe generado",
          description: "El informe se ha generado correctamente en formato PDF",
        });
      } else {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al generar el informe",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título del informe</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            placeholder="Ingrese un título para el informe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de informe</Label>
          <Select
            value={getTypeDisplayValue()}
            onValueChange={(value) => handleSelectChange('tipo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un tipo de informe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completo">Informe completo</SelectItem>
              <SelectItem value="ingresos">Solo ingresos</SelectItem>
              <SelectItem value="gastos">Solo gastos</SelectItem>
              <SelectItem value="categorias">Por categorías</SelectItem>
            </SelectContent>
          </Select>
        </div>

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

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={(e) => handleSubmit(e, true)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Vista previa
        </Button>
        
        <Button
          type="submit"
          className="flex-1 bg-farm-green hover:bg-farm-lightgreen text-white"
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
              Generar PDF
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;
