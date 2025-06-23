
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
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
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-2 pb-4 sm:pb-8 min-h-0 min-w-0">
      {/* Header */}
      <div className="pt-1 sm:pt-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">{t('dashboard')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">{t('financialSummary')}</p>
      </div>

      {/* Stats Cards - Mobile: 2x2 grid, Desktop: 4 columns */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 min-w-0">
        <CardStat
          title={t('totalBalance')}
          value={formatCurrency(summary.totalBalance)}
          icon={<DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />}
          className="bg-white dark:bg-farm-green p-3 sm:p-4"
        />
        <CardStat
          title={t('monthlyIncome')}
          value={formatCurrency(summary.monthlyIncome)}
          icon={<TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />}
          trend={summary.incomeTrend}
          className="bg-white dark:bg-farm-green p-3 sm:p-4"
        />
        <CardStat
          title={t('monthlyExpenses')}
          value={formatCurrency(summary.monthlyExpenses)}
          icon={<TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
          trend={summary.expensesTrend}
          className="bg-white dark:bg-farm-green p-3 sm:p-4"
        />
        <CardStat
          title={t('liquidity')}
          value={formatCurrency(summary.liquidity)}
          icon={<BanknoteIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
          className="bg-white dark:bg-farm-green p-3 sm:p-4"
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-4 md:space-y-6 min-w-0">
        {/* Monthly Balance Chart - Full Width */}
        <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-3 sm:p-4 min-w-0 w-full">
          <div className="h-48 sm:h-64 md:h-72">
            <ChartMonthlyBalance transactions={transactions} />
          </div>
        </div>
        
        {/* Distribution Charts - Mobile: Stack, Desktop: Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-3 sm:p-4 min-w-0 w-full">
            <div className="h-48 sm:h-56 md:h-64">
              <ChartCategoryDistribution 
                title="Distribución de gastos" 
                type="gastos" 
                transactions={transactions}
                showLegend={false} 
                onClick={handleExpenseChartClick}
              />
            </div>
          </div>
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-3 sm:p-4 min-w-0 w-full">
            <div className="h-48 sm:h-56 md:h-64">
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
      </div>

      {/* Latest Transactions - Horizontal Scroll */}
      <div className="space-y-3 min-w-0">
        <h3 className="text-base sm:text-lg md:text-xl font-bold px-1">{t('latestTransactions')}</h3>
        <div className="w-full min-w-0 overflow-x-auto rounded-lg bg-white dark:bg-farm-green shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="min-w-[640px] sm:min-w-[800px]">
              <TransactionTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
