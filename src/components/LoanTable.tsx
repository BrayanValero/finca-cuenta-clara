
import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Loan, getLoans, deleteLoan, updateLoan } from '@/services/loanService';

const LoanTable = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await getLoans();
      setLoans(data);
    } catch (error) {
      console.error('Error loading loans:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los préstamos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLoan(id);
      setLoans(loans.filter(loan => loan.id !== id));
      toast({
        title: 'Préstamo eliminado',
        description: 'El préstamo ha sido eliminado con éxito',
      });
    } catch (error) {
      console.error('Error deleting loan:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el préstamo',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (loan: Loan) => {
    try {
      const newStatus = loan.status === 'pendiente' ? 'pagado' : 'pendiente';
      await updateLoan(loan.id, { status: newStatus });
      
      setLoans(loans.map(l => 
        l.id === loan.id ? { ...l, status: newStatus } : l
      ));
      
      toast({
        title: 'Estado actualizado',
        description: `El préstamo ahora está ${newStatus === 'pagado' ? 'pagado' : 'pendiente'}`,
      });
    } catch (error) {
      console.error('Error updating loan status:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del préstamo',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const renderLoanTable = (loans: Loan[], type: 'recibido' | 'otorgado') => {
    const filteredLoans = loans.filter(loan => loan.loan_type === type);
    
    if (filteredLoans.length === 0) {
      return (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No hay préstamos {type === 'recibido' ? 'recibidos' : 'otorgados'} registrados</p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Table className="mt-4">
        <TableCaption>Lista de préstamos {type === 'recibido' ? 'recibidos' : 'otorgados'}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLoans.map(loan => (
            <TableRow key={loan.id}>
              <TableCell>{format(parseISO(loan.date), 'dd/MM/yyyy')}</TableCell>
              <TableCell>{loan.description || '-'}</TableCell>
              <TableCell>{formatCurrency(loan.amount)}</TableCell>
              <TableCell>
                <Badge 
                  variant={loan.status === 'pagado' ? 'outline' : 'default'}
                  className={loan.status === 'pagado' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}
                >
                  {loan.status === 'pagado' ? (
                    <span className="flex items-center gap-1"><CheckCircle size={12} /> Pagado</span>
                  ) : (
                    <span className="flex items-center gap-1"><Clock size={12} /> Pendiente</span>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                {loan.due_date ? format(parseISO(loan.due_date), 'dd/MM/yyyy') : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleStatusChange(loan)}
                  >
                    {loan.status === 'pendiente' ? 'Marcar pagado' : 'Marcar pendiente'}
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del préstamo.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(loan.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Cargando préstamos...</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="recibidos" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="recibidos">Préstamos Recibidos</TabsTrigger>
        <TabsTrigger value="otorgados">Préstamos Otorgados</TabsTrigger>
      </TabsList>

      <TabsContent value="recibidos">
        {renderLoanTable(loans, 'recibido')}
      </TabsContent>
      
      <TabsContent value="otorgados">
        {renderLoanTable(loans, 'otorgado')}
      </TabsContent>
    </Tabs>
  );
};

export default LoanTable;
