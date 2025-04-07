
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface ReportOptions {
  transactions: Transaction[];
  title: string;
  dateRange?: { start?: Date; end?: Date };
  type?: 'all' | 'incomes' | 'expenses' | 'categories';
  format: 'pdf' | 'excel' | 'csv';
  includeCharts?: boolean;
}

// Filter transactions based on report options
export const filterTransactions = (transactions: Transaction[], options: Omit<ReportOptions, 'format'>) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    
    // Filter by date range if provided
    if (options.dateRange?.start && transactionDate < options.dateRange.start) return false;
    if (options.dateRange?.end && transactionDate > options.dateRange.end) return false;
    
    // Filter by transaction type
    if (options.type === 'incomes' && transaction.type !== 'ingreso') return false;
    if (options.type === 'expenses' && transaction.type !== 'gasto') return false;
    
    return true;
  });
};

// Convert transactions to Excel or CSV
export const exportToExcel = (options: ReportOptions) => {
  const { transactions, title, dateRange, type, format } = options;
  
  const filteredTransactions = filterTransactions(transactions, { transactions, title, dateRange, type });
  
  // Prepare data based on report type
  let data = [];
  
  if (type === 'categories') {
    // Group by category
    const categorySummary = filteredTransactions.reduce((acc, transaction) => {
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
    }, {} as Record<string, { income: number; expense: number }>);
    
    data = Object.entries(categorySummary).map(([category, values]) => ({
      'Categoría': category,
      'Ingresos': values.income,
      'Gastos': values.expense,
      'Balance': values.income - values.expense
    }));
  } else {
    // Regular transaction list
    data = filteredTransactions.map(transaction => ({
      'Fecha': format(new Date(transaction.date), 'dd/MM/yyyy'),
      'Tipo': transaction.type === 'ingreso' ? 'Ingreso' : 'Gasto',
      'Descripción': transaction.description || '-',
      'Categoría': transaction.category,
      'Monto': Number(transaction.amount)
    }));
  }
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Informe');
  
  // Generate file name
  const dateStr = dateRange?.start && dateRange?.end 
    ? `_${format(dateRange.start, 'dd-MM-yyyy')}_a_${format(dateRange.end, 'dd-MM-yyyy')}` 
    : '';
  
  const fileName = `${title.replace(/\s+/g, '_')}${dateStr}`;
  
  // Export based on format
  if (format === 'excel') {
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } else if (format === 'csv') {
    XLSX.writeFile(workbook, `${fileName}.csv`, { bookType: 'csv' });
  }
  
  return true;
};

// Placeholder for PDF export (would require additional libraries)
export const exportToPDF = (options: ReportOptions) => {
  // This is a placeholder - in a real implementation, we would use a library like jsPDF
  console.log('PDF export not fully implemented', options);
  
  // We would create a PDF version of the report here
  alert('La exportación a PDF será implementada próximamente. Por favor, utilice Excel o CSV por ahora.');
  
  return false;
};

// Main export function
export const generateReport = (options: ReportOptions) => {
  const { format } = options;
  
  try {
    if (format === 'pdf') {
      return exportToPDF(options);
    } else {
      return exportToExcel(options);
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return false;
  }
};
