
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction } from '@/services/transactionService';
import { generateReport } from '@/utils/reportUtils';
import ReportDateRangePicker from './reports/ReportDateRangePicker';
import ReportTypeSelector from './reports/ReportTypeSelector';
import ReportFormActions from './reports/ReportFormActions';

interface ReportFormData {
  tipo: 'all' | 'incomes' | 'expenses' | 'descriptions';
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
    type: 'all' | 'incomes' | 'expenses' | 'descriptions'; 
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

  const handleSelectChange = (value: string) => {
    setFormData({ 
      ...formData, 
      tipo: mapTypeValue(value)
    });
  };

  const mapTypeValue = (value: string): 'all' | 'incomes' | 'expenses' | 'descriptions' => {
    switch (value) {
      case 'ingresos': return 'incomes';
      case 'gastos': return 'expenses';
      case 'descripciones': return 'descriptions';
      default: return 'all';
    }
  };

  const getTypeDisplayValue = (): string => {
    switch (formData.tipo) {
      case 'incomes': return 'ingresos';
      case 'expenses': return 'gastos';
      case 'descriptions': return 'descripciones';
      default: return 'completo';
    }
  };

  const handleDateChange = (field: 'fechaInicio' | 'fechaFin', date: Date | undefined) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
  };

  const validateForm = (): boolean => {
    if ((formData.fechaInicio && !formData.fechaFin) || (!formData.fechaInicio && formData.fechaFin)) {
      toast({
        title: "Error",
        description: "Debe seleccionar ambas fechas o ninguna para el periodo",
        variant: "destructive",
      });
      return false;
    }
    
    if (transactions.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay transacciones disponibles para generar el informe.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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
    <form className="space-y-6">
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

        <ReportTypeSelector 
          value={getTypeDisplayValue()} 
          onChange={handleSelectChange} 
        />

        <ReportDateRangePicker 
          startDate={formData.fechaInicio}
          endDate={formData.fechaFin}
          onStartDateChange={(date) => handleDateChange('fechaInicio', date)}
          onEndDateChange={(date) => handleDateChange('fechaFin', date)}
        />

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

      <ReportFormActions 
        onPreview={handlePreview}
        onSubmit={handleSubmit}
        isGenerating={isGenerating}
      />
    </form>
  );
};

export default ReportForm;
