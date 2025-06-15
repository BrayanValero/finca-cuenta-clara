
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
    // Estrucutura principal mejorada para móviles: min-h-0 y flex-col
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 min-h-0">
        <div className="space-y-6 px-1 sm:px-2 md:px-4 pb-8 min-w-0">
          <div className="fade-in pt-2 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">Panel</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Resumen financiero de tu finca</p>
          </div>

          {/* Cards - stack on mobile */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 min-w-0">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-w-0">
            <div className="fade-in md:col-span-2 min-w-0">
              <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full min-w-0">
                <ChartMonthlyBalance transactions={transactions} />
              </div>
            </div>
            <div className="fade-in min-w-0">
              <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full min-w-0">
                <ChartCategoryDistribution 
                  title="Distribución de gastos" 
                  type="gastos" 
                  transactions={transactions}
                  showLegend={false} 
                  onClick={handleExpenseChartClick}
                />
              </div>
            </div>
            <div className="fade-in min-w-0">
              <div className="bg-white dark:bg-farm-green rounded-lg shadow-sm p-2 sm:p-4 h-full min-w-0">
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
          <div className="space-y-3 fade-in min-w-0">
            <h3 className="text-lg sm:text-xl font-bold">Últimas Transacciones</h3>
            <div className="w-full lg:w-auto max-w-full overflow-x-auto rounded-lg bg-white dark:bg-farm-green shadow-sm p-1 sm:p-4 min-w-0">
              <div className="min-w-[600px] lg:min-w-0">
                <TransactionTable />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

