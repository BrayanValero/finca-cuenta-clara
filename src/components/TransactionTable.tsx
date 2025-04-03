
import { useState } from 'react';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Datos de ejemplo para transacciones
const transactionData = [
  {
    id: 1,
    fecha: '2023-04-01',
    tipo: 'ingreso',
    categoria: 'ventas',
    descripcion: 'Venta de cosecha de maíz',
    monto: 2500.00,
  },
  {
    id: 2,
    fecha: '2023-04-03',
    tipo: 'gasto',
    categoria: 'insumos',
    descripcion: 'Compra de fertilizantes',
    monto: 850.00,
  },
  {
    id: 3,
    fecha: '2023-04-10',
    tipo: 'gasto',
    categoria: 'mano_obra',
    descripcion: 'Pago a trabajadores temporales',
    monto: 1200.00,
  },
  {
    id: 4,
    fecha: '2023-04-15',
    tipo: 'ingreso',
    categoria: 'ventas',
    descripcion: 'Venta de productos lácteos',
    monto: 750.00,
  },
  {
    id: 5,
    fecha: '2023-04-22',
    tipo: 'gasto',
    categoria: 'maquinaria',
    descripcion: 'Reparación de tractor',
    monto: 350.00,
  },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

const getCategoryLabel = (category: string) => {
  const categories: Record<string, string> = {
    'insumos': 'Insumos',
    'cosecha': 'Cosecha',
    'ventas': 'Ventas',
    'maquinaria': 'Maquinaria',
    'mano_obra': 'Mano de Obra',
    'otros': 'Otros',
  };
  return categories[category] || category;
};

const TransactionTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(transactionData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredData(transactionData);
    } else {
      const filtered = transactionData.filter(
        transaction =>
          transaction.descripcion.toLowerCase().includes(term) ||
          getCategoryLabel(transaction.categoria).toLowerCase().includes(term) ||
          formatDate(transaction.fecha).toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar transacciones..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="max-w-[300px]">Descripción</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{formatDate(transaction.fecha)}</TableCell>
                <TableCell>
                  <Badge variant={transaction.tipo === 'ingreso' ? 'default' : 'destructive'}>
                    {transaction.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                  </Badge>
                </TableCell>
                <TableCell>{getCategoryLabel(transaction.categoria)}</TableCell>
                <TableCell className="max-w-[300px] truncate">{transaction.descripcion}</TableCell>
                <TableCell className="text-right font-medium">
                  <span className={transaction.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.tipo === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.monto)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Detalles</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron transacciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
