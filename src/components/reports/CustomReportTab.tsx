
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ReportForm from '../ReportForm';
import { Transaction } from '@/services/transactionService';

interface CustomReportTabProps {
  transactions: Transaction[];
  setActiveReport: (report: { 
    title: string; 
    type: 'all' | 'incomes' | 'expenses' | 'descriptions'; 
    dateRange?: { start?: Date; end?: Date }; 
  } | null) => void;
}

const CustomReportTab = ({ transactions, setActiveReport }: CustomReportTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generar Informe Personalizado</CardTitle>
        <CardDescription>
          Configura y genera un informe con los parámetros que necesites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReportForm transactions={transactions} setActiveReport={setActiveReport} />
      </CardContent>
    </Card>
  );
};

export default CustomReportTab;
