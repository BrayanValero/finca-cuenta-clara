
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NoDataDisplay from './NoDataDisplay';

interface TrendChartProps {
  data: any[];
  hasData: boolean;
  currencyFormatter: (value: number) => string;
}

const TrendChart = ({ data, hasData, currencyFormatter }: TrendChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia Anual</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
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
  );
};

export default TrendChart;
