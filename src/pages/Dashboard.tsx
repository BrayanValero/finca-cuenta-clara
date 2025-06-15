
import React, { useEffect } from 'react';
import { DollarSign, BanknoteIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CardStat from '@/components/CardStat';
import ChartMonthlyBalance from '@/components/ChartMonthlyBalance';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import TransactionTable from '@/components/TransactionTable';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatCurrency } from '@/utils/transactionUtils';
import { useQuery } from '@tanstack/react-query';
import { getLoans } from '@/services/loanService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: loans = [] } = useQuery({
    queryKey: ['loans'],
    queryFn: getLoans
  });
  
  const summary = useFinancialSummary(transactions, loans);

  useEffect(() => {
    console.log("Dashboard rendered, user:", user?.id);
    console.log("Transaction count:", transactions.length);
    console.log("Loans count:", loans.length);
  }, [user, transactions, loans]);

  const handleExpenseChartClick = () => {
    navigate('/detalle-distribuciones?type=gastos');
  };

  const handleIncomeChartClick = () => {
    navigate('/detalle-distribuciones?type=ingresos');
  };

  return (
    <div className="space-y-6 px-1 sm:px-2 md:px-4 pb-8">
      <div className="fade-in pt-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">Panel</h2>
        <p className="text-muted-foreground text-base sm:text-lg">Resumen financiero de tu finca</p>
      </div>

      {/* Cards - stack on mobile */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat
          title="Balance Total"
          value={formatCurrency(summary.totalBalance)}
          icon={<DollarSign className="h-4 w-4" />}
          className="bg-white dark:bg-farm-green fade-in"
        />
        <CardStat
          title="Ingresos Mensuales"
          value={formatCurrency(summary.monthlyIncome)}
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          trend={summary.incomeTrend}
          className="bg-white dark:bg-farm-green fade-in"
        />
        <CardStat
          title="Gastos Mensuales"
          value={formatCurrency(summary.monthlyExpenses)}
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          trend={summary.expensesTrend}
          className="bg-white dark:bg-farm-green fade-in"
        />
        <CardStat
          title="Liquidez"
          value={formatCurrency(summary.liquidity)}
          icon={<BanknoteIcon className="h-4 w-4" />}
          className="bg-white dark:bg-farm-green fade-in"
        />
      </div>

      {/* Charts - vertical on mobile, grid on md+ */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="fade-in md:col-span-2">
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full">
            <ChartMonthlyBalance transactions={transactions} />
          </div>
        </div>
        <div className="fade-in">
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full">
            <ChartCategoryDistribution 
              title="Distribución de gastos" 
              type="gastos" 
              transactions={transactions}
              showLegend={false} 
              onClick={handleExpenseChartClick}
            />
          </div>
        </div>
        <div className="fade-in">
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full">
            <ChartCategoryDistribution 
              title="Distribución de ingresos" 
              type="ingresos" 
              transactions={transactions}
              showLegend={false} 
              onClick={handleIncomeChartClick}
            />
          </div>
        </div>
      </div>

      {/* Últimas Transacciones - scroll en móvil */}
      <div className="space-y-3 fade-in">
        <h3 className="text-lg sm:text-xl font-bold">Últimas Transacciones</h3>
        <div className="overflow-x-auto rounded-lg bg-white dark:bg-farm-green shadow-sm p-2 sm:p-4">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

