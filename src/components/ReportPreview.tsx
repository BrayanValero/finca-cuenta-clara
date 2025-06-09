
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ReportPreviewProps {
  transactions: Transaction[];
  title: string;
  dateRange?: { start?: Date; end?: Date };
  type?: 'all' | 'incomes' | 'expenses' | 'descriptions';
}

// Colores complementarios a la paleta de la finca
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441', '#8B4513', '#228B22', '#DAA520'];

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

  // Prepare chart data for pie chart
  const pieChartData = React.useMemo(() => {
    if (type === 'descriptions' && descriptionSummary) {
      return Object.entries(descriptionSummary)
        .map(([name, values]) => ({
          name,
          value: values.expense,
          displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.expense)
        }))
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
    } else if (type === 'all') {
      return [
        { name: 'Ingresos', value: totalIncome, displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalIncome) },
        { name: 'Gastos', value: totalExpense, displayValue: new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalExpense) }
      ].filter(item => item.value > 0);
    }
    return [];
  }, [type, descriptionSummary, totalIncome, totalExpense]);

  // Prepare comparison chart data
  const comparisonData = [
    {
      name: 'Resumen',
      ingresos: totalIncome,
      gastos: totalExpense,
      balance: balance
    }
  ];

  const getTransactionTypeDisplay = (type: string) => {
    return type === 'ingreso' ? 'Ingreso' : 'Gasto';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'ingreso' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
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
              {/* Summary Chart Section */}
              {type === 'all' && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">Comparación Ingresos vs Gastos</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(Number(value))} />
                        <Legend />
                        <Bar dataKey="ingresos" fill="#4D5726" name="Ingresos" />
                        <Bar dataKey="gastos" fill="#B8860B" name="Gastos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Pie Chart Section */}
              {pieChartData.length > 0 && type !== 'all' && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-4">
                    {type === 'descriptions' ? 'Distribución por Descripción' : 'Distribución Gráfica'}
                  </h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Table Section */}
              {type === 'descriptions' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                      <TableHead className="text-right">Gastos</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(descriptionSummary || {}).map(([description, values]) => (
                      <TableRow key={description}>
                        <TableCell className="font-medium">{description}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.income)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.expense)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.income - values.expense)}
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
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              <div className="mt-6 border-t pt-4 grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Ingresos</h4>
                  <p className="text-xl font-bold text-green-600">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalIncome)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Total Gastos</h4>
                  <p className="text-xl font-bold text-red-600">
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalExpense)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
                  <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(balance)}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPreview;
