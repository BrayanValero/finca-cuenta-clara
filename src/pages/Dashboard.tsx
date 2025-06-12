
import { useTransactions } from '@/hooks/useTransactions';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import CardStat from '@/components/CardStat';
import ChartMonthlyBalance from '@/components/ChartMonthlyBalance';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import LastSessionInfo from '@/components/LastSessionInfo';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const Dashboard = () => {
  const { data: transactions = [], isLoading } = useTransactions();
  const { totalIncome, totalExpenses, currentBalance, monthlyData } = useFinancialSummary(transactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'COP',
      currencyDisplay: 'symbol'
    })
    .format(amount)
    .replace('COP', '$');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Principal</h1>
        <p className="text-muted-foreground">
          Resumen financiero de tu finca
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardStat
          title="Balance Actual"
          value={formatCurrency(currentBalance)}
          icon={<DollarSign className="h-4 w-4" />}
          trend={currentBalance >= 0 ? 5 : -5}
          description={currentBalance >= 0 ? "Balance positivo" : "Balance negativo"}
        />
        <CardStat
          title="Total Ingresos"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="h-4 w-4" />}
          trend={10}
          description="Ingresos totales"
        />
        <CardStat
          title="Total Gastos"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          trend={-8}
          description="Gastos totales"
        />
        <CardStat
          title="Diferencia"
          value={formatCurrency(totalIncome - totalExpenses)}
          icon={<PiggyBank className="h-4 w-4" />}
          trend={totalIncome >= totalExpenses ? 15 : -12}
          description="Ingresos - Gastos"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartMonthlyBalance transactions={transactions} />
        <ChartCategoryDistribution transactions={transactions} />
      </div>

      {/* Session Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <LastSessionInfo />
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">Espacio disponible para futuras funcionalidades</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
