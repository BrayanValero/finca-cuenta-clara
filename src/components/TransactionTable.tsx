
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
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions, deleteTransaction, Transaction } from '@/services/transactionService';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol' }).format(amount);
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transacción eliminada",
        description: "La transacción ha sido eliminada con éxito."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la transacción."
      });
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction: Transaction) =>
      transaction.description?.toLowerCase().includes(searchTerm) ||
      getCategoryLabel(transaction.category).toLowerCase().includes(searchTerm) ||
      formatDate(transaction.date).toLowerCase().includes(searchTerm)
  );

  if (isLoading) {
    return <div className="text-center py-8">Cargando transacciones...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error al cargar las transacciones.</div>;
  }

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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction: Transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'ingreso' ? 'default' : 'destructive'}>
                      {transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getCategoryLabel(transaction.category)}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{transaction.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.amount)}
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
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm 
                    ? "No se encontraron transacciones coincidentes." 
                    : "No hay transacciones registradas aún."}
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
