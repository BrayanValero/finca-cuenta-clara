
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/services/transactionService';
import { format, parse, isValid, startOfMonth, endOfMonth, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Componente para mostrar cuando no hay datos
const NoDataDisplay = () => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <p className="mt-4">No hay datos disponibles</p>
  </div>
);

// Define the interface for monthly data
interface MonthlyData {
  month: string;
  monthYear: string;
  ingresos: number;
  gastos: number;
  monthIndex: number; // Add this to help with sorting and identifying the actual month
  year: number;       // Add year for precise matching
}

const processMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
  if (!transactions || transactions.length === 0) return [];
  
  // Obtener el rango de meses
  const dates = transactions.map(t => new Date(t.date));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  // Inicializar datos mensuales
  const monthlyData: MonthlyData[] = [];
  
  // Crear un objeto para cada mes en el rango
  let currentDate = startOfMonth(minDate);
  const endDate = endOfMonth(maxDate);
  
  while (currentDate <= endDate) {
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthName = format(currentDate, 'MMMM', { locale: es });
    const monthYear = format(currentDate, 'MMM yyyy', { locale: es });
    
    monthlyData.push({
      month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      monthYear: monthYear.charAt(0).toUpperCase() + monthYear.slice(1),
      ingresos: 0,
      gastos: 0,
      monthIndex,
      year
    });
    
    // Avanzar al siguiente mes
    currentDate = new Date(year, monthIndex + 1, 1);
  }
  
  // Rellenar los datos de transacciones
  transactions.forEach(transaction => {
    const transDate = parseISO(transaction.date);
    if (!isValid(transDate)) return;
    
    const transMonth = transDate.getMonth();
    const transYear = transDate.getFullYear();
    
    // Find the correct month entry using monthIndex and year for exact matching
    const monthIndex = monthlyData.findIndex(data => 
      data.monthIndex === transMonth && data.year === transYear
    );
    
    if (monthIndex >= 0) {
      if (transaction.type === 'ingreso') {
        monthlyData[monthIndex].ingresos += Number(transaction.amount);
      } else {
        monthlyData[monthIndex].gastos += Number(transaction.amount);
      }
    }
  });
  
  return monthlyData;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-green-600">Ingresos: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP', currencyDisplay: 'symbol' }).format(payload[0].value)}</p>
        <p className="text-red-600">Gastos: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP', currencyDisplay: 'symbol' }).format(payload[1].value)}</p>
        <p className="font-semibold pt-1 border-t mt-1">
          Balance: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP', currencyDisplay: 'symbol' }).format(payload[0].value - payload[1].value)}
        </p>
      </div>
    );
  }
  return null;
};

const ChartMonthlyBalance: React.FC<{ 
  transactions?: Transaction[]
}> = ({ 
  transactions = []
}) => {
  const data = processMonthlyData(transactions);
  const hasData = data.length > 0;

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Balance mensual</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="monthYear" 
                tick={{ fontSize: 12 }} 
                angle={-45} 
                textAnchor="end" 
                height={60}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="ingresos" fill="#4D5726" name="Ingresos" />
              <Bar dataKey="gastos" fill="#B8860B" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoDataDisplay />
        )}
      </CardContent>
    </Card>
  );
};

export default ChartMonthlyBalance;
