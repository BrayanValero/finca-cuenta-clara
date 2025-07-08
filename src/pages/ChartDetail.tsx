import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { normalizeDescription, formatCurrency } from '@/utils/transactionUtils';
import { Transaction } from '@/services/transactionService';

// Colores complementarios a la paleta de la finca
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

const ChartDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'gastos'; // Default to 'gastos' for backward compatibility
  
  const { data: transactions = [], isLoading } = useTransactions();

  // Process data for display based on type
  const processedData = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const filterType = type === 'ingresos' ? 'ingreso' : 'gasto';
    
    const grouped = transactions
      .filter(t => t.type === filterType)
      .reduce((acc: Record<string, number>, transaction: Transaction) => {
        const normalizedDescription = normalizeDescription(transaction.description || 'Sin descripción');
        if (!acc[normalizedDescription]) {
          acc[normalizedDescription] = 0;
        }
        acc[normalizedDescription] += Number(transaction.amount);
        return acc;
      }, {});
    
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [transactions, type]);

  const title = type === 'ingresos' ? 'Detalle de Distribución de Ingresos' : 'Detalle de Distribución de Gastos';
  const subtitle = type === 'ingresos' ? 'Análisis detallado de ingresos por descripción' : 'Análisis detallado de gastos por descripción';
  const noDataMessage = type === 'ingresos' ? 'No hay datos de ingresos disponibles' : 'No hay datos de gastos disponibles';
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-4">Detalles por Descripción</h3>
          <div className="bg-white rounded-lg border shadow p-6">
            <div className="grid gap-4">
              {processedData.length > 0 ? (
                processedData.map(([description, amount], index) => (
                  <div key={`${description}-${index}`} className="flex justify-between items-center p-3 border-b last:border-0">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{description}</span>
                    </div>
                    <span className="font-mono">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {noDataMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDetail;