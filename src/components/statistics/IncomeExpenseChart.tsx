
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NoDataDisplay from './NoDataDisplay';

interface IncomeExpenseChartProps {
  data: any[];
  hasData: boolean;
  currencyFormatter: (value: number) => string;
}

const IncomeExpenseChart = ({ data, hasData, currencyFormatter }: IncomeExpenseChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparativa Ingresos vs Gastos</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
  );
};

export default IncomeExpenseChart;
