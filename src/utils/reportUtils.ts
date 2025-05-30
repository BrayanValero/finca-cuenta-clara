
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportOptions {
  transactions: Transaction[];
  title: string;
  dateRange?: { start?: Date; end?: Date };
  type?: 'all' | 'incomes' | 'expenses' | 'descriptions';
  format: 'pdf' | 'preview';
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

// Generate simple chart representation for PDF
const drawSimpleChart = (doc: jsPDF, chartData: Array<{name: string, value: number}>, startY: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const chartWidth = 80;
  const chartHeight = 40;
  const chartX = (pageWidth - chartWidth) / 2;
  
  // Draw chart title
  doc.setFontSize(12);
  doc.text('Distribución de Gastos', pageWidth / 2, startY, { align: 'center' });
  
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const colors = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];
  
  // Draw simple pie chart representation
  chartData.forEach((item, index) => {
    const percentage = (item.value / total) * 100;
    const color = colors[index % colors.length];
    
    // Draw legend item
    const legendY = startY + 20 + (index * 8);
    doc.setFillColor(color);
    doc.rect(chartX - 20, legendY - 2, 4, 4, 'F');
    doc.setFontSize(8);
    doc.text(`${item.name}: ${percentage.toFixed(1)}%`, chartX - 12, legendY + 1);
  });
  
  return startY + 20 + (chartData.length * 8) + 10;
};

// Generate PDF with logo and charts
export const exportToPDF = (options: ReportOptions) => {
  // If this is just a preview, don't generate a file
  if (options.format === 'preview') {
    return true;
  }
  
  const { transactions, title, dateRange, type, includeCharts = false } = options;
  const filteredTransactions = filterTransactions(transactions, options);
  
  try {
    // Initialize jsPDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add logo
    const logoPath = "/lovable-uploads/e7909117-d6bf-4712-a6f5-696a1e342bf7.png";
    doc.addImage(logoPath, 'PNG', 15, 10, 20, 20);
    
    // Add title
    doc.setFontSize(18);
    doc.text('H-V Farm', 40, 20);
    
    // Add report title
    doc.setFontSize(16);
    doc.text(title, pageWidth / 2, 40, { align: 'center' });
    
    // Add date range if provided
    let currentY = 50;
    if (dateRange?.start && dateRange?.end) {
      doc.setFontSize(12);
      const dateText = `${format(dateRange.start, 'PPP', { locale: es })} - ${format(dateRange.end, 'PPP', { locale: es })}`;
      doc.text(dateText, pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;
    }
    
    // Calculate totals
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const balance = totalIncome - totalExpense;
    
    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(amount);
    };
    
    // Add chart if requested and type is descriptions
    if (includeCharts && type === 'descriptions') {
      const descriptionSummary = filteredTransactions.reduce((acc, transaction) => {
        const description = transaction.description || 'Sin descripción';
        if (!acc[description]) {
          acc[description] = 0;
        }
        acc[description] += Number(transaction.amount);
        return acc;
      }, {} as Record<string, number>);
      
      const chartData = Object.entries(descriptionSummary)
        .map(([name, value]) => ({ name, value }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 items
      
      if (chartData.length > 0) {
        currentY = drawSimpleChart(doc, chartData, currentY + 10);
      }
    }
    
    // Add data based on report type
    if (type === 'descriptions') {
      // Group by description
      const descriptionSummary = filteredTransactions.reduce((acc, transaction) => {
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
      }, {} as Record<string, { income: number; expense: number }>);
      
      // Convert description data to table format
      const tableData = Object.entries(descriptionSummary).map(([description, values]) => [
        description,
        formatCurrency(values.income),
        formatCurrency(values.expense),
        formatCurrency(values.income - values.expense)
      ]);
      
      // Add descriptions table
      autoTable(doc, {
        startY: currentY,
        head: [['Descripción', 'Ingresos', 'Gastos', 'Balance']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [64, 115, 64], // Dark green
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      });
      
    } else {
      // Transaction table for other report types
      const tableData = filteredTransactions.map(transaction => [
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.description || '-',
        formatCurrency(Number(transaction.amount))
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Fecha', 'Descripción', 'Monto']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [64, 115, 64], // Dark green
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          2: { halign: 'right' }
        }
      });
    }
    
    // Get Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 180;
    
    // Add totals
    doc.setFontSize(12);
    doc.text(`Total Ingresos: ${formatCurrency(totalIncome)}`, 15, finalY + 20);
    doc.text(`Total Gastos: ${formatCurrency(totalExpense)}`, 15, finalY + 30);
    doc.setFontSize(14);
    doc.text(`Balance: ${formatCurrency(balance)}`, 15, finalY + 45);
    
    // Add date at the bottom
    doc.setFontSize(10);
    doc.text(`Generado el ${format(new Date(), 'PPP', { locale: es })}`, pageWidth - 15, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    return false;
  }
};

// Main export function
export const generateReport = (options: ReportOptions) => {
  const { format: outputFormat } = options;
  
  try {
    // For preview, just return true without generating a file
    if (outputFormat === 'preview') {
      return true;
    }
    
    return exportToPDF(options);
  } catch (error) {
    console.error('Error generating report:', error);
    return false;
  }
};
