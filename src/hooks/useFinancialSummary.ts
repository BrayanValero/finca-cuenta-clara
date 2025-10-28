
import { useMemo } from 'react';
import { Transaction } from '@/services/transactionService';
import { Loan } from '@/services/loanService';
import { LoanPayment } from '@/services/loanPaymentService';

interface UseFinancialSummaryProps {
  transactions: Transaction[];
  loans?: Loan[];
  loanPayments?: LoanPayment[];
}

export const useFinancialSummary = (
  transactions: Transaction[], 
  loans: Loan[] = [], 
  loanPayments: LoanPayment[] = []
) => {
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

    // Calculate liquidity considering pending loans and their payments
    const pendingLoans = loans.filter((loan: Loan) => loan.status === 'pendiente');
    
    const pendingLoanAdjustment = pendingLoans.reduce((sum: number, loan: Loan) => {
      // Calculate payments made for this loan
      const paymentsForLoan = loanPayments
        .filter((payment: LoanPayment) => payment.loan_id === loan.id)
        .reduce((paymentSum: number, payment: LoanPayment) => paymentSum + Number(payment.amount), 0);
      
      // Remaining balance = original amount - payments made
      const remainingBalance = Number(loan.amount) - paymentsForLoan;
      
      if (loan.loan_type === 'recibido') {
        // Money we received - adds to liquidity
        return sum + remainingBalance;
      } else {
        // Money we lent out - reduces liquidity
        return sum - remainingBalance;
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
  }, [transactions, loans, loanPayments]);
};
