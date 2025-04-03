
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
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const categorias = [
  { value: 'insumos', label: 'Insumos' },
  { value: 'cosecha', label: 'Cosecha' },
  { value: 'ventas', label: 'Ventas' },
  { value: 'maquinaria', label: 'Maquinaria' },
  { value: 'mano_obra', label: 'Mano de Obra' },
  { value: 'otros', label: 'Otros' },
];

interface FormData {
  fecha: Date | undefined;
  tipo: string;
  categoria: string;
  descripcion: string;
  monto: string;
}

const TransactionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    fecha: new Date(),
    tipo: 'gasto',
    categoria: '',
    descripcion: '',
    monto: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData({ ...formData, fecha: date });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.fecha || !formData.categoria || !formData.monto || formData.monto === '0') {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    // Aquí iría la lógica para guardar la transacción
    console.log('Submitting form data:', formData);
    
    // Mostrar confirmación
    toast({
      title: "Transacción registrada",
      description: "La transacción ha sido guardada con éxito.",
    });
    
    // Resetear formulario
    setFormData({
      fecha: new Date(),
      tipo: 'gasto',
      categoria: '',
      descripcion: '',
      monto: '',
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
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Transacción</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value) => handleSelectChange('tipo', value)}
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
          <Label htmlFor="categoria">Categoría</Label>
          <Select 
            value={formData.categoria} 
            onValueChange={(value) => handleSelectChange('categoria', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monto">Monto</Label>
          <Input
            id="monto"
            name="monto"
            type="number"
            placeholder="0.00"
            value={formData.monto}
            onChange={handleInputChange}
            className="text-right"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            placeholder="Descripción de la transacción"
            value={formData.descripcion}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto bg-farm-green hover:bg-farm-lightgreen text-white">
        Registrar Transacción
      </Button>
    </form>
  );
};

export default TransactionForm;
