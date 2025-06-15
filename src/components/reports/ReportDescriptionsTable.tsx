
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ReportDescriptionsTableProps {
  descriptionSummary: Record<string, { income: number; expense: number }>;
}

const ReportDescriptionsTable: React.FC<ReportDescriptionsTableProps> = ({
  descriptionSummary
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Descripción</TableHead>
          <TableHead className="text-right">Ingresos</TableHead>
          <TableHead className="text-right">Gastos</TableHead>
          <TableHead className="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(descriptionSummary).map(([description, values]) => (
          <TableRow key={description}>
            <TableCell className="font-medium">{description}</TableCell>
            <TableCell className="text-right text-green-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.income)}
            </TableCell>
            <TableCell className="text-right text-red-600">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.expense)}
            </TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'COP' }).format(values.income - values.expense)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReportDescriptionsTable;
