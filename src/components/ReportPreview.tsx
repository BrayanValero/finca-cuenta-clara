
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportPreviewProps {
  transactions: Transaction[];
  title: string;
  dateRange?: { start?: Date; end?: Date };
  type?: 'all' | 'incomes' | 'expenses' | 'categories';
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  transactions,
  title,
  dateRange,
  type = 'all',
}) => {
  // Filter transactions based on date range and type
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    
    // Filter by date range if provided
    if (dateRange?.start && transactionDate < dateRange.start) return false;
    if (dateRange?.end && transactionDate > dateRange.end) return false;
    
    // Filter by transaction type
    if (type === 'incomes' && transaction.type !== 'ingreso') return false;
    if (type === 'expenses' && transaction.type !== 'gasto') return false;
    
    return true;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const balance = totalIncome - totalExpense;

  // Group by category for category type
  const categorySummary = type === 'categories' ? 
    filteredTransactions.reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = {
          income: 0,
          expense: 0
        };
      }
      
      if (transaction.type === 'ingreso') {
        acc[category].income += Number(transaction.amount);
      } else {
        acc[category].expense += Number(transaction.amount);
      }
      
      return acc;
    }, {} as Record<string, { income: number; expense: number }>) : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {dateRange?.start && dateRange?.end && (
          <div className="text-sm text-muted-foreground">
            {format(dateRange.start, 'PPP', { locale: es })} - {format(dateRange.end, 'PPP', { locale: es })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No hay transacciones para el periodo seleccionado
          </div>
        ) : (
          <>
            {type === 'categories' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Gastos</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(categorySummary || {}).map(([category, values]) => (
                    <TableRow key={category}>
                      <TableCell className="font-medium">{category}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(values.income)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(values.expense)}
                      </TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(values.income - values.expense)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{transaction.description || '-'}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={`text-right ${transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(Number(transaction.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            <div className="mt-6 border-t pt-4 grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Ingresos</h4>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(totalIncome)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Total Gastos</h4>
                <p className="text-xl font-bold text-red-600">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(totalExpense)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(balance)}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
