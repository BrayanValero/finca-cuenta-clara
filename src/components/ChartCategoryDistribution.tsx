
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Insumos', value: 4500 },
  { name: 'Mano de Obra', value: 3000 },
  { name: 'Maquinaria', value: 2000 },
  { name: 'Cosecha', value: 1500 },
  { name: 'Otros', value: 1000 },
];

// Colores complementarios a la paleta de la finca
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-bold">{payload[0].name}</p>
        <p>
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
          {" - "}
          {((payload[0].value / data.reduce((sum, entry) => sum + entry.value, 0)) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const ChartCategoryDistribution: React.FC<{ title?: string; type?: 'gastos' | 'ingresos' }> = ({ 
  title = "Distribución de gastos por categoría",
  type = "gastos" 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartCategoryDistribution;
