
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Enero', ingresos: 4000, gastos: 2400 },
  { month: 'Febrero', ingresos: 3000, gastos: 1398 },
  { month: 'Marzo', ingresos: 2000, gastos: 9800 },
  { month: 'Abril', ingresos: 2780, gastos: 3908 },
  { month: 'Mayo', ingresos: 1890, gastos: 4800 },
  { month: 'Junio', ingresos: 2390, gastos: 3800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-sm">
        <p className="font-bold">{label}</p>
        <p className="text-green-600">Ingresos: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}</p>
        <p className="text-red-600">Gastos: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[1].value)}</p>
        <p className="font-semibold pt-1 border-t mt-1">
          Balance: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value - payload[1].value)}
        </p>
      </div>
    );
  }
  return null;
};

const ChartMonthlyBalance: React.FC = () => {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Balance mensual</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="ingresos" fill="#4D5726" name="Ingresos" />
            <Bar dataKey="gastos" fill="#B8860B" name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartMonthlyBalance;
