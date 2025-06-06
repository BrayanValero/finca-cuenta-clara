
import React, { useEffect } from 'react';
import { DollarSign, BanknoteIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CardStat from '@/components/CardStat';
import ChartMonthlyBalance from '@/components/ChartMonthlyBalance';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import TransactionTable from '@/components/TransactionTable';
import MobileNav from '@/components/MobileNav';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatCurrency } from '@/utils/transactionUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: transactions = [], isLoading } = useTransactions();
  const summary = useFinancialSummary(transactions);

  useEffect(() => {
    console.log("Dashboard rendered, user:", user?.id);
    console.log("Transaction count:", transactions.length);
  }, [user, transactions]);

  const handleChartClick = () => {
    navigate('/detalle-distribuciones');
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
            showLegend={false} 
            onClick={handleChartClick}
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
