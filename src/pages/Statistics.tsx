
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Eliminado: import MobileNav from '@/components/MobileNav';
import YearSelector from '@/components/statistics/YearSelector';
import BalanceChart from '@/components/statistics/BalanceChart';
import IncomeExpenseChart from '@/components/statistics/IncomeExpenseChart';
import MonthlyLineChart from '@/components/statistics/MonthlyLineChart';
import TrendChart from '@/components/statistics/TrendChart';
import { useStatisticsData } from '@/hooks/useStatisticsData';

// Función para formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP', currencyDisplay: 'symbol' }).format(value);
};

const Statistics = () => {
  const [year, setYear] = useState('2025');
  const { monthlyData, hasData, isLoading } = useStatisticsData(year);
  
  // Formatter para tooltips monetarios
  const currencyFormatter = (value: number) => formatCurrency(value);
  
  return (
    <>
      {/* Eliminado: <MobileNav /> */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
            <p className="text-muted-foreground">Análisis visual de tus finanzas</p>
          </div>
          
          <YearSelector year={year} onYearChange={setYear} />
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BalanceChart 
                data={monthlyData}
                year={year}
                hasData={hasData}
                currencyFormatter={currencyFormatter}
              />
              
              <IncomeExpenseChart 
                data={monthlyData}
                hasData={hasData}
                currencyFormatter={currencyFormatter}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ingresos" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <MonthlyLineChart 
                title="Ingresos Mensuales"
                data={monthlyData}
                dataKey="ingresos"
                color="#4D5726"
                hasData={hasData}
                currencyFormatter={currencyFormatter}
                noDataMessage="No hay datos de ingresos mensuales"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="gastos" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <MonthlyLineChart 
                title="Gastos Mensuales"
                data={monthlyData}
                dataKey="gastos"
                color="#B8860B"
                hasData={hasData}
                currencyFormatter={currencyFormatter}
                noDataMessage="No hay datos de gastos mensuales"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tendencias" className="space-y-6">
            <TrendChart 
              data={monthlyData}
              hasData={hasData}
              currencyFormatter={currencyFormatter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Statistics;

