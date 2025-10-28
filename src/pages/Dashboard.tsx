
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
import { useLoans, useAllLoanPayments } from '@/hooks/useLoans';


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: loans = [] } = useLoans();
  const { data: loanPayments = [] } = useAllLoanPayments();
  
  const summary = useFinancialSummary(transactions, loans, loanPayments);

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
    <div className="space-y-6 px-1 sm:px-2 md:px-4 pb-8 min-h-0 min-w-0">
      <div className="pt-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">Panel</h2>
        <p className="text-muted-foreground text-base sm:text-lg">Resumen financiero de tu finca</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full min-w-0 w-full">
            <ChartMonthlyBalance transactions={transactions} />
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full min-w-0 w-full">
            <ChartCategoryDistribution 
              title="Distribución de gastos" 
              type="gastos" 
              transactions={transactions}
              showLegend={false} 
              onClick={handleExpenseChartClick}
            />
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full min-w-0 w-full">
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

      {/* Últimas Transacciones - scroll horizontal SIEMPRE visible */}
      <div className="space-y-3 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold">Últimas Transacciones</h3>
        <div className="w-full min-w-0 overflow-x-auto rounded-lg bg-white dark:bg-farm-green shadow-sm p-2 sm:p-4">
          <div className="min-w-[640px]">
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
