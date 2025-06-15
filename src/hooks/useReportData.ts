
import { Transaction } from '@/services/transactionService';

export interface ReportData {
  filteredTransactions: Transaction[];
  sortedTransactions: Transaction[];
  transactionsWithBalance: (Transaction & { runningBalance: number })[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  descriptionSummary: Record<string, { income: number; expense: number }> | null;
  chartData: Array<{ name: string; fullName: string; value: number; displayValue: string }>;
}

interface UseReportDataProps {
  transactions: Transaction[];
  dateRange?: { start?: Date; end?: Date };
  type?: 'all' | 'incomes' | 'expenses' | 'descriptions';
}

export const useReportData = ({ 
  transactions, 
  dateRange, 
  type = 'all' 
}: UseReportDataProps): ReportData => {
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

  // Sort transactions by date for balance calculation
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate running balance for each transaction
  const transactionsWithBalance = sortedTransactions.map((transaction, index) => {
    const previousTransactions = sortedTransactions.slice(0, index + 1);
    const balance = previousTransactions.reduce((acc, t) => {
      return t.type === 'ingreso' ? acc + Number(t.amount) : acc - Number(t.amount);
    }, 0);
    
    return {
      ...transaction,
      runningBalance: balance
    };
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'ingreso')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const balance = totalIncome - totalExpense;

  // Group by description for description type
  const descriptionSummary = type === 'descriptions' ? 
    filteredTransactions.reduce((acc, transaction) => {
      const description = transaction.description || 'Sin descripción';
      if (!acc[description]) {
        acc[description] = {
          income: 0,
          expense: 0
        };
      }
      
      if (transaction.type === 'ingreso') {
        acc[description].income += Number(transaction.amount);
      } else {
        acc[description].expense += Number(transaction.amount);
      }
      
      return acc;
    }, {} as Record<string, { income: number; expense: number }>) : null;

  // Prepare chart data based on report type
  const prepareChartData = () => {
    if (type === 'descriptions' && descriptionSummary) {
      return Object.entries(descriptionSummary)
        .map(([name, values]) => ({
          name: name.length > 15 ? name.substring(0, 15) + '...' : name,
          fullName: name,
          value: values.expense,
          displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.expense)
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    } else if (type === 'incomes') {
      const incomesByDesc = filteredTransactions
        .filter(t => t.type === 'ingreso')
        .reduce((acc, t) => {
          const desc = t.description || 'Sin descripción';
          acc[desc] = (acc[desc] || 0) + Number(t.amount);
          return acc;
        }, {} as Record<string, number>);
      
      return Object.entries(incomesByDesc)
        .map(([name, value]) => ({
          name: name.length > 15 ? name.substring(0, 15) + '...' : name,
          fullName: name,
          value,
          displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(value)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    } else if (type === 'expenses') {
      const expensesByDesc = filteredTransactions
        .filter(t => t.type === 'gasto')
        .reduce((acc, t) => {
          const desc = t.description || 'Sin descripción';
          acc[desc] = (acc[desc] || 0) + Number(t.amount);
          return acc;
        }, {} as Record<string, number>);
      
      return Object.entries(expensesByDesc)
        .map(([name, value]) => ({
          name: name.length > 15 ? name.substring(0, 15) + '...' : name,
          fullName: name,
          value,
          displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(value)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);
    } else {
      return [
        { 
          name: 'Ingresos', 
          fullName: 'Ingresos',
          value: totalIncome, 
          displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalIncome)
        },
        { 
          name: 'Gastos', 
          fullName: 'Gastos',
          value: totalExpense, 
          displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalExpense)
        }
      ].filter(item => item.value > 0);
    }
  };

  const chartData = prepareChartData();

  return {
    filteredTransactions,
    sortedTransactions,
    transactionsWithBalance,
    totalIncome,
    totalExpense,
    balance,
    descriptionSummary,
    chartData
  };
};
