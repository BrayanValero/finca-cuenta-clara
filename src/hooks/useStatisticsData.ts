
import { useQuery } from '@tanstack/react-query';
import { getTransactions, Transaction } from '@/services/transactionService';
import { parseISO, isValid } from 'date-fns';

export const useStatisticsData = (year: string) => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });
  
  // Filtrar transacciones por año seleccionado
  const filteredTransactions = transactions.filter((t: Transaction) => {
    const transDate = parseISO(t.date);
    return isValid(transDate) && transDate.getFullYear().toString() === year;
  });
  
  // Verificar si hay datos disponibles
  const hasData = filteredTransactions.length > 0;
  
  // Procesamiento de datos de ingresos/gastos mensuales
  const processMonthlyData = () => {
    if (!hasData) return [];
    
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthlyData = months.map(month => ({
      month,
      ingresos: 0,
      gastos: 0,
      balance: 0
    }));
    
    filteredTransactions.forEach((t: Transaction) => {
      const date = parseISO(t.date);
      if (!isValid(date)) return;
      
      const monthIndex = date.getMonth();
      
      if (t.type === 'ingreso') {
        monthlyData[monthIndex].ingresos += Number(t.amount);
      } else {
        monthlyData[monthIndex].gastos += Number(t.amount);
      }
    });
    
    // Calcular balance
    monthlyData.forEach(data => {
      data.balance = data.ingresos - data.gastos;
    });
    
    return monthlyData;
  };
  
  return {
    transactions: filteredTransactions,
    monthlyData: processMonthlyData(),
    hasData,
    isLoading
  };
};
