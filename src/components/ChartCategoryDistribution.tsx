
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction } from '@/services/transactionService';
import { processDescriptionData, formatCurrency } from '@/utils/transactionUtils';

// Componente para mostrar cuando no hay datos
const NoDataDisplay = () => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
    <p className="mt-4">No hay datos disponibles</p>
  </div>
);

// Colores complementarios a la paleta de la finca
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

const CustomTooltip = ({ active, payload, data }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="font-bold">{payload[0].name}</p>
        <p>
          {formatCurrency(payload[0].value)}
          {" - "}
          {((payload[0].value / data.reduce((sum: number, entry: any) => sum + entry.value, 0)) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const ChartCategoryDistribution: React.FC<{ 
  title?: string; 
  type?: 'gastos' | 'ingresos';
  transactions?: Transaction[];
  showLegend?: boolean;
  onClick?: () => void;
}> = ({ 
  title = "Distribución de gastos por descripción",
  type = "gastos",
  transactions = [],
  showLegend = false,
  onClick
}) => {
  const navigate = useNavigate();
  const data = processDescriptionData(transactions, type);
  const hasData = data.length > 0;
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/detalle-distribuciones');
    }
  };

  return (
    <Card onClick={hasData ? handleClick : undefined} className={hasData ? "cursor-pointer hover:shadow-md transition-shadow" : ""}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {hasData ? (
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
              <Tooltip content={<CustomTooltip data={data} />} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <NoDataDisplay />
        )}
      </CardContent>
    </Card>
  );
};

export default ChartCategoryDistribution;
