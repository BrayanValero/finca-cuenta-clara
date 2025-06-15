
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ReportTableProps {
  transactionsWithBalance: (Transaction & { runningBalance: number })[];
}

const ReportTable: React.FC<ReportTableProps> = ({
  transactionsWithBalance
}) => {
  const getTransactionTypeDisplay = (type: string) => {
    return type === 'ingreso' ? 'Ingreso' : 'Gasto';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'ingreso' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactionsWithBalance.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getTransactionIcon(transaction.type)}
                <span className={transaction.type === 'ingreso' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {getTransactionTypeDisplay(transaction.type)}
                </span>
              </div>
            </TableCell>
            <TableCell>{transaction.description || '-'}</TableCell>
            <TableCell className={`text-right font-medium ${transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(Number(transaction.amount))}
            </TableCell>
            <TableCell className={`text-right font-medium ${transaction.runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(transaction.runningBalance)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReportTable;
