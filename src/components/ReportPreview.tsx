
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useReportData } from '@/hooks/useReportData';
import ReportChart from '@/components/reports/ReportChart';
import ReportTable from '@/components/reports/ReportTable';
import ReportDescriptionsTable from '@/components/reports/ReportDescriptionsTable';
import ReportSummary from '@/components/reports/ReportSummary';

interface ReportPreviewProps {
  transactions: Transaction[];
  title: string;
  dateRange?: { start?: Date; end?: Date };
  type?: 'all' | 'incomes' | 'expenses' | 'descriptions';
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  transactions,
  title,
  dateRange,
  type = 'all',
}) => {
  const reportData = useReportData({ transactions, dateRange, type });

  const {
    filteredTransactions,
    transactionsWithBalance,
    totalIncome,
    totalExpense,
    balance,
    descriptionSummary,
    chartData
  } = reportData;

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {dateRange?.start && dateRange?.end && (
            <div className="text-sm text-muted-foreground">
              {format(dateRange.start, 'PPP', { locale: es })} - {format(dateRange.end, 'PPP', { locale: es })}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No hay transacciones para el periodo seleccionado
            </div>
          ) : (
            <>
              <ReportChart 
                type={type}
                chartData={chartData}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                balance={balance}
              />

              {/* Table Section */}
              {type === 'descriptions' && descriptionSummary ? (
                <ReportDescriptionsTable descriptionSummary={descriptionSummary} />
              ) : (
                <ReportTable transactionsWithBalance={transactionsWithBalance} />
              )}
              
              <ReportSummary 
                totalIncome={totalIncome}
                totalExpense={totalExpense}
                balance={balance}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPreview;
