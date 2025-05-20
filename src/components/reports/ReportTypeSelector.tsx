
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ReportTypeSelector = ({ value, onChange }: ReportTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tipo">Tipo de informe</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccione un tipo de informe" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="completo">Informe completo</SelectItem>
          <SelectItem value="ingresos">Solo ingresos</SelectItem>
          <SelectItem value="gastos">Solo gastos</SelectItem>
          <SelectItem value="descripciones">Por descripción</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReportTypeSelector;
