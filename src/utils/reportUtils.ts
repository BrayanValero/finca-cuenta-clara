
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

// Generate enhanced chart representation for PDF
const drawEnhancedChart = (doc: jsPDF, chartData: Array<{name: string, value: number}>, startY: number, chartType: 'pie' | 'bar' = 'pie') => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const chartWidth = 120;
  const chartHeight = 60;
  const chartX = (pageWidth - chartWidth) / 2;
  
  // Draw chart title
  doc.setFontSize(14);
  doc.text('Análisis Gráfico', pageWidth / 2, startY, { align: 'center' });
  
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441', '#8B4513', '#228B22'];
  
  if (chartType === 'pie' && chartData.length > 0) {
    // Draw pie chart representation
    const centerX = chartX + chartWidth / 2;
    const centerY = startY + 30;
    const radius = 25;
    
    let currentAngle = 0;
    
    chartData.forEach((item, index) => {
      const percentage = (item.value / total) * 100;
      const sliceAngle = (item.value / total) * 360;
      
      // Draw slice (simplified as a line from center)
      const angle1 = (currentAngle * Math.PI) / 180;
      const angle2 = ((currentAngle + sliceAngle) * Math.PI) / 180;
      
      const x1 = centerX + Math.cos(angle1) * radius;
      const y1 = centerY + Math.sin(angle1) * radius;
      const x2 = centerX + Math.cos(angle2) * radius;
      const y2 = centerY + Math.sin(angle2) * radius;
      
      // Draw lines to represent the slice
      doc.setDrawColor(colors[index % colors.length]);
      doc.setLineWidth(3);
      doc.line(centerX, centerY, x1, y1);
      doc.line(centerX, centerY, x2, y2);
      
      currentAngle += sliceAngle;
    });
    
    // Draw circle outline
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.circle(centerX, centerY, radius);
  }
  
  // Draw legend
  let legendY = startY + 70;
  chartData.forEach((item, index) => {
    const percentage = (item.value / total) * 100;
    const color = colors[index % colors.length];
    
    // Draw legend item
    doc.setFillColor(color);
    doc.rect(chartX - 40, legendY - 2, 6, 4, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(amount);
    };
    
    doc.text(`${item.name}: ${formatCurrency(item.value)} (${percentage.toFixed(1)}%)`, chartX - 30, legendY + 1);
    legendY += 8;
  });
  
  return legendY + 10;
};

// Generate PDF with enhanced formatting and charts
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
    doc.setFont('helvetica', 'bold');
    doc.text('H-V Farm', 40, 20);
    
    // Add report title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
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
    
    // Add summary section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Ejecutivo', 15, currentY + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Total de transacciones: ${filteredTransactions.length}`, 15, currentY + 25);
    doc.text(`Periodo: ${dateRange?.start && dateRange?.end ? 
      `${format(dateRange.start, 'dd/MM/yyyy')} - ${format(dateRange.end, 'dd/MM/yyyy')}` : 
      'Todas las fechas'}`, 15, currentY + 32);
    
    currentY += 45;
    
    // Add chart if requested
    if (includeCharts) {
      let chartData: Array<{name: string, value: number}> = [];
      
      if (type === 'descriptions') {
        const descriptionSummary = filteredTransactions.reduce((acc, transaction) => {
          const description = transaction.description || 'Sin descripción';
          if (!acc[description]) {
            acc[description] = 0;
          }
          if (transaction.type === 'gasto') {
            acc[description] += Number(transaction.amount);
          }
          return acc;
        }, {} as Record<string, number>);
        
        chartData = Object.entries(descriptionSummary)
          .map(([name, value]) => ({ name, value }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 6); // Top 6 items
      } else if (type === 'all') {
        chartData = [
          { name: 'Ingresos', value: totalIncome },
          { name: 'Gastos', value: totalExpense }
        ].filter(item => item.value > 0);
      }
      
      if (chartData.length > 0) {
        currentY = drawEnhancedChart(doc, chartData, currentY + 10);
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
            expense: 0,
            count: 0
          };
        }
        
        if (transaction.type === 'ingreso') {
          acc[description].income += Number(transaction.amount);
        } else {
          acc[description].expense += Number(transaction.amount);
        }
        acc[description].count += 1;
        
        return acc;
      }, {} as Record<string, { income: number; expense: number; count: number }>);
      
      // Convert description data to table format
      const tableData = Object.entries(descriptionSummary).map(([description, values]) => [
        description,
        values.count.toString(),
        formatCurrency(values.income),
        formatCurrency(values.expense),
        formatCurrency(values.income - values.expense)
      ]);
      
      // Add descriptions table
      autoTable(doc, {
        startY: currentY,
        head: [['Descripción', 'Cant.', 'Ingresos', 'Gastos', 'Balance']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [64, 115, 64], // Dark green
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' }
        }
      });
      
    } else {
      // Enhanced transaction table for other report types
      const tableData = filteredTransactions.map(transaction => [
        format(new Date(transaction.date), 'dd/MM/yyyy'),
        transaction.type === 'ingreso' ? 'INGRESO' : 'GASTO',
        transaction.description || '-',
        formatCurrency(Number(transaction.amount))
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Fecha', 'Tipo', 'Descripción', 'Monto']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [64, 115, 64], // Dark green
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          1: { 
            halign: 'center',
            cellWidth: 25
          },
          3: { halign: 'right' }
        },
        didParseCell: function(data) {
          // Color-code transaction types
          if (data.column.index === 1 && data.cell.text[0]) {
            if (data.cell.text[0] === 'INGRESO') {
              data.cell.styles.textColor = [34, 139, 34]; // Green
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.text[0] === 'GASTO') {
              data.cell.styles.textColor = [220, 20, 60]; // Red
              data.cell.styles.fontStyle = 'bold';
            }
          }
        }
      });
    }
    
    // Get Y position after the table
    const finalY = (doc as any).lastAutoTable.finalY || 180;
    
    // Add enhanced totals section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Financiero', 15, finalY + 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(34, 139, 34); // Green
    doc.text(`Total Ingresos: ${formatCurrency(totalIncome)}`, 15, finalY + 32);
    
    doc.setTextColor(220, 20, 60); // Red
    doc.text(`Total Gastos: ${formatCurrency(totalExpense)}`, 15, finalY + 42);
    
    doc.setTextColor(0, 0, 0); // Black
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const balanceColor = balance >= 0 ? [34, 139, 34] : [220, 20, 60];
    doc.setTextColor(balanceColor[0], balanceColor[1], balanceColor[2]);
    doc.text(`Balance Final: ${formatCurrency(balance)}`, 15, finalY + 55);
    
    // Add footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Informe generado automáticamente por H-V Farm`, 15, doc.internal.pageSize.getHeight() - 20);
    doc.text(`Fecha de generación: ${format(new Date(), 'PPP', { locale: es })}`, pageWidth - 15, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    
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
