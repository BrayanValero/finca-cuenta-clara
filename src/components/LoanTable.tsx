
import { useState } from 'react';
import { ArrowUpDown, Calendar, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoans, updateLoan, deleteLoan, Loan } from '@/services/loanService';

interface LoanTableProps {
  statusFilter?: 'pendiente' | 'pagado';
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' })
    .format(amount)
    .replace('US$', '$');
};

const LoanTable = ({ statusFilter }: LoanTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: loans = [], isLoading, error } = useQuery({
    queryKey: ['loans'],
    queryFn: getLoans
  });

  const updateLoanMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pendiente' | 'pagado' }) => 
      updateLoan(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({ 
        title: "Estado actualizado", 
        description: "El estado del préstamo ha sido actualizado con éxito" 
      });
    },
    onError: () => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "No se pudo actualizar el estado del préstamo" 
      });
    }
  });

  const deleteLoanMutation = useMutation({
    mutationFn: deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast({ 
        title: "Préstamo eliminado", 
        description: "El préstamo ha sido eliminado con éxito" 
      });
    },
    onError: () => {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "No se pudo eliminar el préstamo" 
      });
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleStatusChange = (id: string, currentStatus: 'pendiente' | 'pagado') => {
    const newStatus = currentStatus === 'pendiente' ? 'pagado' : 'pendiente';
    updateLoanMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este préstamo?')) {
      deleteLoanMutation.mutate(id);
    }
  };

  let filteredLoans = loans.filter(
    (loan: Loan) =>
      loan.description?.toLowerCase().includes(searchTerm) ||
      formatDate(loan.date).toLowerCase().includes(searchTerm) ||
      (loan.loan_type === 'recibido' ? 'recibido'.includes(searchTerm) : 'otorgado'.includes(searchTerm))
  );

  // Apply status filter if provided
  if (statusFilter) {
    filteredLoans = filteredLoans.filter((loan: Loan) => loan.status === statusFilter);
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando préstamos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error al cargar los préstamos.</div>;
  }

  const getEmptyMessage = () => {
    if (statusFilter === 'pendiente') {
      return searchTerm 
        ? "No se encontraron préstamos pendientes coincidentes." 
        : "No hay préstamos pendientes.";
    }
    return searchTerm 
      ? "No se encontraron préstamos coincidentes." 
      : "No hay préstamos registrados aún.";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder={statusFilter === 'pendiente' ? "Buscar préstamos pendientes..." : "Buscar préstamos..."}
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        {statusFilter === 'pendiente' && (
          <div className="text-sm text-muted-foreground">
            Mostrando solo préstamos pendientes
          </div>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="max-w-[400px]">Descripción</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan: Loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{formatDate(loan.date)}</TableCell>
                  <TableCell>
                    <Badge variant={loan.loan_type === 'recibido' ? 'outline' : 'default'}>
                      {loan.loan_type === 'recibido' ? 'Recibido' : 'Otorgado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[400px] truncate">{loan.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(loan.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={loan.status === 'pendiente' ? 'destructive' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleStatusChange(loan.id, loan.status as 'pendiente' | 'pagado')}
                    >
                      {loan.status === 'pendiente' ? 'Pendiente' : 'Pagado'}
                    </Badge>
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
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(loan.id, loan.status as 'pendiente' | 'pagado')}>
                          Cambiar estado
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(loan.id)}
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
                  {getEmptyMessage()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LoanTable;
