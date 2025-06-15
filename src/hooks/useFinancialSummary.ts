
import { useMemo } from 'react';
import { Transaction } from '@/services/transactionService';
import { Loan } from '@/services/loanService';

interface UseFinancialSummaryProps {
  transactions: Transaction[];
  loans?: Loan[];
}

export const useFinancialSummary = (transactions: Transaction[], loans: Loan[] = []) => {
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

    const totalBalance = totalIncome - totalExpenses;

    // Calculate liquidity considering pending loans
    const pendingLoans = loans.filter((loan: Loan) => loan.status === 'pendiente');
    
    const pendingLoanAdjustment = pendingLoans.reduce((sum: number, loan: Loan) => {
      if (loan.loan_type === 'recibido') {
        return sum + Number(loan.amount); // Money we received (adds to liquidity)
      } else {
        return sum - Number(loan.amount); // Money we lent out (reduces liquidity)
      }
    }, 0);

    const liquidity = totalBalance + pendingLoanAdjustment;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      liquidity,
      incomeTrend: 24, // Example value, would need historical data for real calculation
      expensesTrend: -8 // Example value, would need historical data for real calculation
    };
  }, [transactions, loans]);
};
