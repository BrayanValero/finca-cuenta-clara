
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/services/transactionService';
import TransactionActions from './TransactionActions';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  balance: number; // Add balance prop
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP', currencyDisplay: 'symbol' })
    .format(amount)
    .replace('COP', '$');
};

const TransactionRow = ({ transaction, onEdit, onDelete, balance }: TransactionRowProps) => {
  return (
    <TableRow>
      <TableCell>{formatDate(transaction.date)}</TableCell>
      <TableCell>
        <Badge variant={transaction.type === 'ingreso' ? 'default' : 'destructive'}>
          {transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto'}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[300px] truncate">{transaction.description}</TableCell>
      <TableCell className="text-right font-medium">
        <span className={transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
          {transaction.type === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </span>
      </TableCell>
      <TableCell className="text-right font-medium">
        <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(balance)}
        </span>
      </TableCell>
      <TableCell>
        <TransactionActions 
          transaction={transaction} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
};

export default TransactionRow;
