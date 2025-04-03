
import React from 'react';
import { ArrowDown, ArrowUp, DollarSign, BanknoteIcon, TrendingDown, TrendingUp } from 'lucide-react';
import CardStat from '@/components/CardStat';
import ChartMonthlyBalance from '@/components/ChartMonthlyBalance';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import TransactionTable from '@/components/TransactionTable';
import MobileNav from '@/components/MobileNav';

const Dashboard = () => {
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
            value="€24,500.00"
            icon={<DollarSign className="h-4 w-4" />}
            trend={12}
            className="bg-white dark:bg-farm-green"
          />
          <CardStat
            title="Ingresos Mensuales"
            value="€8,250.00"
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
            trend={24}
            className="bg-white dark:bg-farm-green"
          />
          <CardStat
            title="Gastos Mensuales"
            value="€4,890.00"
            icon={<TrendingDown className="h-4 w-4 text-red-500" />}
            trend={-8}
            className="bg-white dark:bg-farm-green"
          />
          <CardStat
            title="Liquidez"
            value="€19,610.00"
            icon={<BanknoteIcon className="h-4 w-4" />}
            className="bg-white dark:bg-farm-green"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChartMonthlyBalance />
          <ChartCategoryDistribution />
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
