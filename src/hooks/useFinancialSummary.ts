
import { useMemo } from 'react';
import { Transaction } from '@/services/transactionService';
import { format, parseISO, isValid, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export const useFinancialSummary = (transactions: Transaction[]) => {
  return useMemo(() => {
    if (!transactions.length) {
      return {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        liquidity: 0,
        incomeTrend: 0,
        expensesTrend: 0,
        totalIncome: 0,
        totalExpenses: 0,
        currentBalance: 0,
        monthlyData: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter((t: Transaction) => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });

    const totalIncome = transactions
      .filter((t: Transaction) => t.type === 'ingreso')
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t: Transaction) => t.type === 'gasto')
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

    const monthlyIncome = monthlyTransactions
      .filter((t: Transaction) => t.type === 'ingreso')
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t: Transaction) => t.type === 'gasto')
      .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0);

    const currentBalance = totalIncome - totalExpenses;

    // Generate monthly data for charts
    const dates = transactions.map(t => new Date(t.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const monthlyData: any[] = [];
    let iterationDate = startOfMonth(minDate);
    const endDate = endOfMonth(maxDate);
    
    while (iterationDate <= endDate) {
      const monthIndex = iterationDate.getMonth();
      const year = iterationDate.getFullYear();
      const monthName = format(iterationDate, 'MMMM', { locale: es });
      const monthYear = format(iterationDate, 'MMM yyyy', { locale: es });
      
      monthlyData.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        monthYear: monthYear.charAt(0).toUpperCase() + monthYear.slice(1),
        ingresos: 0,
        gastos: 0,
        monthIndex,
        year
      });
      
      iterationDate = new Date(year, monthIndex + 1, 1);
    }
    
    // Fill in transaction data
    transactions.forEach(transaction => {
      const transDate = parseISO(transaction.date);
      if (!isValid(transDate)) return;
      
      const transMonth = transDate.getMonth();
      const transYear = transDate.getFullYear();
      
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

    return {
      totalBalance: currentBalance,
      monthlyIncome,
      monthlyExpenses,
      liquidity: currentBalance,
      incomeTrend: 24, // Example value, would need historical data for real calculation
      expensesTrend: -8, // Example value, would need historical data for real calculation
      totalIncome,
      totalExpenses,
      currentBalance,
      monthlyData
    };
  }, [transactions]);
};
