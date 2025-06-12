
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NoDataDisplay from './NoDataDisplay';

interface MonthlyLineChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
  hasData: boolean;
  currencyFormatter: (value: number) => string;
  noDataMessage?: string;
}

const MonthlyLineChart = ({ 
  title, 
  data, 
  dataKey, 
  color, 
  hasData, 
  currencyFormatter,
  noDataMessage 
}: MonthlyLineChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip formatter={currencyFormatter} />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <NoDataDisplay message={noDataMessage || `No hay datos de ${title.toLowerCase()}`} />
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyLineChart;
