
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, Transaction } from '@/services/transactionService';
import { useAuth } from '@/contexts/AuthContext';
import MobileNav from '@/components/MobileNav';

// Colores complementarios a la paleta de la finca
const COLORS = ['#4D5726', '#6B7B3A', '#3A4219', '#B8860B', '#D9A441'];

// Función para normalizar descripciones similares
const normalizeDescription = (description: string): string => {
  if (!description) return 'Sin descripción';
  
  const normalized = description.toLowerCase().trim();
  
  // Normalizar variaciones de "semana marcos"
  if (normalized.includes('marcos') && (normalized.includes('semana') || normalized.includes('pago'))) {
    return 'semana marcos';
  }
  
  // Normalizar variaciones de "gasolina"
  if (normalized === 'gasolina' || normalized === ' gasolina' || normalized === 'gasolina ') {
    return 'gasolina';
  }
  
  // Normalizar variaciones de "guadañador" (incluyendo "guarañador")
  if (normalized === 'guarañador' || normalized === 'guadañador') {
    return 'guadañador';
  }
  
  // Normalizar variaciones de "gasolina guadaña"
  if (normalized === 'gasolina guadaña' || normalized === 'gasolina guadaña') {
    return 'gasolina guadaña';
  }
  
  return description;
};

const ChartDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch transactions data
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: getTransactions,
    enabled: !!user?.id
  });

  // Process data for display
  const processedData = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const grouped = transactions
      .filter(t => t.type === 'gasto')
      .reduce((acc: Record<string, number>, transaction: Transaction) => {
        const normalizedDescription = normalizeDescription(transaction.description || 'Sin descripción');
        if (!acc[normalizedDescription]) {
          acc[normalizedDescription] = 0;
        }
        acc[normalizedDescription] += Number(transaction.amount);
        return acc;
      }, {});
    
    return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  }, [transactions]);
  
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
                        {new Intl.NumberFormat('es-ES', { 
                          style: 'currency', 
                          currency: 'COP' 
                        }).format(amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay datos de gastos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChartDetail;
