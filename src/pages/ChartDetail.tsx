
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import ChartCategoryDistribution from '@/components/ChartCategoryDistribution';
import { useAuth } from '@/contexts/AuthContext';
import MobileNav from '@/components/MobileNav';

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
          <ChartCategoryDistribution 
            title="Distribución de gastos por descripción" 
            type="gastos" 
            transactions={transactions} 
            showLegend={true}
            onClick={undefined} // Desactivamos el onClick en esta vista
          />
        )}
      </div>
    </>
  );
};

export default ChartDetail;
