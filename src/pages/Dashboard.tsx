
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
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
    <div className="space-y-4 md:space-y-6 px-1 sm:px-2 pb-6 md:pb-8 min-h-0 min-w-0">
      <div className="pt-1 md:pt-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">
          {t('dashboard')}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-1">
          {t('financialSummary')}
        </p>
      </div>

      {/* Cards - Optimizado para móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 min-w-0">
        <CardStat
          title={t('totalBalance')}
          value={formatCurrency(summary.totalBalance)}
          icon={<DollarSign className="h-4 w-4" />}
          className="bg-white dark:bg-farm-green"
        />
        <CardStat
          title={t('monthlyIncome')}
          value={formatCurrency(summary.monthlyIncome)}
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          trend={summary.incomeTrend}
          className="bg-white dark:bg-farm-green"
        />
        <CardStat
          title={t('monthlyExpenses')}
          value={formatCurrency(summary.monthlyExpenses)}
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
          trend={summary.expensesTrend}
          className="bg-white dark:bg-farm-green"
        />
        <CardStat
          title={t('liquidity')}
          value={formatCurrency(summary.liquidity)}
          icon={<BanknoteIcon className="h-4 w-4" />}
          className="bg-white dark:bg-farm-green"
        />
      </div>

      {/* Charts - Layout optimizado para móvil */}
      <div className="space-y-4 md:space-y-6 min-w-0">
        {/* Gráfico de balance mensual */}
        <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-3 md:p-4 min-w-0 w-full">
          <ChartMonthlyBalance transactions={transactions} />
        </div>
        
        {/* Gráficos de distribución - En columna en móvil, en fila en desktop */}
        <div className={`grid gap-4 min-w-0 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-3 md:p-4 min-w-0 w-full">
            <ChartCategoryDistribution 
              title="Distribución de gastos" 
              type="gastos" 
              transactions={transactions}
              showLegend={!isMobile} 
              onClick={handleExpenseChartClick}
            />
          </div>
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-3 md:p-4 min-w-0 w-full">
            <ChartCategoryDistribution 
              title="Distribución de ingresos" 
              type="ingresos" 
              transactions={transactions}
              showLegend={!isMobile} 
              onClick={handleIncomeChartClick}
            />
          </div>
        </div>
      </div>

      {/* Últimas Transacciones - Optimizado para móvil */}
      <div className="space-y-3 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg md:text-xl font-bold">
            {t('latestTransactions')}
          </h3>
          {isMobile && (
            <button 
              onClick={() => navigate('/transacciones')}
              className="text-theme-primary text-sm font-medium hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>
        
        <div className="w-full min-w-0 overflow-x-auto rounded-lg bg-white dark:bg-farm-green shadow-sm">
          <div className={`p-2 md:p-4 ${isMobile ? 'min-w-[600px]' : ''}`}>
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
