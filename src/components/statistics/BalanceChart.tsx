
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NoDataDisplay from './NoDataDisplay';

interface BalanceChartProps {
  data: any[];
  year: string;
  hasData: boolean;
  currencyFormatter: (value: number) => string;
}

const BalanceChart = ({ data, year, hasData, currencyFormatter }: BalanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Anual {year}</CardTitle>
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
              <Line type="monotone" dataKey="balance" stroke="#4D5726" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <NoDataDisplay message="No hay datos de balance disponibles para este período" />
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceChart;
