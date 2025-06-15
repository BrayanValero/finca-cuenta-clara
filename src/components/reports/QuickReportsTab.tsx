
import { FileText, PieChart } from 'lucide-react';
import QuickReportCard from './QuickReportCard';

interface QuickReportsTabProps {
  onGenerateReport: (type: string, format: 'pdf' | 'preview') => void;
}

const QuickReportsTab = ({ onGenerateReport }: QuickReportsTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <QuickReportCard
        title="Informe Mensual"
        description="Resumen de ingresos y gastos del mes actual."
        icon={FileText}
        onPreview={() => onGenerateReport('monthly', 'preview')}
        onGenerate={() => onGenerateReport('monthly', 'pdf')}
      />
      
      <QuickReportCard
        title="Balance Anual"
        description="Estado financiero completo del año en curso."
        icon={FileText}
        onPreview={() => onGenerateReport('annual', 'preview')}
        onGenerate={() => onGenerateReport('annual', 'pdf')}
      />
      
      <QuickReportCard
        title="Análisis de Categorías"
        description="Distribución detallada por categorías."
        icon={PieChart}
        onPreview={() => onGenerateReport('categories', 'preview')}
        onGenerate={() => onGenerateReport('categories', 'pdf')}
      />
    </div>
  );
};

export default QuickReportsTab;
