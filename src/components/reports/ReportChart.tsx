
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ReportChartProps {
  type: 'all' | 'incomes' | 'expenses' | 'descriptions';
  chartData: Array<{ name: string; fullName: string; value: number; displayValue: string }>;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const COLORS = ['#4D5726', '#6B7B3A', '#B8860B', '#D9A441', '#8B4513', '#228B22', '#DAA520', '#A0522D'];

const ReportChart: React.FC<ReportChartProps> = ({
  type,
  chartData,
  totalIncome,
  totalExpense,
  balance
}) => {
  const comparisonData = [
    {
      name: 'Resumen',
      ingresos: totalIncome,
      gastos: totalExpense,
      balance: balance
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg shadow-lg p-2">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">
            {data.displayValue}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Summary Chart Section - Only for 'all' type */}
      {type === 'all' && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Comparación Ingresos vs Gastos</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(Number(value))} />
                <Legend />
                <Bar dataKey="ingresos" fill="#4D5726" name="Ingresos" />
                <Bar dataKey="gastos" fill="#B8860B" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pie Chart Section - For all types when there's data */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">
            {type === 'descriptions' && 'Distribución por Descripción'}
            {type === 'incomes' && 'Distribución de Ingresos'}
            {type === 'expenses' && 'Distribución de Gastos'}
            {type === 'all' && 'Distribución General'}
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportChart;
