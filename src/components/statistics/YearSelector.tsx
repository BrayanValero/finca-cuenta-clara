
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface YearSelectorProps {
  year: string;
  onYearChange: (year: string) => void;
}

const YearSelector = ({ year, onYearChange }: YearSelectorProps) => {
  // Generar array de años desde 2020 hasta el año actual (2025)
  const generateYearOptions = () => {
    const currentYear = 2025; // Año actual hardcodeado para el ejemplo
    const startYear = 2020;
    const years = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    
    return years;
  };
  
  const yearOptions = generateYearOptions();

  return (
    <div className="w-full md:w-40">
      <Label htmlFor="year-select">Año</Label>
      <Select value={year} onValueChange={onYearChange}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar año" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map(yearOption => (
            <SelectItem key={yearOption} value={yearOption}>{yearOption}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelector;
