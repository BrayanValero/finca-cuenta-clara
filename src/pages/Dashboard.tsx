
import React, { useEffect } from 'react';
import { ArrowDown, ArrowUp, DollarSign, BanknoteIcon, TrendingDown, TrendingUp } from 'lucide-react';
import CardStat from '@/components/CardStat';
import ChartMonthlyBalance from '@/components/ChartMonthlyBalance';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import TransactionTable from '@/components/TransactionTable';
import MobileNav from '@/components/MobileNav';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, Transaction } from '@/services/transactionService';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Add user ID to query key to ensure proper cache invalidation
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: getTransactions,
    // Only fetch when we have a user
    enabled: !!user?.id
  });

  useEffect(() => {
    console.log("Dashboard rendered, user:", user?.id);
    console.log("Transaction count:", transactions.length);
  }, [user, transactions]);

  // Calculate financial summary
  const calculateSummary = () => {
    if (isLoading || !transactions.length) {
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
  };

  const summary = calculateSummary();

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP', currencyDisplay: 'symbol' }).format(amount);
  };

  return (
    <>
      <MobileNav />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel</h2>
          <p className="text-muted-foreground">Resumen financiero de tu finca</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardStat
            title="Balance Total"
            value={formatCurrency(summary.totalBalance)}
            icon={<DollarSign className="h-4 w-4" />}
            className="bg-white dark:bg-farm-green"
          />
          <CardStat
            title="Ingresos Mensuales"
            value={formatCurrency(summary.monthlyIncome)}
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
            trend={summary.incomeTrend}
            className="bg-white dark:bg-farm-green"
          />
          <CardStat
            title="Gastos Mensuales"
            value={formatCurrency(summary.monthlyExpenses)}
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
            trend={summary.expensesTrend}
            className="bg-white dark:bg-farm-green"
          />
          <CardStat
            title="Liquidez"
            value={formatCurrency(summary.liquidity)}
            icon={<BanknoteIcon className="h-4 w-4" />}
            className="bg-white dark:bg-farm-green"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChartMonthlyBalance transactions={transactions} />
          <ChartCategoryDistribution 
            title="Distribución de gastos" 
            type="gastos" 
            transactions={transactions} 
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold">Últimas Transacciones</h3>
          <TransactionTable />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
