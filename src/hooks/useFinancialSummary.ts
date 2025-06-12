
import { useMemo } from 'react';
import { Transaction } from '@/services/transactionService';

export const useFinancialSummary = (transactions: Transaction[]) => {
  return useMemo(() => {
    if (!transactions.length) {
      return {
        totalBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        liquidity: 0,
        incomeTrend: 0,
        expensesTrend: 0
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

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

    return {
      totalBalance: totalIncome - totalExpenses,
      monthlyIncome,
      monthlyExpenses,
      liquidity: totalIncome - totalExpenses,
      incomeTrend: 24, // Example value, would need historical data for real calculation
      expensesTrend: -8 // Example value, would need historical data for real calculation
    };
  }, [transactions]);
};
