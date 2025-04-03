
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

// Función para formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value);
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

// Datos de ejemplo
const monthlyData = [
  { month: 'Enero', ingresos: 4000, gastos: 2400, balance: 1600 },
  { month: 'Febrero', ingresos: 3000, gastos: 1398, balance: 1602 },
  { month: 'Marzo', ingresos: 2000, gastos: 3800, balance: -1800 },
  { month: 'Abril', ingresos: 2780, gastos: 3908, balance: -1128 },
  { month: 'Mayo', ingresos: 1890, gastos: 4800, balance: -2910 },
  { month: 'Junio', ingresos: 2390, gastos: 3800, balance: -1410 },
  { month: 'Julio', ingresos: 3490, gastos: 4300, balance: -810 },
  { month: 'Agosto', ingresos: 4000, gastos: 2400, balance: 1600 },
  { month: 'Septiembre', ingresos: 5000, gastos: 3800, balance: 1200 },
  { month: 'Octubre', ingresos: 4500, gastos: 2600, balance: 1900 },
  { month: 'Noviembre', ingresos: 4100, gastos: 3200, balance: 900 },
  { month: 'Diciembre', ingresos: 5200, gastos: 3100, balance: 2100 },
];

const categoryData = {
  ingresos: [
    { name: 'Venta de Cosechas', value: 8500 },
    { name: 'Productos Lácteos', value: 3800 },
    { name: 'Subproductos', value: 1500 },
    { name: 'Subsidios', value: 2500 },
    { name: 'Otros', value: 1200 },
  ],
  gastos: [
    { name: 'Insumos', value: 4500 },
    { name: 'Mano de Obra', value: 3800 },
    { name: 'Maquinaria', value: 2500 },
    { name: 'Servicios', value: 1200 },
    { name: 'Impuestos', value: 800 },
  ]
};

// Colores para gráficos
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

// Estado de datos para simular cuando no hay datos
const dataStates = {
  withData: 'withData',
  noData: 'noData'
};

const Statistics = () => {
  const [year, setYear] = useState('2023');
  // Para demostración: cambiar a dataStates.noData para mostrar estado sin datos
  const [dataState, setDataState] = useState(dataStates.noData);
  
  // Verificar si hay datos disponibles
  const hasData = dataState === dataStates.withData;
  
  // Formatter para tooltips monetarios
  const currencyFormatter = (value: number) => formatCurrency(value);
  
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
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Toggle para demostrar estados con/sin datos (solo para demostración) */}
        <div className="mb-4">
          <button 
            onClick={() => setDataState(dataState === dataStates.withData ? dataStates.noData : dataStates.withData)}
            className="text-xs text-muted-foreground underline"
          >
            {dataState === dataStates.withData ? "Mostrar interfaz sin datos" : "Mostrar datos de ejemplo"}
          </button>
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
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.ingresos}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.ingresos.map((entry, index) => (
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
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.gastos}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.gastos.map((entry, index) => (
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
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.ingresos}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.ingresos.map((entry, index) => (
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
                  {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData.gastos}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.gastos.map((entry, index) => (
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
