import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLoanPayments, useLoanPaymentMutations } from '@/hooks/useLoanPayments';
import { LoanPayment } from '@/services/loanPaymentService';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' })
    .format(amount)
    .replace('US$', '$');
};

interface LoanPaymentListProps {
  loanId: string;
}

const LoanPaymentList: React.FC<LoanPaymentListProps> = ({ loanId }) => {
  const { data: payments = [], isLoading, error } = useLoanPayments(loanId);
  const { deletePaymentMutation } = useLoanPaymentMutations();

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este abono?')) {
      deletePaymentMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Cargando abonos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error al cargar los abonos.</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se han registrado abonos para este préstamo.
      </div>
    );
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Historial de Abonos</h4>
        <div className="text-sm font-medium">
          Total abonado: {formatCurrency(totalPaid)}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: LoanPayment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatDate(payment.payment_date)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {payment.description || '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(payment.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LoanPaymentList;