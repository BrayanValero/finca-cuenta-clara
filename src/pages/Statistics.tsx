
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import ChartMonthlyBalance from '@/components/ChartMonthlyBalance';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import MobileNav from '@/components/MobileNav';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, Transaction } from '@/services/transactionService';
import { format, parseISO, isValid, startOfYear, endOfYear, isSameMonth, isSameYear } from 'date-fns';
import { es } from 'date-fns/locale';

// Función para formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD', currencyDisplay: 'symbol' }).format(value);
};

// Componente para mostrar cuando no hay datos
const NoDataDisplay = ({ message = "No hay datos disponibles para mostrar" }) => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <p className="mt-4">{message}</p>
  </div>
);

// Colores para gráficos
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

const Statistics = () => {
  const [year, setYear] = useState('2025');
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });
  
  // Filtrar transacciones por año seleccionado
  const filteredTransactions = transactions.filter((t: Transaction) => {
    const transDate = parseISO(t.date);
    return isValid(transDate) && transDate.getFullYear().toString() === year;
  });
  
  // Verificar si hay datos disponibles
  const hasData = filteredTransactions.length > 0;
  
  // Procesamiento de datos de ingresos/gastos mensuales
  const processMonthlyData = () => {
    if (!hasData) return [];
    
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthlyData = months.map(month => ({
      month,
      ingresos: 0,
      gastos: 0,
      balance: 0
    }));
    
    filteredTransactions.forEach((t: Transaction) => {
      const date = parseISO(t.date);
      if (!isValid(date)) return;
      
      const monthIndex = date.getMonth();
      
      if (t.type === 'ingreso') {
        monthlyData[monthIndex].ingresos += Number(t.amount);
      } else {
        monthlyData[monthIndex].gastos += Number(t.amount);
      }
    });
    
    // Calcular balance
    monthlyData.forEach(data => {
      data.balance = data.ingresos - data.gastos;
    });
    
    return monthlyData;
  };
  
  // Procesamiento de datos de categorías
  const processCategoryData = (type: 'ingresos' | 'gastos') => {
    if (!hasData) return [];
    
    const filteredByType = filteredTransactions.filter(
      (t: Transaction) => type === 'ingresos' ? t.type === 'ingreso' : t.type === 'gasto'
    );
    
    if (filteredByType.length === 0) return [];
    
    const categories: Record<string, number> = {};
    
    filteredByType.forEach((t: Transaction) => {
      const category = t.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += Number(t.amount);
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };
  
  const monthlyData = processMonthlyData();
  const incomeCategories = processCategoryData('ingresos');
  const expenseCategories = processCategoryData('gastos');
  
  // Formatter para tooltips monetarios
  const currencyFormatter = (value: number) => formatCurrency(value);
  
  // Generar array de años desde 2020 hasta el año actual (2025)
  const generateYearOptions = () => {
    const currentYear = 2025; // Año actual hardcodeado para el ejemplo
    const startYear = 2020;
    const years = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    
    return years;
  };
  
  const yearOptions = generateYearOptions();
  
  return (
    <>
      <MobileNav />
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
            <p className="text-muted-foreground">Análisis visual de tus finanzas</p>
          </div>
          
          <div className="w-full md:w-40">
            <Label htmlFor="year-select">Año</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(yearOption => (
                  <SelectItem key={yearOption} value={yearOption}>{yearOption}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              <Card>
                <CardHeader>
                  <CardTitle>Balance Anual {year}</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={currencyFormatter} />
                        <Tooltip formatter={currencyFormatter} />
                        <Legend />
                        <Line type="monotone" dataKey="balance" stroke="#4D5726" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de balance disponibles para este período" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comparativa Ingresos vs Gastos</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={currencyFormatter} />
                        <Tooltip formatter={currencyFormatter} />
                        <Legend />
                        <Bar dataKey="ingresos" fill="#4D5726" name="Ingresos" />
                        <Bar dataKey="gastos" fill="#B8860B" name="Gastos" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos comparativos de ingresos y gastos" />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de ingresos</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData && incomeCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {incomeCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de distribución de ingresos" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de gastos</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData && expenseCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de distribución de gastos" />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ingresos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingresos Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={currencyFormatter} />
                        <Tooltip formatter={currencyFormatter} />
                        <Legend />
                        <Line type="monotone" dataKey="ingresos" stroke="#4D5726" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de ingresos mensuales" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ingresos</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData && incomeCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomeCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {incomeCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de distribución de ingresos" />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="gastos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gastos Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={currencyFormatter} />
                        <Tooltip formatter={currencyFormatter} />
                        <Legend />
                        <Line type="monotone" dataKey="gastos" stroke="#B8860B" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de gastos mensuales" />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Gastos</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {hasData && expenseCategories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <NoDataDisplay message="No hay datos de distribución de gastos" />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tendencias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia Anual</CardTitle>
              </CardHeader>
              <CardContent className="h-96">
                {hasData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={currencyFormatter} />
                      <Tooltip formatter={currencyFormatter} />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke="#4D5726" name="Ingresos" strokeWidth={2} />
                      <Line type="monotone" dataKey="gastos" stroke="#B8860B" name="Gastos" strokeWidth={2} />
                      <Line type="monotone" dataKey="balance" stroke="#000" name="Balance" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <NoDataDisplay message="No hay datos de tendencias disponibles para este período" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Statistics;
