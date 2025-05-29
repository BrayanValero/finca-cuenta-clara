
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, Transaction } from '@/services/transactionService';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import { useAuth } from '@/contexts/AuthContext';
import MobileNav from '@/components/MobileNav';

// Colores complementarios a la paleta de la finca
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

const ChartDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch transactions data
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: getTransactions,
    enabled: !!user?.id
  });
  
  return (
    <>
      <MobileNav />
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
            <h2 className="text-3xl font-bold tracking-tight">Detalle de Distribuciones</h2>
            <p className="text-muted-foreground">Análisis detallado de gastos por descripción</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Cargando datos...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <ChartCategoryDistribution 
              title="Distribución de gastos por descripción" 
              type="gastos" 
              transactions={transactions} 
              showLegend={true}
              onClick={undefined} // Desactivamos el onClick en esta vista
            />
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Detalles por Descripción</h3>
              <div className="bg-white rounded-lg border shadow p-6">
                <div className="grid gap-4">
                  {Object.entries(
                    transactions
                      .filter(t => t.type === 'gasto')
                      .reduce((acc: Record<string, number>, transaction: Transaction) => {
                        const description = transaction.description || 'Sin descripción';
                        if (!acc[description]) {
                          acc[description] = 0;
                        }
                        acc[description] += Number(transaction.amount);
                        return acc;
                      }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([description, amount], index) => (
                      <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-3" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{description}</span>
                        </div>
                        <span className="font-mono">
                          {new Intl.NumberFormat('es-ES', { 
                            style: 'currency', 
                            currency: 'COP' 
                          }).format(amount)}
                        </span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChartDetail;
