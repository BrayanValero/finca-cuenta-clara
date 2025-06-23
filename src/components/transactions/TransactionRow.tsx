
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/services/transactionService';
import TransactionActions from './TransactionActions';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  balance: number;
}

const formatDate = (dateString: string, isMobile: boolean = false) => {
  const date = new Date(dateString);
  if (isMobile) {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatCurrency = (amount: number, isMobile: boolean = false) => {
  const formatted = new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'COP', 
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('COP', '$');
  
  if (isMobile && formatted.length > 8) {
    // Simplify large numbers on mobile
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
  }
  
  return formatted;
};

const TransactionRow = ({ transaction, onEdit, onDelete, balance }: TransactionRowProps) => {
  const isMobile = useIsMobile();

  return (
    <TableRow className={isMobile ? 'h-16' : ''}>
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-4'} font-medium`}>
        {formatDate(transaction.date, isMobile)}
      </TableCell>
      <TableCell className={isMobile ? 'p-2' : 'p-4'}>
        <Badge 
          variant={transaction.type === 'ingreso' ? 'default' : 'destructive'}
          className={isMobile ? 'text-xs px-2 py-1' : ''}
        >
          {isMobile 
            ? (transaction.type === 'ingreso' ? '+' : '-')
            : (transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto')
          }
        </Badge>
      </TableCell>
      <TableCell className={`${isMobile ? 'p-2 text-xs max-w-[120px]' : 'p-4 max-w-[300px]'} truncate`}>
        <span className={isMobile ? 'block truncate' : ''} title={transaction.description || ''}>
          {transaction.description || 'Sin descripción'}
        </span>
      </TableCell>
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-4'} text-right font-medium`}>
        <span 
          className={`${transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'} ${
            isMobile ? 'block' : ''
          }`}
        >
          {transaction.type === 'ingreso' ? '+' : '-'} {formatCurrency(transaction.amount, isMobile)}
        </span>
      </TableCell>
      <TableCell className={`${isMobile ? 'p-2 text-xs' : 'p-4'} text-right font-medium`}>
        <span 
          className={`${balance >= 0 ? 'text-green-600' : 'text-red-600'} ${
            isMobile ? 'block' : ''
          }`}
        >
          {formatCurrency(balance, isMobile)}
        </span>
      </TableCell>
      <TableCell className={isMobile ? 'p-1' : 'p-4'}>
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
