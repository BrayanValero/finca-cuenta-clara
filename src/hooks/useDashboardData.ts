
import { useTransactions } from './useTransactions';
import { useFinancialSummary } from './useFinancialSummary';
import { useMemo } from 'react';

// This implementation assumes 'useTransactions' returns an object { data, isLoading, ... }
export const useDashboardData = () => {
  const { data: transactions = [], isLoading } = useTransactions();

  // Calculate financial summary
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    liquidity
  } = useFinancialSummary(transactions);

  // Get latest 3 transactions (sorted by most recent date)
  const latestTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    // Sort descending by date, with string dates handled safely
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 3);
  }, [transactions]);

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    liquidity,
    latestTransactions,
    isLoading,
  };
};
