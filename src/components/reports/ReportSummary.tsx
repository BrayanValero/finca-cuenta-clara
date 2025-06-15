
import React from 'react';

interface ReportSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({
  totalIncome,
  totalExpense,
  balance
}) => {
  return (
    <div className="mt-6 border-t pt-4 grid grid-cols-3 gap-4">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Total Ingresos</h4>
        <p className="text-xl font-bold text-green-600">
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalIncome)}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Total Gastos</h4>
        <p className="text-xl font-bold text-red-600">
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(totalExpense)}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Balance</h4>
        <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(balance)}
        </p>
      </div>
    </div>
  );
};

export default ReportSummary;
